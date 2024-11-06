
import { useState } from "react";
import AddressInput from "./components/Address";
import TrafficStatusUpdates from "./components/Traffic";
import Departures from "./components/Departures";
import TrafficSituation from "./components/Traffic";
import WeatherPanel from "./components/WeatherPanel";
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

   //Function will be passed to the AddressInput component.
   //it will update the lat/lng state when geocoding is successful
   const handleGeocode = (lat: number, lng: number) => {
      setLat(lat);
      setLng(lng);
      setError(null); //clear any previous error when success.
      //toggle the joke fetch state to trigger a new joke
      //prev ensures the last value of fetchJoke is used
      //setFetchJoke((prev) => !prev);
      setAddressSubmitted(true); // Set address submitted to true when the user inputs an address
   };

   //Function to handle geocoding errors
   const handleGeocodeError = (errorMessage: string) => {
      setError(errorMessage);
      setLat(null);
      setLng(null);
   };

   // const response= await axios.get("http://localhost:3000/api");
   //console.log(response);

   return (
      <div className="p-4 bg-custom-bg min-h-screen">
         <div className="max-w-screen-xl mx-auto">
            {/* Show instructional message until the user submits an address */}
            {!addressSubmitted && (
               <div className="instructions bg-[#E4602F] text-white p-4 rounded-md mb-4">
                  <p>
                     Enter an address to see local traffic departures, traffic
                     information, and weather updates.
                  </p>
               </div>
            )}

            {/* Pass the geocode handlers and error handler as props to AddressInput */}
            <AddressInput
               onGeocode={handleGeocode}
               onError={handleGeocodeError}
            />

            {/* Flexbox Layout for Large Screens */}
            {lat && lng && (
               <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-wrap mt-6 md:space-y-8 space-y-6">
                  {/* First Row: Departures and Local Weather */}
                  <div className="flex flex-col md:flex-row md:space-x-4 md:w-full lg:w-full">
                     {/* Departures Component */}
                     <div className="flex-1 mb-4 md:mb-0 lg:pt-0 md:pt-0">
                        <Departures lat={lat} lng={lng} />
                     </div>

                     {/* Placeholder for Weather Component */}
                     <div className="flex-1 mb-4 md:mb-0">
                        <div className="p-4 border-2 border-[#E4602F] rounded-md bg-white">
                           <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
                              Local Weather
                           </h2>
                           {/* Replace with actual Weather component */}
                           <WeatherPanel lat={lat} lng={lng} />
                        </div>
                     </div>
                  </div>

                  {/* Second Row: Dad Jokes and Traffic Updates */}
                  <div className="flex flex-col md:flex-row md:space-x-4 md:w-full">
                     {/* Dad Jokes Component */}
                     <div className="flex-1 mb-4 md:mb-0">
                       {/* <Joke fetchNewJoke={fetchJoke} />*/}
                     </div>

                     {/* Placeholder for Traffic Updates Component */}
                     <div className="flex-1 mb-4 md:mb-0">
                        <div className="p-4 border-2 border-[#E4602F] rounded-md bg-white">
                           <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
                              Traffic Updates
                           </h2>
                           {/* Replace with actual Traffic Status Updates component */}
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
   );
}

export default App;

