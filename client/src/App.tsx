import { useState } from "react";
import AddressInput from "./components/Address";
import Departures from "./components/Departures";
import WeatherPanel from "./components/WeatherPanel";
import TrafficSituation from "./components/Traffic";
import DashboardLayout from "./components/DashboardLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faTrain,
   faCloud,
   faTrafficLight,
} from "@fortawesome/free-solid-svg-icons";

function App() {
   const [lat, setLat] = useState<number | null>(null);
   const [lng, setLng] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);

   // Function to update the lat/lng state when geocoding is successful
   const handleGeocode = (lat: number, lng: number) => {
      setLat(lat);
      setLng(lng);
      setError(null); // Clear any previous error on success
      setAddressSubmitted(true); // Set address submitted to true
   };

   // Function to handle geocoding errors
   const handleGeocodeError = (errorMessage: string) => {
      setError(errorMessage);
      setLat(null);
      setLng(null);
   };

   return (
      <DashboardLayout>
         {/* Display error message if there is an error */}
         {error && <p className="text-red-500">{error}</p>}
         {/* Address Section */}
         <AddressInput onGeocode={handleGeocode} onError={handleGeocodeError} />

         {/* Dashboard Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
            {/* Transport Card */}
            {!addressSubmitted ? (
               <div className="w-full max-w-[769px] mx-auto p-2 border-2 border-[#E4602F] rounded-lg bg-white">
                  <h2 className="flex items-center text-base font-semibold text-[#D13C1D] font-lato mb-[11px]">
                     <FontAwesomeIcon
                        icon={faTrain}
                        className="mr-2 text-[#D13C1D]"
                     />
                     Transport Departures
                  </h2>
                  <div className="flex items-center justify-center h-[200px] md:h-[400px] text-gray-500">
                     Enter an address to see nearby transport options
                  </div>
               </div>
            ) : (
               <Departures lat={lat!} lng={lng!} />
            )}

            {/* Weather Card */}
            {!addressSubmitted ? (
               <div className="w-full max-w-[769px] mx-auto p-2 border-2 border-[#E4602F] rounded-lg bg-white">
                  <h2 className="flex items-center text-base font-semibold text-[#D13C1D] font-lato mb-[11px]">
                     <FontAwesomeIcon
                        icon={faCloud}
                        className="mr-2 text-[#D13C1D]"
                     />
                     Local Weather
                  </h2>
                  <div className="flex items-center justify-center h-[200px] md:h-[400px] text-gray-500">
                     Enter an address to see local weather
                  </div>
               </div>
            ) : (
               <WeatherPanel lat={lat!} lng={lng!} />
            )}

            {/* Traffic Updates - Full Width */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#E4602F]">
               <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <FontAwesomeIcon
                     icon={faTrafficLight}
                     className="mr-2 text-[#E4602F]"
                  />
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
