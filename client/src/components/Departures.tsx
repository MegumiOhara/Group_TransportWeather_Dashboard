import React, { useState } from "react";
import AddressInput from "./Address";
import axios from "axios";

// Interfaces for data types
// interface Location {
//    latitude: number;
//    longitude: number;
// }

interface Departure {
   name: string;
   line: string;
   time: string;
   destination: string;
}

interface StationInfo {
   name: string;
   id: string;
   lat: number;
   lon: number;
}

const Departures: React.FC = () => {
   // State to store departures, station info, and error message
   const [departures, setDepartures] = useState<Departure[]>([]);
   const [error, setError] = useState<string | null>(null);
   const [stationInfo, setStationInfo] = useState<StationInfo | null>(null);

   // Function to fetch departures based on latitude and longitude
   const fetchDepartures = async (lat: number, lng: number): Promise<void> => {
      try {
         const response = await axios.post(
            "http://localhost:3000/api/location",
            {
               latitude: lat,
               longitude: lng,
            }
         );

         const data = response.data;

         setDepartures(data.departures); // Update departures state
         setStationInfo(data.nearestStation); // Update station info state
      } catch (error) {
         console.error("Error fetching departures:", error);
         setError("An error occurred while fetching departures");
      }
   };

   // Handle error from AddressInput component
   const handleError = (errorMessage: string): void => {
      setError(errorMessage);
   };

   return (
      <div>
         <h1>Find Public Transport Departures</h1>

         {/* AddressInput component to get coordinates based on address */}
         <AddressInput
            onGeocode={(lat, lng) => {
               setError(null); // Clear any previous error
               fetchDepartures(lat, lng); // Fetch departures for given coordinates
            }}
            onError={handleError}
         />

         {/* Show station information */}
         {stationInfo && (
            <div>
               <h2>Nearest Station: {stationInfo.name}</h2>
               <p>
                  Location: {stationInfo.lat}, {stationInfo.lon}
               </p>
            </div>
         )}

         {/* Display departures or error */}
         {error && <p style={{ color: "red" }}>{error}</p>}
         {departures.length > 0 ? (
            <ul>
               {departures.map((departure, index) => (
                  <li key={index}>
                     {departure.name} - {departure.time} -{" "}
                     {departure.destination}
                  </li>
               ))}
            </ul>
         ) : (
            !error && <p>No departures found.</p>
         )}
      </div>
   );
};

export default Departures;
