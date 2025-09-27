export interface JourneyOption {
  id: string;
  sequence: TransportMode[];
  totalCost: number;
  totalTime: number;
  comfortRating: number;
  safetyRating: number;
  carbonFootprint: number;
  description: string;
  breakdown: JourneyBreakdown[];
}

export interface TransportMode {
  type: 'bus' | 'metro' | 'train' | 'cab' | 'bike' | 'walk';
  name: string;
  icon: string;
  color: string;
}

export interface JourneyBreakdown {
  mode: TransportMode;
  duration: number;
  cost: number;
  distance: number;
  instructions: string;
}

export interface UserPreferences {
  preference: 'cheapest' | 'fastest' | 'comfortable' | 'balanced';
  budget?: number;
  passengers: number;
  rememberRoutes: boolean;
  avoidModes?: string[];
  preferredModes?: string[];
}

export interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface UserHistory {
  userId: string;
  routes: {
    start: Location;
    destination: Location;
    selectedOption: JourneyOption;
    timestamp: Date;
  }[];
  preferences: {
    preferredModes: string[];
    avoidedModes: string[];
    averageBudget: number;
  };
}

export interface BudgetAlert {
  exceeds: boolean;
  amount: number;
  suggestion: string;
}
