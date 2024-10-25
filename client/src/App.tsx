import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import AddressInput from "./components/Address";

function App() {
  
    //logic that handles the geocodeAPI request to parent component API.tsx
    //so that lat and lng state can be passed to other components.

    //state to store latitude and longitude. Initially set to null.
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number| null>(null);
    const [error, setError] = useState<string | null>(null);//stores potential error messages

    //Function will be passed to the AddressInput component.
    //it will update the lat/lng state when geocoding is successful
    const handleGeocode = (lat: number, lng: number) =>{
      setLat(lat);
      setLng(lng);
      setError(null); //clear any previous error when success.
    };

    //Function to handle geocoding errors
    const handleGeocodeError = (errorMessage: string) =>{
      setError(errorMessage);
      setLat(null);
      setLng(null);
    };

   // const response= await axios.get("http://localhost:3000/api");
  //console.log(response);
  
  return (
    <div>
      {/*Pass the geocode handlers and error handler as props to AddressInput */}
      <AddressInput onGeocode={handleGeocode} onError={handleGeocodeError}/>

      {/*below just showing the lat and lng is retrived, can delete later*/}
      {/*lat && lng && ( // Show coordinates only if lat/lng are available
                <div>
                    <h2>Coordinates:</h2>
                    <p><strong>Latitude:</strong> {lat}</p>
                    <p><strong>Longitude:</strong> {lng}</p>
                </div>
            )}

      {/*Conditionally render components if lat/lng are available
      can only use if valid coordinates are available*/}
      {lat && lng && (
        <>
          {/*<Weather lat={lat} lng={lng}/>*/}
          {/*<Departures lat={lat} lng={lng}/> */}
          {/*<Traffic lat={lat} lng={lng}/> */}
        </>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default App
