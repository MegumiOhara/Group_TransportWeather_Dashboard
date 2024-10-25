import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBus,
   faTrain,
   faTrainTram,
   faTrainSubway,
   faFerry,
} from "@fortawesome/free-solid-svg-icons";

interface Departure {
   departureStation: string;
   arrivalStation: string;
   departureTime: string;
   arrivalTime: string;
   duration: string;
   vehicleType: string;
   vehicleIcon: string;
   displayNumber: string;
   operator: string;
}

interface DepartureProps {
   lat: number;
   lng: number;
}

function Departures({ lat, lng }: DepartureProps) {
   const [departures, setDepartures] = useState<Departure[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchDepartures = async () => {
         try {
            const response = await axios.post(
               "http://localhost:3000/api/location",
               {
                  latitude: lat,
                  longitude: lng,
               }
            );
            setDepartures(response.data.departures);
            setLoading(false);
         } catch (error) {
            console.error("Error fetching departures:", error);
            setError("Error fetching departures.");
            setLoading(false);
         }
      };

      fetchDepartures();
   }, [lat, lng]);

   // Function to format current date
   const today = new Date();
   const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
   } as const;
   const formattedDate = `${today.toLocaleDateString("en-US", options)}`;

   // Function to return appropriate icon for transport type
   const getTransportIcon = (type?: string) => {
      if (!type) {
         return <FontAwesomeIcon icon={faBus} className="text-gray-700" />; // Standard till bus-ikonen om `type` saknas
      }
      switch (type.toLowerCase()) {
         case "bus":
         case "regionbus":
            return <FontAwesomeIcon icon={faBus} className="text-gray-700" />;
         case "train":
         case "pendeltåg":
         case "tåg":
            return <FontAwesomeIcon icon={faTrain} className="text-gray-700" />;
         case "tram":
         case "spårvagn":
         case "tvärbanan":
            return (
               <FontAwesomeIcon icon={faTrainTram} className="text-gray-700" />
            );
         case "metro":
         case "tunnelbana":
            return (
               <FontAwesomeIcon
                  icon={faTrainSubway}
                  className="text-gray-700"
               />
            );
         case "ferry":
         case "färja":
            return <FontAwesomeIcon icon={faFerry} className="text-gray-700" />;
         default:
            return <FontAwesomeIcon icon={faBus} className="text-gray-700" />; // Default to bus if type unknown
      }
   };

   if (loading) {
      return <p>Loading departures...</p>;
   }

   if (error) {
      return <p>{error}</p>;
   }

   return (
      <>
         <article className="max-w-md mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
            <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
               Transport Departures
            </h2>
            <p className="text-black font-lato text-sm font-bold mb-4">
               {formattedDate}
            </p>

            <div className="space-y-4">
               {departures.slice(0, 5).map((departure, i) => (
                  <div
                     key={i}
                     className="p-4 border-t border-b border-gray-400 bg-white">
                     <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">
                           {departure.departureTime} {departure.arrivalStation}
                        </span>
                        <span className="text-sm text-gray-500">
                           {departure.duration}
                        </span>
                        <div className="text-base font-medium mb-1">
                           {departure.departureStation} -{" "}
                           {departure.arrivalStation}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                           <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full p-2">
                              {getTransportIcon(departure.vehicleType)}
                           </span>
                           <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                              {departure.vehicleType} {departure.displayNumber}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </article>
      </>
   );
}

export default Departures;
