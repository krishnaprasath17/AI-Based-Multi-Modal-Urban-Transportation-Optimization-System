import React, { useState } from 'react';
import { MapPin, Users, Settings, Clock } from 'lucide-react';
import { UserPreferences, Location } from '../types';

interface InputFormProps {
  onSearch: (start: Location, destination: Location, preferences: UserPreferences) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSearch, isLoading }) => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState<'cheapest' | 'fastest' | 'comfortable' | 'balanced'>('balanced');
  const [passengers, setPassengers] = useState(1);
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [rememberRoutes, setRememberRoutes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startLocation.trim() || !destination.trim()) {
      alert('Please enter both start and destination locations');
      return;
    }

    const start: Location = {
      name: startLocation,
      coordinates: { lat: 12.9716, lng: 77.5946 } // Mock coordinates for Bangalore
    };

    const dest: Location = {
      name: destination,
      coordinates: { lat: 12.9698, lng: 77.7500 } // Mock coordinates for Whitefield
    };

    const preferences: UserPreferences = {
      preference,
      budget,
      passengers,
      rememberRoutes
    };

    onSearch(start, dest, preferences);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-secondary-800">Plan Your Journey</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Start Location
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="e.g., Koramangala, Bangalore"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Whitefield, Bangalore"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Travel Preference
          </label>
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value as any)}
            className="input-field"
          >
            <option value="balanced">Balanced (Recommended)</option>
            <option value="cheapest">Cheapest</option>
            <option value="fastest">Fastest</option>
            <option value="comfortable">Most Comfortable</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Passengers
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Budget (₹)
            </label>
            <input
              type="number"
              min="0"
              value={budget || ''}
              onChange={(e) => setBudget(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Optional"
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberRoutes"
            checked={rememberRoutes}
            onChange={(e) => setRememberRoutes(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="rememberRoutes" className="text-sm text-secondary-700">
            Remember my usual routes for personalized recommendations
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Planning Journey...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              Find Best Routes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
