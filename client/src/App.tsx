import { useState } from "react";
import AddressInput from "./components/Address";
import Departures from "./components/Departures";
//import Weather from "./components/Weather";
import TrafficSituation from "./components/Traffic";
//import Joke from "./components/Joke";

function App() {
   //state to store latitude and longitude. Initially set to null.
   const [lat, setLat] = useState<number | null>(null);
   const [lng, setLng] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null); //stores potential error messages
   const [fetchJoke, setFetchJoke] = useState<boolean>(false);
   const [addressSubmitted, setAddressSubmitted] = useState<boolean>(false);

   const handleGeocode = (lat: number, lng: number) => {
      setLat(lat);
      setLng(lng);
      setError(null); //clear any previous error when success.
      //toggle the joke fetch state to trigger a new joke
      //prev ensures the last value of fetchJoke is used
      setFetchJoke((prev) => !prev);
      setAddressSubmitted(true); // Set address submitted to true when the user inputs an address
   };

   const handleGeocodeError = (errorMessage: string) => {
      setError(errorMessage);
      setLat(null);
      setLng(null);
   };

   return (
      <div className="p-4 bg-custom-bg min-h-screen">
         <div className="max-w-screen-xl mx-auto">
            {!addressSubmitted && (
               <div className="instructions bg-[#E4602F] text-white p-4 rounded-md mb-4">
                  <p>
                     Enter an address to see local traffic departures, traffic
                     information, and weather updates.
                  </p>
               </div>
            )}

            <AddressInput
               onGeocode={handleGeocode}
               onError={handleGeocodeError}
            />

            {lat && lng && (
               <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-wrap mt-6 md:space-y-8 space-y-6">
                  {/* First Row: Departures and Local Weather */}
                  <div className="flex flex-col md:flex-row md:space-x-4 md:w-full lg:w-full">
                     <div className="flex-1 mb-4 md:mb-0 lg:pt-0 md:pt-0">
                        <Departures lat={lat} lng={lng} />
                     </div>

                     <div className="flex-1 mb-4 md:mb-0">
                        <div className="p-4 border-2 border-[#E4602F] rounded-md bg-white">
                           <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
                              Local Weather
                           </h2>
                           {/* Replace with actual Weather component */}
                        </div>
                     </div>
                  </div>

                  {/* Second Row: Dad Jokes and Traffic Updates */}
                  <div className="flex flex-col w-full">
                    <div className="flex-1">
                      <TrafficSituation coordinates={{ lat, lng }} />
                    </div>
                  </div>

               </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
         </div>
      </div>
   );
}

export default App;