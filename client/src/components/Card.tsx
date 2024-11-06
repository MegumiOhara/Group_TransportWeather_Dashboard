import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faCloudRain,
   faSun,
   faCloud,
   faSnowflake,
   faBolt,
   faArrowUp,
   faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

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
   weather: { icon: string }[];
   pop: number;
}

interface Forecast {
   list: ForecastItem[];
}

interface CardProps {
   loadingData: boolean;
   showData: boolean;
   weather: Weather | null;
   forecast: Forecast | null;
}

const getWeekDays = (): string[] => {
   const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
   const todayIndex = new Date().getDay();

   const orderedDays = [daysOfWeek[todayIndex]];

   for (let i = 1; i < 7; i++) {
      orderedDays.push(daysOfWeek[(todayIndex + i) % 7]);
   }

   return orderedDays.map((day, index) => (index === 0 ? "Today" : day));
};

const getWeatherIcon = (condition: string) => {
   switch (condition.toLowerCase()) {
      case "clear":
         return faSun;
      case "clouds":
         return faCloud;
      case "rain":
         return faCloudRain;
      case "thunderstorm":
         return faBolt;
      case "snow":
         return faSnowflake;
      default:
         return faCloud; // Fallback icon
   }
};

const Card: React.FC<CardProps> = ({
   loadingData,
   showData,
   weather,
   forecast,
}) => {
   if (loadingData || !showData || !forecast || !weather) {
      return null;
   }

   const weekDays = getWeekDays();
   const forecastData = forecast.list.slice(0, 7);

   return (
      <div className="flex justify-center md:justify-end">
         <div className="w-full bg-white border-2 border-[#E4602F] rounded-lg p-2">
            <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-[11px] border-b border-gray-200 pb-[16px]">
               <FontAwesomeIcon
                  icon={faCloud}
                  className="mr-2 text-[#D13C1D]"
               />
               Local Weather - {weather.city}
            </h2>

            {/* Current Weather */}
            <div className="flex flex-row items-center justify-between border-b border-gray-200 py-2">
               <span className="w-1/4 text-left text-gray-800 font-medium">
                  Today
               </span>
               <div className="w-1/4 flex items-center justify-center text-gray-800 text-[14px]">
                  <FontAwesomeIcon
                     icon={getWeatherIcon(weather.condition)}
                     className="w-5 h-5 mr-1"
                  />
                  <span>{weather.condition}</span>
               </div>
               <div className="w-1/2 flex items-center justify-end text-gray-800 text-[14px]">
                  <span>{Math.round(weather.temperature)}°C</span>
               </div>
            </div>

            {/* 7-Day Forecast */}
            {forecastData.map((forecastItem, index) => {
               const weatherIconType = forecastItem.weather[0].icon;
               const icon = getWeatherIcon(weatherIconType);

               return (
                  <div
                     key={index}
                     className="flex flex-row items-center justify-between border-b border-gray-200 py-2 md:flex-row sm:flex-col sm:gap-2">
                     {/* Day */}
                     <span className="w-1/4 text-left text-gray-800 font-medium sm:w-full">
                        {weekDays[index]}
                     </span>

                     {/* Weather Icon and Precipitation Chance */}
                     <div className="w-1/4 flex items-center justify-center text-gray-800 text-[14px] sm:w-full sm:justify-start">
                        <FontAwesomeIcon
                           icon={icon}
                           className="w-5 h-5 mr-1 sm:w-4 sm:h-4"
                        />
                        <span className="sm:text-sm">
                           {(forecastItem.pop * 100).toFixed(0)}%
                        </span>
                     </div>

                     {/* Temperature Min and Max combined */}
                     <div className="w-1/2 flex items-center justify-end text-gray-800 text-[14px]">
                        <div className="flex items-center sm:text-sm">
                           <FontAwesomeIcon
                              icon={faArrowDown}
                              className="w-3 h-3 mr-1 text-blue-600 sm:w-2 sm:h-2"
                           />
                           <span>
                              {Math.round(forecastItem.main.temp_min)}°
                           </span>
                        </div>
                        <div className="flex items-center sm:text-sm ml-2">
                           <FontAwesomeIcon
                              icon={faArrowUp}
                              className="w-3 h-3 mr-1 text-red-600 sm:w-2 sm:h-2"
                           />
                           <span>
                              {Math.round(forecastItem.main.temp_max)}°
                           </span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default Card;
