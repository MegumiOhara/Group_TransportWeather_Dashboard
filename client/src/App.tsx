import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddressInput from './components/Address';
import Traffic from './components/Traffic';
import Weather from './components/Weather';
import Departures from './components/Departures';
import mapIcon from './images/map-location-dot-solid.svg';

const queryClient = new QueryClient();

interface Coordinates {
  lat: number;
  lng: number;
}

function App() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string>('');

  const handleGeocode = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCoordinates(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-pink-50">
        {/* Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-start mb-4">
            <img
              src={mapIcon}
              alt="Map Location Icon"
              className="w-[50px] h-[44px] mr-3"
            />
            <h1 className="text-[30px] text-slate-950 font-bold">
              Local Traffic & Weather Dashboard
            </h1>
          </div>

          {/* Search Box */}
          <div className="mb-8">
            <AddressInput onGeocode={handleGeocode} onError={handleError} />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Content Grid */}
          {coordinates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#FF4D00] mb-4">Transport Departures</h2>
                <Departures coordinates={coordinates} />
              </div>

              {/* Right Column */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#FF4D00] mb-4">Local Weather</h2>
                <Weather coordinates={coordinates} />
              </div>

              {/* Full Width Traffic Section */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#FF4D00] mb-4">Traffic Updates</h2>
                <Traffic coordinates={coordinates} />
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
