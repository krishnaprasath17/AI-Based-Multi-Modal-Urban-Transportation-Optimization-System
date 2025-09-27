import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, DollarSign, Star } from 'lucide-react';
import { UserPreferences, JourneyOption } from '../types';

interface PersonalizationPanelProps {
  userId: string;
  userHistory: any;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({ 
  userId, 
  userHistory, 
  onUpdatePreferences 
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (userHistory && userHistory.totalTrips > 0) {
      generateInsights();
    }
  }, [userHistory]);

  const generateInsights = () => {
    if (!userHistory) return;

    const modeFrequency = userHistory.selectedModes.reduce((acc: any, mode: string) => {
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    const preferredModes = Object.keys(modeFrequency)
      .sort((a, b) => modeFrequency[b] - modeFrequency[a])
      .slice(0, 3);

    const averageCost = userHistory.averageBudget;
    const totalTrips = userHistory.totalTrips;

    const insights = {
      preferredModes,
      averageCost,
      totalTrips,
      savings: calculateSavings(),
      recommendations: generateRecommendations()
    };

    setInsights(insights);
  };

  const calculateSavings = () => {
    // Mock calculation - in real app, compare against most expensive option
    return Math.floor(Math.random() * 500) + 200;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    if (userHistory.averageBudget > 200) {
      recommendations.push("Consider using public transport more often to save money");
    }
    
    if (userHistory.selectedModes.includes('cab') && userHistory.selectedModes.includes('metro')) {
      recommendations.push("You often use both cabs and metro - try our balanced options");
    }
    
    recommendations.push("Based on your history, we'll prioritize faster routes during peak hours");
    
    return recommendations;
  };

  if (!userHistory || userHistory.totalTrips === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-800">AI Personalization</h3>
        </div>
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-600">
            Start using the app to get personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-800">AI Insights</h3>
        </div>
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {showInsights ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{userHistory.totalTrips}</div>
          <div className="text-sm text-secondary-600">Total Trips</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">₹{insights?.savings || 0}</div>
          <div className="text-sm text-secondary-600">Money Saved</div>
        </div>
      </div>

      {showInsights && insights && (
        <div className="space-y-4">
          {/* Preferred Modes */}
          <div>
            <h4 className="font-medium text-secondary-800 mb-2">Your Preferred Transport</h4>
            <div className="flex gap-2">
              {insights.preferredModes.map((mode: string, index: number) => (
                <span
                  key={mode}
                  className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Average Spending */}
          <div>
            <h4 className="font-medium text-secondary-800 mb-2">Spending Pattern</h4>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">
                Average cost per trip: ₹{Math.round(insights.averageCost)}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-secondary-800 mb-2">AI Recommendations</h4>
            <div className="space-y-2">
              {insights.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm text-secondary-600">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Learning Status</span>
            </div>
            <div className="text-xs text-blue-700">
              Our AI is learning your preferences from {userHistory.totalTrips} trip{userHistory.totalTrips !== 1 ? 's' : ''}. 
              Recommendations will improve over time.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationPanel;
