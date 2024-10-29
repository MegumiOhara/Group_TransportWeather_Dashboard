import React from 'react';

// Definimos los tipos de los props
interface Weather {
    main: {
        temp_max: number;
        temp_min: number;
    };
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
    weather: Weather | null; // Puede ser null si no hay datos
    forecast: Forecast | null; // Puede ser null si no hay datos
}

// Función para obtener los nombres de los días de la semana, empezando por el día actual
const getWeekDays = (): string[] => {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const orderedDays = [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];
    orderedDays[0] = 'Today';
    return orderedDays;
};

// Función para convertir la temperatura de Kelvin a Celsius
const toCelsius = (kelvin: number): string => (kelvin - 273.15).toFixed(1);

const Card: React.FC<CardProps> = ({ loadingData, showData, weather, forecast }) => {
    if (loadingData || !showData || !forecast || !weather) {
        return null; // No mostramos nada si no hay datos
    }

    const url = "http://openweathermap.org/img/w/";
    const weekDays = getWeekDays();
    const forecastData = forecast.list.slice(0, 7); // Solo tomamos los primeros 7 días

    return (
        <div className="mt-5">
            <div className="container">
                <div className="card mb-3 mx-auto">
                    <div className="card-body">
                        <div className="card-header">
                            <h4 className="title">Local Weather</h4>
                            <div className="temperature">
                                <h5 className="card-text">
                                    Max: {toCelsius(weather.main.temp_max)}ºC
                                </h5>
                                <h5 className="card-text">
                                    Min: {toCelsius(weather.main.temp_min)}ºC
                                </h5>
                            </div>
                        </div>

                        <div className="weather-container">
                            <div className="week">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="day">{day}</div>
                                ))}
                            </div>

                            <div className="weather-forecast">
                                {forecastData.map((forecastItem, index) => (
                                    <div key={index} className="weather-row">
                                        <div className="weather-icon">
                                            {forecastItem.weather[0] && (
                                                <img
                                                    src={`${url}${forecastItem.weather[0].icon}.png`}
                                                    alt="icon"
                                                />
                                            )}
                                            <p className="pop">{(forecastItem.pop * 100).toFixed(0)}%</p>
                                        </div>
                                        <div className="temperature">
                                            <p className="temp-min">↓ {toCelsius(forecastItem.main.temp_min)}ºC</p>
                                            <p className="temp-max">↑ {toCelsius(forecastItem.main.temp_max)}ºC</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
