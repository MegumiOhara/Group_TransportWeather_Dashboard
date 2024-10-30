import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faSun, faTemperatureLow, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';

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
    orderedDays[0] = 'Today'; // Renombrar el primer día a 'Today'
    return orderedDays;
};

// Función para convertir la temperatura de Kelvin a Celsius
const toCelsius = (kelvin: number): string => (kelvin - 273.15).toFixed(1);

const Card: React.FC<CardProps> = ({ loadingData, showData, weather, forecast }) => {
    // Verificar si los datos están cargando o no están disponibles
    if (loadingData || !showData || !forecast || !weather) {
        return null; // No mostramos nada si no hay datos
    }

    const weekDays = getWeekDays(); // Obtener los nombres de los días de la semana
    const forecastData = forecast.list.slice(0, 7); // Solo tomamos los primeros 7 días

    return (
        <div className="mt-5 flex justify-center">
            <div className="bg-white border-2 border-black rounded-lg p-5 shadow-lg w-[449px] h-[313px]">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-black text-2xl font-bold">Local Weather</h4>
                    <div className="flex flex-col text-gray-800 text-sm">
                        <p>Max: {toCelsius(weather.main.temp_max)}ºC</p>
                        <p>Min: {toCelsius(weather.main.temp_min)}ºC</p>
                    </div>
                </div>

                <div className="flex">
                    {/* Días de la semana */}
                    <div className="flex flex-col justify-between w-1/4 mr-4">
                        {weekDays.map((day, index) => (
                            <div key={index} className="text-left text-lg font-semibold border-b border-black py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Datos del clima para cada día */}
                    <div className="flex flex-col justify-between w-3/4">
                        {forecastData.map((forecastItem, index) => {
                            // Determinar qué ícono mostrar basado en la condición del clima
                            const icon = forecastItem.weather[0].icon.includes('01d') ? faSun : faCloudRain; // Ejemplo simple

                            return (
                                <div key={index} className="flex justify-between items-center border-b border-black py-2">
                                    <div className="flex items-center mr-2">
                                        {/* Usar FontAwesomeIcon en lugar de la imagen */}
                                        <FontAwesomeIcon icon={icon} className="w-8 h-8 text-black" />
                                        <p className="ml-2 text-sm text-black">{(forecastItem.pop * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-black">
                                        <p className="text-black">↓ {toCelsius(forecastItem.main.temp_min)}ºC</p>
                                        <p className="text-black">↑ {toCelsius(forecastItem.main.temp_max)}ºC</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;

