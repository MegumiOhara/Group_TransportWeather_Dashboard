import React, { useState, useEffect } from "react";
import axios from "axios";

interface Location {
   latitude: number;
   longitude: number;
}

interface Departure {
   name: string;
   line: string;
   time: string;
   destination: string;
}

const DepartureBoard: React.FC = () => {
   const [location, setLocation] = useState<Location | null>(null);
   const [departures, setDepartures] = useState<Departure[]>([]);
   const [error, setError] = useState<string>("");

   // Get user's current location using geolocation API
   useEffect(() => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const { latitude, longitude } = position.coords;
               setLocation({ latitude, longitude });
            },
            (err) => {
               console.error("Geolocation error:", err);
               setError("Error fetching geolocation");
            }
         );
      } else {
         setError("Geolocation not supported by this browser");
      }
   }, []);

   // Fetch nearest station and departures when location is available
   useEffect(() => {
      if (location) {
         axios
            .get("http://localhost:8080/api/location", {
               params: {
                  latitude: location.latitude,
                  longitude: location.longitude,
               },
            })
            .then((response) => {
               console.log("API response:", response.data);
               setDepartures(response.data.departures);
            })
            .catch((error) => {
               console.error("Error fetching departures:", error);
               setError("Error fetching departures");
            });
      }
   }, [location]);

   if (error) {
      return <div>{error}</div>;
   }

   return (
      <div>
         <h1>Nearest Departures</h1>
         {departures.length > 0 ? (
            <ul>
               {departures.map((departure, index) => (
                  <li key={index}>
                     {departure.name} - {departure.line} - {departure.time} to{" "}
                     {departure.destination}
                  </li>
               ))}
            </ul>
         ) : (
            <p>Loading...</p>
         )}
      </div>
   );
};

export default DepartureBoard;
