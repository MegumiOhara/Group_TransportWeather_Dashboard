import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBus,
   faTrain,
   faTrainTram,
   faTrainSubway,
   faFerry,
   faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { GlobalLoadingContext } from "./LoaderContext";

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

   // Retrive the context
   const context = useContext(GlobalLoadingContext);

   // Check if it's undefined, if so throw an error
   if (!context) {
      throw new Error(
         "GlobalLoadingContext must be used within a GlobalLoadingProvider"
      );
   }

   // Access the global loading state
   const { setIsLoading } = context;

   useEffect(() => {
      const fetchDepartures = async () => {
         setIsLoading(true); // Start Loading
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
         } finally {
            setIsLoading(false);
         }
      };

      fetchDepartures();
   }, [lat, lng, setIsLoading]);

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
   const getTransportIcon = (vehicleType?: string) => {
      if (!vehicleType) {
         return <FontAwesomeIcon icon={faBus} className="text-gray-700" />;
      }
      // Match the vehicleType from Resrobot codes
      switch (vehicleType.toLowerCase()) {
         case "bus":
         case "regional bus":
         case "express bus":
         case "airport express bus":
         case "train replacement bus":
            return <FontAwesomeIcon icon={faBus} className="text-black " />;
         case "train":
         case "local train":
         case "express train":
         case "intercity train":
         case "high-speed train":
         case "regional train":
         case "airport express train":
         case "pågatåg":
            return <FontAwesomeIcon icon={faTrain} className="text-black" />;
         case "metro":
            return (
               <FontAwesomeIcon icon={faTrainSubway} className="text-black" />
            );
         case "tram":
            return (
               <FontAwesomeIcon icon={faTrainTram} className="text-black" />
            );
         case "international ferry":
         case "local ferry":
            return <FontAwesomeIcon icon={faFerry} className="text-black" />;
         default:
            return <FontAwesomeIcon icon={faBus} className="text-black" />;
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
         <article className="bg-custom-bg pt-2">
            <div className="w-full max-w-[297px] sm:max-w-[449px] md:max-w-[669px] lg:max-w-[669px] xl:max-w-[669px] mx-auto p-2 border-2 border-[#E4602F] rounded-lg bg-white">
               <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-[11px]">
                  Transport Departures
               </h2>
               <p className="text-black font-lato text-sm font-bold mb-[12px]">
                  {formattedDate}
               </p>

               <div>
                  {departures.slice(0, 5).map((departure, i) => (
                     <div
                        key={i}
                        className="p-2 border-t border-gray-400 bg-white flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:pt-[8px] md:pb-[8px]">
                        {/* Departure and Arrival Information */}
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 md:order-2">
                           <div className="font-bold text-[16px] font-lato">
                              {departure.departureTime}
                              <FontAwesomeIcon
                                 icon={faArrowRight}
                                 className="mx-2 text-black"
                              />{" "}
                              {departure.arrivalTime}
                              <span className="text-black font-lato text-[10px] font-normal ml-2">
                                 {departure.duration}
                              </span>
                           </div>
                        </div>
                        {/* Departure and Arrival Information */}
                        <div className="flex flex-col md:flex-row md:items-center md:w-[229px] md:order-1">
                           <div className="text-black font-lato text-[14px] font-normal md:text-[16px]">
                              {departure.departureStation} -{" "}
                              {departure.arrivalStation}
                           </div>
                        </div>

                        {/* Vehicle Type and Operator */}
                        <div className="flex items-center space-x-2 text-black rounded-md bg-[#DEDBD4] md:w-[195px] md:bg-transparen md:order-3">
                           <span className="inline-flex items-center justify-center pl-4 py-4 w-[11px] h-[15px] p-2">
                              {getTransportIcon(departure.vehicleType)}
                           </span>
                           <span className="rounded-full text-[14px]">
                              {departure.displayNumber} {departure.operator}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </article>
      </>
   );
}

export default Departures;
