import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddressInput from "./components/Address";
import TrafficSituation from "./components/Traffic";

// Create Query Client for react-query, which allows caching and background updates for fetched data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Defines the structure for latitude and longitude coordinates
interface Coordinates {
  lat: number;
  lng: number;
}

// Main App Component
function App() {
  // State management for coordinates and error messages
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string>("");

  // Success handler for geocoding, sets coordinates and clears errors
  const handleGeocode = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setError("");
  };

  // Error handler for geocoding, clears coordinates and sets error message
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCoordinates(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#FEF4F1]">
        {/* Address input field to fetch coordinates */}
        <AddressInput onGeocode={handleGeocode} onError={handleError} />

        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Traffic Section, displays only when coordinates are available */}
        {coordinates && (
          <div className="container mx-auto px-4 py-6">
            {/* [START] Weather Component Section */}
            {/* Weather component will be added here */}
            {/* [END] Weather Component Section */}

            {/* [START] Departures Component Section */}
            {/* Departures component will be added here */}
            {/* [END] Departures Component Section */}

            {/* Traffic Component */}
            <div className="md:col-span-2">
              <TrafficSituation coordinates={coordinates} />
            </div>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
