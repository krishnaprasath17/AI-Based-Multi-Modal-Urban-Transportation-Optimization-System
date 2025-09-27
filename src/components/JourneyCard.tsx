import React from 'react';
import { Clock, DollarSign, Shield, Leaf, ArrowRight, AlertTriangle } from 'lucide-react';
import { JourneyOption, BudgetAlert } from '../types';

interface JourneyCardProps {
  option: JourneyOption;
  index: number;
  onSelect: (option: JourneyOption) => void;
  budgetAlert?: BudgetAlert;
  isSelected?: boolean;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ 
  option, 
  index, 
  onSelect, 
  budgetAlert, 
  isSelected = false 
}) => {
  const getComfortColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:border-primary-300'
      }`}
      onClick={() => onSelect(option)}
    >
      {/* Header with ranking and budget alert */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
            Option {index + 1}
          </span>
          {budgetAlert && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Over budget by ₹{budgetAlert.amount}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-secondary-600">
          {option.description}
        </div>
      </div>

      {/* Transport sequence */}
      <div className="flex items-center gap-2 mb-4">
        {option.sequence.map((mode, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-1">
              <span className="text-2xl">{mode.icon}</span>
              <span className="text-sm font-medium text-secondary-700">{mode.name}</span>
            </div>
            {idx < option.sequence.length - 1 && (
              <ArrowRight className="w-4 h-4 text-secondary-400" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary-500" />
          <div>
            <div className="text-sm font-medium text-secondary-800">{option.totalTime} mins</div>
            <div className="text-xs text-secondary-600">Travel Time</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-secondary-500" />
          <div>
            <div className="text-sm font-medium text-secondary-800">₹{option.totalCost}</div>
            <div className="text-xs text-secondary-600">Total Cost</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-secondary-500" />
          <div>
            <div className={`text-sm font-medium ${getComfortColor(option.comfortRating)}`}>
              {option.comfortRating}/10
            </div>
            <div className="text-xs text-secondary-600">Comfort</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-secondary-500" />
          <div>
            <div className={`text-sm font-medium ${getSafetyColor(option.safetyRating)}`}>
              {option.safetyRating}/10
            </div>
            <div className="text-xs text-secondary-600">Safety</div>
          </div>
        </div>
      </div>

      {/* Budget alert suggestion */}
      {budgetAlert && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-red-800">Budget Alert</div>
              <div className="text-xs text-red-600 mt-1">{budgetAlert.suggestion}</div>
            </div>
          </div>
        </div>
      )}

      {/* Cost breakdown */}
      <div className="border-t border-secondary-200 pt-3">
        <div className="text-xs text-secondary-600 mb-2">Cost Breakdown:</div>
        <div className="space-y-1">
          {option.breakdown.map((segment, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-secondary-600">
                {segment.mode.icon} {segment.mode.name} ({segment.duration}min)
              </span>
              <span className="font-medium text-secondary-800">₹{segment.cost}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Select button */}
      <button
        className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isSelected
            ? 'bg-primary-600 text-white'
            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
        }`}
      >
        {isSelected ? 'Selected' : 'Select This Route'}
      </button>
    </div>
  );
};

export default JourneyCard;
