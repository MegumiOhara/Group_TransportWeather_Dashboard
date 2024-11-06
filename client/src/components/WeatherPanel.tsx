import React, { useEffect, useState, useCallback } from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import axios from "axios";

interface WeatherPanelProps {
   lat: number;
   lng: number;
}

interface Weather {
   city: string;
   temperature: number;
   condition: string;
   forecast: ForecastItem[];
}

interface ForecastItem {
   main: {
      temp_max: number;
      temp_min: number;
   };
   weather: Array<{
      icon: string;
   }>;
   pop: number;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ lat, lng }) => {
   const [weather, setWeather] = useState<Weather | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [show, setShow] = useState<boolean>(false);

   const getLocationByCoords = useCallback(async () => {
      try {
         setLoading(true);
         // Fetch weather data from your server
         const response = await axios.post(
            "http://localhost:3000/api/weather",
            {
               lat,
               lng,
            }
         );

         setWeather(response.data);
         setShow(true);
      } catch (error) {
         console.error("API Error:", error);
         setShow(false);
      } finally {
         setLoading(false);
      }
   }, [lat, lng]);

   useEffect(() => {
      if (lat !== null && lng !== null) {
         getLocationByCoords();
      }
   }, [lat, lng, getLocationByCoords]);

   return (
      <React.Fragment>
         {loading ? (
            // Skeleton Loader to indicate loading status
            <div className="flex justify-center p-4">
               <div className="bg-white border-2 border-[#E4602F] rounded-lg p-4 w-[449px]">
                  <SkeletonLoader
                     width="w-1/2"
                     height="h-6"
                     className="mb-[11px]"
                  />
                  <SkeletonLoader
                     width="w-full"
                     height="h-4"
                     className="mb-[12px]"
                  />
                  {[...Array(5)].map((_, index) => (
                     <div
                        key={index}
                        className="flex justify-between items-center mb-3">
                        <SkeletonLoader width="w-1/4" height="h-4" />
                        <SkeletonLoader width="w-1/4" height="h-4" />
                        <SkeletonLoader width="w-1/4" height="h-4" />
                     </div>
                  ))}
               </div>
            </div>
         ) : (
            weather && (
               <Card
                  showData={show}
                  loadingData={loading}
                  weather={weather}
                  forecast={{ list: weather.forecast }} // Ensure `forecast` matches the expected structure
               />
            )
         )}
      </React.Fragment>
   );
};

export default WeatherPanel;
