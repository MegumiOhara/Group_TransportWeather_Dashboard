import React, { useEffect, useState, useCallback } from 'react';
import Card from './Card';

// Interfaces para los datos de clima y pronóstico
interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    name: string;
}

interface ForecastData {
    city: {
        name: string;
        country: string;
        coord: {
            lat: number;
            lon: number;
        };
    };
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            humidity: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        clouds: {
            all: number;
        };
        wind: {
            speed: number;
            deg: number;
        };
        dt_txt: string; // timestamp en formato legible
    }>;
}

interface WeatherPanelProps {
    lat: number;
    lng: number;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ lat, lng }) => {
    const apiKey = "182a20365632cbbb6415b782c8fe08c5";
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setShow] = useState<boolean>(false);

    const getLocationByCoords = useCallback(async () => {
        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lng}&lang=es`;
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lng}&lang=es`;

        try {
            const weatherResponse = await fetch(urlWeather);
            if (!weatherResponse.ok) throw new Error("Error fetching weather data");
            const weatherData: WeatherData = await weatherResponse.json();
            setWeather(weatherData);

            const forecastResponse = await fetch(urlForecast);
            if (!forecastResponse.ok) throw new Error("Error fetching forecast data");
            const forecastData: ForecastData = await forecastResponse.json();
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
            getLocationByCoords(); // Llama a la función solo si lat y lng son válidos
        }
    }, [lat, lng, getLocationByCoords]); // Incluye getLocationByCoords en las dependencias

    return (
        <React.Fragment>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Card showData={show} loadingData={loading} weather={weather} forecast={forecast} />
            )}
        </React.Fragment>
    );
}

export default WeatherPanel;
