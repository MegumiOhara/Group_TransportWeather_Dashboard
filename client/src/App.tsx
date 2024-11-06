import { useState } from "react";
import AddressInput from "./components/Address";
import Departures from "./components/Departures";
import TrafficSituation from "./components/Traffic";
import DashboardLayout from "./components/DashboardLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrain,
  faCloud,
  faTrafficLight 
} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);

  const handleGeocode = (lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
    setError(null);
    setAddressSubmitted(true);
  };

  const handleGeocodeError = (errorMessage: string) => {
    setError(errorMessage);
    setLat(null);
    setLng(null);
  };

  return (
    <DashboardLayout>
      {/* Address Section */}
      <AddressInput
        onGeocode={handleGeocode}
        onError={handleGeocodeError}
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
        {/* Transport Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-[#E4602F]">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <FontAwesomeIcon icon={faTrain} className="mr-2 text-[#E4602F]" />
            Transport Departures
          </h2>
          <div className="min-h-[200px]">
            {!addressSubmitted ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Enter an address to see nearby transport options
              </div>
            ) : (
              <Departures lat={lat!} lng={lng!} />
            )}
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-[#E4602F]">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <FontAwesomeIcon icon={faCloud} className="mr-2 text-[#E4602F]" />
            Local Weather
          </h2>
          <div className="min-h-[200px]">
            {!addressSubmitted ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Enter an address to see local weather
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                Weather information will be displayed here
              </div>
            )}
          </div>
        </div>

        {/* Traffic Updates - Full Width */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border-[#E4602F]">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <FontAwesomeIcon icon={faTrafficLight} className="mr-2 text-[#E4602F]" />
            Traffic Updates
          </h2>
          <div className="min-h-[200px]">
            {!addressSubmitted ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Enter an address to see traffic updates
              </div>
            ) : (
              <TrafficSituation coordinates={{ lat: lat!, lng: lng! }} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
