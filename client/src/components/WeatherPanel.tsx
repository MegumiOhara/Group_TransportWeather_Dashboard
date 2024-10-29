import React, { useEffect, useState } from 'react';
import Card from './Card';

const WeatherPanel: React.FC = () => {
    const apiKey = "182a20365632cbbb6415b782c8fe08c5";
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setShow] = useState<boolean>(false);

    const getLocationByCoords = async (lat: number, lon: number) => {
        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lon}&lang=es`;
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}&lang=es`;

        try {
            const weatherResponse = await fetch(urlWeather);
            if (!weatherResponse.ok) throw new Error("Error fetching weather data");
            const weatherData = await weatherResponse.json();
            setWeather(weatherData);

            const forecastResponse = await fetch(urlForecast);
            if (!forecastResponse.ok) throw new Error("Error fetching forecast data");
            const forecastData = await forecastResponse.json();
            setForecast(forecastData);

            setShow(true);
        } catch (error) {
            console.error("API Error:", error);
            setShow(false);
        } finally {
            setLoading(false);
        }
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getLocationByCoords(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation(); // Llama a la función para obtener la ubicación al montar el componente
    }, []);

    return (
        <React.Fragment>
            {loading ? (
                <p>Loading...</p> // Mensaje de carga simple
            ) : (
                <Card showData={show} loadingData={loading} weather={weather} forecast={forecast} />
            )}
        </React.Fragment>
    );
}

export default WeatherPanel;
