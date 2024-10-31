import { useState } from "react";
import AddressInput from "./components/Address";
import TrafficSituation from "./components/Traffic";

interface Coordinates {
  lat: number;
  lng: number;
}

function App() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string>("");

  const handleGeocode = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setError("");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCoordinates(null);
  };

  return (
    <div className="min-h-screen bg-[#FEF4F1]">
      <AddressInput 
        onGeocode={handleGeocode} 
        onError={handleError}
      />

      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {coordinates && !error && (
        <div className="container mx-auto px-4 py-6">
          <div className="md:col-span-2">
            <TrafficSituation coordinates={coordinates} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;