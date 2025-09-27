import React, { useState, useEffect } from 'react';
import { MapPin, Brain, Route, CreditCard } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultsPanel from './components/ResultsPanel';
import PersonalizationPanel from './components/PersonalizationPanel';
import { JourneyOption, UserPreferences, Location, BudgetAlert } from './types';
import { AIJourneyPlanner } from './utils/aiPlanner';

const App: React.FC = () => {
  const [journeyOptions, setJourneyOptions] = useState<JourneyOption[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences | null>(null);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [userHistory, setUserHistory] = useState<any>(null);
  const [aiPlanner] = useState(new AIJourneyPlanner());

  useEffect(() => {
    // Load user history from localStorage
    const savedHistory = localStorage.getItem(`userHistory_${userId}`);
    if (savedHistory) {
      setUserHistory(JSON.parse(savedHistory));
    }
  }, [userId]);

  const handleSearch = async (start: Location, destination: Location, preferences: UserPreferences) => {
    setIsLoading(true);
    setCurrentPreferences(preferences);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate journey options using AI planner
      const options = aiPlanner.generateJourneyOptions(start, destination, preferences);
      setJourneyOptions(options);
      
      // Check for budget alerts
      const alerts = options.map(option => 
        aiPlanner.checkBudgetAlert(option, preferences.budget)
      ).filter(alert => alert !== null) as BudgetAlert[];
      
      setBudgetAlerts(alerts);
      
    } catch (error) {
      console.error('Error generating journey options:', error);
      setJourneyOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookJourney = (option: JourneyOption) => {
    // Learn from user choice
    if (currentPreferences) {
      aiPlanner.learnFromUserChoice(userId, option, currentPreferences);
      
      // Update user history
      const updatedHistory = {
        ...userHistory,
        totalTrips: (userHistory?.totalTrips || 0) + 1,
        selectedModes: [...(userHistory?.selectedModes || []), ...option.sequence.map(mode => mode.type)],
        averageBudget: userHistory ? 
          (userHistory.averageBudget * userHistory.totalTrips + option.totalCost) / (userHistory.totalTrips + 1) :
          option.totalCost
      };
      
      setUserHistory(updatedHistory);
      localStorage.setItem(`userHistory_${userId}`, JSON.stringify(updatedHistory));
    }
    
    // In a real app, this would integrate with payment APIs
    console.log('Journey booked:', option);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-800">MobilityX 2.0</h1>
                <p className="text-sm text-secondary-600">AI-Powered Commuter Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-secondary-600">
                <Brain className="w-4 h-4" />
                <span>AI Learning Active</span>
              </div>
              <div className="text-sm text-secondary-500">
                User: {userId.slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <InputForm onSearch={handleSearch} isLoading={isLoading} />
            
            {/* Personalization Panel */}
            <div className="mt-6">
              <PersonalizationPanel
                userId={userId}
                userHistory={userHistory}
                onUpdatePreferences={(prefs) => {
                  if (currentPreferences) {
                    setCurrentPreferences({ ...currentPreferences, ...prefs });
                  }
                }}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <ResultsPanel
              options={journeyOptions}
              preferences={currentPreferences || {
                preference: 'balanced',
                passengers: 1,
                rememberRoutes: false
              }}
              budgetAlerts={budgetAlerts}
              onBookJourney={handleBookJourney}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-secondary-600">
              <div className="flex items-center gap-1">
                <Route className="w-4 h-4" />
                <span>Multi-Modal Transport</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <span>Unified Payments</span>
              </div>
            </div>
            <div className="text-sm text-secondary-500">
              © 2024 MobilityX 2.0 - AI Commuter Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
