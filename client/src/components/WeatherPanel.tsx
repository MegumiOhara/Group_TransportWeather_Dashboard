import React, { useEffect, useState, useCallback } from "react";
import Card from "./Card";

interface WeatherPanelProps {
   lat: number;
   lng: number;
}

interface Weather {
   main: {
      temp: number;
      temp_max: number;
      temp_min: number;
   };
   weather: Array<{
      icon: string;
      description: string;
   }>;
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

interface Forecast {
   list: ForecastItem[];
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ lat, lng }) => {
   const apiKey = "182a20365632cbbb6415b782c8fe08c5";
   const [weather, setWeather] = useState<Weather | null>(null);
   const [forecast, setForecast] = useState<Forecast | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [show, setShow] = useState<boolean>(false);

   const getLocationByCoords = useCallback(async () => {
      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lng}&lang=es`;
      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lng}&lang=es`;

      try {
         const weatherResponse = await fetch(urlWeather);
         if (!weatherResponse.ok)
            throw new Error("Error fetching weather data");
         const weatherData = await weatherResponse.json();
         setWeather(weatherData);

         const forecastResponse = await fetch(urlForecast);
         if (!forecastResponse.ok)
            throw new Error("Error fetching forecast data");
         const forecastData = await forecastResponse.json();
         setForecast(forecastData);

         setShow(true);
      } catch (error) {
         console.error("API Error:", error);
         setShow(false);
      } finally {
         setLoading(false);
      }
   }, [lat, lng]); // Dependencias de lat y lng

   useEffect(() => {
      if (lat !== null && lng !== null) {
         getLocationByCoords(); // Call the function only if lat and lng are valid
      }
   }, [lat, lng, getLocationByCoords]); // Incluye getLocationByCoords en las dependencias

   return (
      <React.Fragment>
         {loading ? (
            <p>Loading...</p>
         ) : (
            <Card
               showData={show}
               loadingData={loading}
               weather={weather}
               forecast={forecast}
            />
         )}
      </React.Fragment>
   );
};

export default WeatherPanel;
