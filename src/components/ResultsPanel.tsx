import React, { useState } from 'react';
import { Route, CreditCard, QrCode, CheckCircle } from 'lucide-react';
import { JourneyOption, UserPreferences, BudgetAlert } from '../types';
import JourneyCard from './JourneyCard';

interface ResultsPanelProps {
  options: JourneyOption[];
  preferences: UserPreferences;
  budgetAlerts: BudgetAlert[];
  onBookJourney: (option: JourneyOption) => void;
  isLoading: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  options, 
  preferences, 
  budgetAlerts, 
  onBookJourney,
  isLoading 
}) => {
  const [selectedOption, setSelectedOption] = useState<JourneyOption | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'confirmation'>('select');

  const handleSelectOption = (option: JourneyOption) => {
    setSelectedOption(option);
    setPaymentStep('select');
  };

  const handleBookJourney = () => {
    if (!selectedOption) return;
    
    setPaymentStep('payment');
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('confirmation');
      onBookJourney(selectedOption);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <div className="text-secondary-600">AI is analyzing the best routes for you...</div>
          </div>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Route className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-800 mb-2">No Routes Found</h3>
          <p className="text-secondary-600">Try adjusting your preferences or locations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Route className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-secondary-800">AI Recommended Routes</h2>
        </div>
        <div className="text-sm text-secondary-600">
          Found {options.length} route{options.length !== 1 ? 's' : ''} based on your preferences
        </div>
      </div>

      {/* Journey Options */}
      <div className="space-y-4">
        {options.map((option, index) => (
          <JourneyCard
            key={option.id}
            option={option}
            index={index}
            onSelect={handleSelectOption}
            budgetAlert={budgetAlerts[index]}
            isSelected={selectedOption?.id === option.id}
          />
        ))}
      </div>

      {/* Payment Section */}
      {selectedOption && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-800">Book Your Journey</h3>
          </div>

          {paymentStep === 'select' && (
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-800">Selected Route</span>
                </div>
                <div className="text-sm text-primary-700">
                  {selectedOption.sequence.map(mode => mode.name).join(' → ')} • 
                  ₹{selectedOption.totalCost} • {selectedOption.totalTime} mins
                </div>
              </div>

              <button
                onClick={handleBookJourney}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay & Book Journey (₹{selectedOption.totalCost})
              </button>
            </div>
          )}

          {paymentStep === 'payment' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <div className="text-secondary-600">Processing payment...</div>
              <div className="text-sm text-secondary-500 mt-2">
                Splitting payment across {selectedOption.sequence.length} transport mode{selectedOption.sequence.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">Journey Booked!</h3>
              <p className="text-secondary-600 mb-4">
                Your multi-modal journey has been confirmed
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Your QR Code is Ready</span>
                </div>
                <div className="text-sm text-green-700">
                  Show this QR code to access all transport modes in your journey
                </div>
              </div>

              <div className="text-sm text-secondary-600">
                <div>Total Paid: ₹{selectedOption.totalCost}</div>
                <div>Journey Time: {selectedOption.totalTime} minutes</div>
                <div>Comfort Rating: {selectedOption.comfortRating}/10</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
