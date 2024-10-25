import React from 'react';
import SpinnerW from './SpinnerW';

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
    weather: Weather;
    forecast: Forecast;
}

// Función para obtener los nombres de los días de la semana, empezando por el día actual
const getWeekDays = (): string[] => {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const today = new Date().getDay(); // Obtiene el índice del día actual (0=Domingo, 6=Sábado)

    // Reordenamos el array para empezar desde hoy
    const orderedDays = [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];

    // Reemplazamos el primer día (día de hoy) con "Today"
    orderedDays[0] = 'Today';

    return orderedDays;
};

const Card: React.FC<CardProps> = ({ loadingData, showData, weather, forecast }) => {
    if (loadingData) {
        return <SpinnerW />;
    }

    if (!showData || !forecast.list || forecast.list.length === 0) {
        return null; // Ocultamos si no hay datos
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
                                    Max: {(weather.main.temp_max - 273.15).toFixed(1)}ºC
                                </h5>
                                <h5 className="card-text">
                                    Min: {(weather.main.temp_min - 273.15).toFixed(1)}ºC
                                </h5>
                            </div>
                        </div>

                        {/* Contenedor de días y pronósticos */}
                        <div className="weather-container">
                            {/* Columna de días de la semana */}
                            <div className="week">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="day">{day}</div>
                                ))}
                            </div>

                            {/* Columna de pronósticos */}
                            <div className="weather-forecast">
                                {forecastData.map((forecastItem, index) => (
                                    <div key={index} className="weather-row">
                                        <div className="weather-icon">
                                            <img
                                                src={`${url}${forecastItem.weather[0].icon}.png`}
                                                alt="icon"
                                            />
                                            <p className="pop">{(forecastItem.pop * 100).toFixed(0)}%</p>
                                        </div>
                                        <div className="temperature">
                                            <p className="temp-min">↓ {(forecastItem.main.temp_min - 273.15).toFixed(1)}ºC</p>
                                            <p className="temp-max">↑ {(forecastItem.main.temp_max - 273.15).toFixed(1)}ºC</p>
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
