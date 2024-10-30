import { useContext, useState } from "react";
import AddressInput from "./components/Address";
import { GlobalLoadingContext } from "./components/LoaderContext";
import LoadingModal from "./components/LoadingModal";
//import TrafficStatusUpdates from "./components/Traffic";
import Departures from "./components/Departures";
import Joke from "./components/Joke";

function App() {
   //logic that handles the geocodeAPI request to parent component API.tsx
   //so that lat and lng state can be passed to other components.

   //state to store latitude and longitude. Initially set to null.
   const [lat, setLat] = useState<number | null>(null);
   const [lng, setLng] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null); //stores potential error messages
   ////New state for triggering jokes.initally set to false
   const [fetchJoke, setFetchJoke] = useState<boolean>(false);

   // Access the loading state from context
   const context = useContext(GlobalLoadingContext);

   // A check for undefined before trying to access isLoading and setIsLoading
   if (!context) {
      throw new Error(
         "GlobalLoadingContext must be used within a GlobalLoadingProvider"
      );
   }

   const { isLoading } = context;

   //Function will be passed to the AddressInput component.
   //it will update the lat/lng state when geocoding is successful
   const handleGeocode = (lat: number, lng: number) => {
      setLat(lat);
      setLng(lng);
      setError(null); //clear any previous error when success.
      //toggle the joke fetch state to trigger a new joke
      //prev ensures the last value of fetchJoke is used
      setFetchJoke((prev) => !prev);
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
      <>
         {isLoading && <LoadingModal />}
         <div>
            {/*Pass the geocode handlers and error handler as props to AddressInput */}
            <AddressInput
               onGeocode={handleGeocode}
               onError={handleGeocodeError}
            />

            {/*Conditionally render components if lat/lng are available
      can only use if valid coordinates are available*/}
            {lat && lng && (
               <>
                  {/*<Weather lat={lat} lng={lng}/>*/}
                  <Departures lat={lat} lng={lng} />
                  {/* <TrafficStatusUpdates lat={lat} lng={lng} /> */}
               </>
            )}

            {/*Render the Joke component, passing the fetchJoke state as a prop*/}
            <Joke fetchNewJoke={fetchJoke} />

            {error && <p>{error}</p>}
         </div>
      </>
   );
}

export default App;
