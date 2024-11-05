import { useEffect, useState } from "react";
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
import SkeletonLoader from "./SkeletonLoader";

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
   const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchDepartures = async () => {
         setLoading(true); // Start Loading
         setError(null); // Reset error state
         setNoDataMessage(null); // Reset no data message state

         try {
            const response = await axios.post(
               "http://localhost:3000/api/location",
               {
                  latitude: lat,
                  longitude: lng,
               }
            );

            if (response.data.message) {
               // If there is a message (like no station found or nor departures found)
               setNoDataMessage(response.data.message);
               setDepartures([]);
            } else {
               setDepartures(response.data.departures);
            }
         } catch (error) {
            console.error("Error fetching departures:", error);
            setError("Error fetching departures.");
         } finally {
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
   const getTransportIcon = (vehicleType?: string) => {
      if (!vehicleType) {
         return <FontAwesomeIcon icon={faBus} className="text-black" />;
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
      return (
         <div className="w-full max-w-[297px] sm:max-w-[449px] md:max-w-[669px] lg:max-w-[669px] xl:max-w-[669px] mx-auto p-2 border-2 border-[#E4602F] rounded-lg bg-white">
            <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-[11px] bg-white">
               Transport Departures
            </h2>
            <p className="text-black bg-white font-lato text-sm font-bold mb-[12px]">
               {formattedDate}
            </p>

            <div>
               {[...Array(5)].map((_, i) => (
                  <div
                     key={i}
                     className="p-2 border-t border-gray-400 bg-white flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:pt-[8px] md:pb-[8px]">
                     <SkeletonLoader width="w-full" height="h-6" />
                     <SkeletonLoader width="w-1/2" height="h-4 mt-2" />
                     <SkeletonLoader width="w-1/3" height="h-4 mt-2" />
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return <p>{error}</p>;
   }

   if (noDataMessage) {
      return <p>{noDataMessage}</p>;
   }

   return (
      <>
         <article className="bg-custom-bg pt-2 md:pt-0">
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
                           <div className="font-bold text-[14px] font-lato">
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
                        <div className="flex flex-col md:flex-row md:items-center md:w-[180px] md:order-1">
                           <div className="text-black font-lato text-[14px] font-normal">
                              {departure.departureStation} -<br></br>{" "}
                              {departure.arrivalStation}
                           </div>
                        </div>

                        {/* Vehicle Type and Operator */}
                        <div className="flex items-center space-x-2 text-black rounded-md bg-[#DEDBD4] md:w-[175px] md:bg-transparen md:order-3">
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
