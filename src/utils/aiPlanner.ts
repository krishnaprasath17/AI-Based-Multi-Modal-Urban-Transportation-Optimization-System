import { JourneyOption, TransportMode, JourneyBreakdown, UserPreferences, Location, BudgetAlert } from '../types';

// Mock transport modes with icons and colors
export const transportModes: TransportMode[] = [
  { type: 'bus', name: 'Bus', icon: '🚌', color: 'bg-blue-500' },
  { type: 'metro', name: 'Metro', icon: '🚇', color: 'bg-purple-500' },
  { type: 'train', name: 'Train', icon: '🚆', color: 'bg-green-500' },
  { type: 'cab', name: 'Cab', icon: '🚗', color: 'bg-yellow-500' },
  { type: 'bike', name: 'Bike Share', icon: '🚲', color: 'bg-orange-500' },
  { type: 'walk', name: 'Walk', icon: '🚶', color: 'bg-gray-500' }
];

// Mock AI Journey Planner
export class AIJourneyPlanner {
  private userHistory: Map<string, any> = new Map();

  generateJourneyOptions(
    start: Location,
    destination: Location,
    preferences: UserPreferences
  ): JourneyOption[] {
    // Mock data for demonstration
    const mockOptions: JourneyOption[] = [
      {
        id: '1',
        sequence: [
          { type: 'bus', name: 'Bus', icon: '🚌', color: 'bg-blue-500' },
          { type: 'metro', name: 'Metro', icon: '🚇', color: 'bg-purple-500' }
        ],
        totalCost: 50,
        totalTime: 55,
        comfortRating: 7,
        safetyRating: 8,
        carbonFootprint: 2.5,
        description: 'Bus to Metro Station, then Metro to destination',
        breakdown: [
          {
            mode: { type: 'bus', name: 'Bus', icon: '🚌', color: 'bg-blue-500' },
            duration: 20,
            cost: 15,
            distance: 8,
            instructions: 'Take Bus 401 from Koramangala to MG Road Metro Station'
          },
          {
            mode: { type: 'metro', name: 'Metro', icon: '🚇', color: 'bg-purple-500' },
            duration: 35,
            cost: 35,
            distance: 25,
            instructions: 'Take Purple Line Metro from MG Road to Whitefield'
          }
        ]
      },
      {
        id: '2',
        sequence: [
          { type: 'cab', name: 'Cab', icon: '🚗', color: 'bg-yellow-500' }
        ],
        totalCost: 250,
        totalTime: 40,
        comfortRating: 9,
        safetyRating: 7,
        carbonFootprint: 8.5,
        description: 'Direct cab ride to destination',
        breakdown: [
          {
            mode: { type: 'cab', name: 'Cab', icon: '🚗', color: 'bg-yellow-500' },
            duration: 40,
            cost: 250,
            distance: 35,
            instructions: 'Direct cab from Koramangala to Whitefield'
          }
        ]
      },
      {
        id: '3',
        sequence: [
          { type: 'bike', name: 'Bike Share', icon: '🚲', color: 'bg-orange-500' },
          { type: 'metro', name: 'Metro', icon: '🚇', color: 'bg-purple-500' }
        ],
        totalCost: 30,
        totalTime: 60,
        comfortRating: 5,
        safetyRating: 6,
        carbonFootprint: 1.2,
        description: 'Bike to Metro Station, then Metro to destination',
        breakdown: [
          {
            mode: { type: 'bike', name: 'Bike Share', icon: '🚲', color: 'bg-orange-500' },
            duration: 15,
            cost: 10,
            distance: 5,
            instructions: 'Ride bike from Koramangala to nearest Metro Station'
          },
          {
            mode: { type: 'metro', name: 'Metro', icon: '🚇', color: 'bg-purple-500' },
            duration: 45,
            cost: 20,
            distance: 30,
            instructions: 'Take Metro from nearest station to Whitefield'
          }
        ]
      },
      {
        id: '4',
        sequence: [
          { type: 'walk', name: 'Walk', icon: '🚶', color: 'bg-gray-500' },
          { type: 'bus', name: 'Bus', icon: '🚌', color: 'bg-blue-500' },
          { type: 'train', name: 'Train', icon: '🚆', color: 'bg-green-500' }
        ],
        totalCost: 35,
        totalTime: 75,
        comfortRating: 6,
        safetyRating: 9,
        carbonFootprint: 1.8,
        description: 'Walk to Bus Stop, Bus to Station, Train to destination',
        breakdown: [
          {
            mode: { type: 'walk', name: 'Walk', icon: '🚶', color: 'bg-gray-500' },
            duration: 5,
            cost: 0,
            distance: 0.5,
            instructions: 'Walk 5 minutes to nearest bus stop'
          },
          {
            mode: { type: 'bus', name: 'Bus', icon: '🚌', color: 'bg-blue-500' },
            duration: 25,
            cost: 15,
            distance: 12,
            instructions: 'Take Bus 42 to Railway Station'
          },
          {
            mode: { type: 'train', name: 'Train', icon: '🚆', color: 'bg-green-500' },
            duration: 45,
            cost: 20,
            distance: 28,
            instructions: 'Take local train from Railway Station to Whitefield'
          }
        ]
      }
    ];

    // Apply AI ranking based on preferences
    return this.rankOptions(mockOptions, preferences);
  }

  private rankOptions(options: JourneyOption[], preferences: UserPreferences): JourneyOption[] {
    const rankedOptions = [...options];

    switch (preferences.preference) {
      case 'cheapest':
        return rankedOptions.sort((a, b) => a.totalCost - b.totalCost);
      case 'fastest':
        return rankedOptions.sort((a, b) => a.totalTime - b.totalTime);
      case 'comfortable':
        return rankedOptions.sort((a, b) => b.comfortRating - a.comfortRating);
      case 'balanced':
        return rankedOptions.sort((a, b) => {
          const scoreA = this.calculateBalancedScore(a);
          const scoreB = this.calculateBalancedScore(b);
          return scoreB - scoreA;
        });
      default:
        return rankedOptions;
    }
  }

  private calculateBalancedScore(option: JourneyOption): number {
    // Balanced scoring: considers cost, time, comfort, and safety
    const costScore = Math.max(0, 100 - (option.totalCost / 3)); // Lower cost = higher score
    const timeScore = Math.max(0, 100 - (option.totalTime / 2)); // Lower time = higher score
    const comfortScore = option.comfortRating * 10;
    const safetyScore = option.safetyRating * 10;
    
    return (costScore * 0.3) + (timeScore * 0.3) + (comfortScore * 0.2) + (safetyScore * 0.2);
  }

  checkBudgetAlert(option: JourneyOption, budget?: number): BudgetAlert | null {
    if (!budget || option.totalCost <= budget) {
      return null;
    }

    const excess = option.totalCost - budget;
    let suggestion = '';

    if (option.sequence.some(mode => mode.type === 'cab')) {
      suggestion = 'Consider using Metro instead of Cab to reduce cost';
    } else if (option.sequence.some(mode => mode.type === 'metro')) {
      suggestion = 'Consider using Bus instead of Metro to reduce cost';
    } else {
      suggestion = 'Consider walking or cycling for shorter distances';
    }

    return {
      exceeds: true,
      amount: excess,
      suggestion
    };
  }

  learnFromUserChoice(userId: string, selectedOption: JourneyOption, preferences: UserPreferences): void {
    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, {
        preferences: [],
        selectedModes: [],
        averageBudget: 0,
        totalTrips: 0
      });
    }

    const userData = this.userHistory.get(userId);
    userData.preferences.push(preferences.preference);
    userData.selectedModes.push(...selectedOption.sequence.map(mode => mode.type));
    userData.averageBudget = (userData.averageBudget * userData.totalTrips + selectedOption.totalCost) / (userData.totalTrips + 1);
    userData.totalTrips++;

    this.userHistory.set(userId, userData);
  }

  getPersonalizedRecommendations(userId: string): Partial<UserPreferences> {
    if (!this.userHistory.has(userId)) {
      return {};
    }

    const userData = this.userHistory.get(userId);
    const modeFrequency = userData.selectedModes.reduce((acc: any, mode: string) => {
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    const preferredModes = Object.keys(modeFrequency)
      .sort((a, b) => modeFrequency[b] - modeFrequency[a])
      .slice(0, 3);

    return {
      preferredModes,
      averageBudget: userData.averageBudget
    };
  }
}
