import React, { useState } from 'react';
import FormW from "./FormW";
import Card from './Card';

const WeatherPanel: React.FC = () => {
    const apiKey = "182a20365632cbbb6415b782c8fe08c5"; // Es una buena práctica almacenar la API Key de esta manera
    const [weather, setWeather] = useState<any>(null); // Cambia 'any' por un tipo más específico si lo conoces
    const [forecast, setForecast] = useState<any>(null); // Cambia 'any' por un tipo más específico si lo conoces
    const [loading, setLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [location, setLocation] = useState<string>("");

    const getLocation = async (loc: string) => {
        setLoading(true);
        setLocation(loc);

        // Weather
        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lang=es&q=${loc}`;
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lang=es&q=${loc}`;

        try {
            const weatherResponse = await fetch(urlWeather);
            if (!weatherResponse.ok) throw new Error("Error fetching weather data");
            const weatherData = await weatherResponse.json();
            console.log(weatherData);
            setWeather(weatherData);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setShow(false);
        }

        // Forecast
        try {
            const forecastResponse = await fetch(urlForecast);
            if (!forecastResponse.ok) throw new Error("Error fetching forecast data");
            const forecastData = await forecastResponse.json();
            console.log(forecastData);
            setForecast(forecastData);
            setShow(true);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setShow(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            <FormW newLocation={getLocation} />
            <Card showData={show} loadingData={loading} weather={weather} forecast={forecast} />
        </React.Fragment>
    );
}

export default WeatherPanel;
