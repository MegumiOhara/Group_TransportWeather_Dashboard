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
        <div className="mt-5 flex justify-center">
            <div className="bg-white border-2 border-orange-500 rounded-lg p-5 shadow-lg max-w-[60%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-orange-600 text-2xl font-bold">Local Weather</h4>
                    <div className="flex flex-col text-gray-600 text-sm">
                        <p>Max: {toCelsius(weather.main.temp_max)}ºC</p>
                        <p>Min: {toCelsius(weather.main.temp_min)}ºC</p>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex flex-col justify-between w-1/4 mr-4">
                        {weekDays.map((day, index) => (
                            <div key={index} className="text-left text-lg font-semibold border-b border-orange-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col justify-between w-3/4">
                        {forecastData.map((forecastItem, index) => (
                            <div key={index} className="flex justify-between items-center border-b border-orange-500 py-2">
                                <div className="flex items-center mr-2">
                                    {forecastItem.weather[0] && (
                                        <img
                                            src={`${url}${forecastItem.weather[0].icon}.png`}
                                            alt="icon"
                                            className="w-8 h-8"
                                        />
                                    )}
                                    <p className="ml-2 text-sm">{(forecastItem.pop * 100).toFixed(0)}%</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <p className="text-blue-600">↓ {toCelsius(forecastItem.main.temp_min)}ºC</p>
                                    <p className="text-red-600">↑ {toCelsius(forecastItem.main.temp_max)}ºC</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
