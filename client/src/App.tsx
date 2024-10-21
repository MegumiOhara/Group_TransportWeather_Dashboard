import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import AddressInput from "./components/Address";

function App() {
  
    //logic that handles the geocodeAPI request to parent component API.tsx
    //so that lat and lng state can be passed to other components.

    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number| null>(null);
    const [error, setError] = useState<string | null>(null);

    //Function to handle address geocode result

    const handleGeocode = (lat: number, lng: number) =>{
      setLat(lat);
      setLng(lng);
      setError(null); //clear any previous error
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
      <h1>Local Transport and Weather Dashboard</h1>
      {/*Pass the geocode handlers to AddressInput */}
      <AddressInput onGeocode={handleGeocode} onError={handleGeocodeError}/>

      {/*below just showing the lat and lng is retrived, can delete later*/}
      {lat && lng && ( // Show coordinates only if lat/lng are available
                <div>
                    <h2>Coordinates:</h2>
                    <p><strong>Latitude:</strong> {lat}</p>
                    <p><strong>Longitude:</strong> {lng}</p>
                </div>
            )}

      {/*Conditionally render components if lat/lng are available*/}
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
