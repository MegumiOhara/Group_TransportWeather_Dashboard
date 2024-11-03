import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faSun } from '@fortawesome/free-solid-svg-icons';

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
    weather: Weather | null;
    forecast: Forecast | null;
}

const getWeekDays = (): string[] => {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay(); // 0 es domingo, 1 es lunes, ..., 6 es sábado

    // Comienza con el día actual como "Today"
    const orderedDays = [daysOfWeek[todayIndex]];

    // Añade los días restantes, empezando desde el día siguiente al actual
    for (let i = 1; i < 7; i++) {
        orderedDays.push(daysOfWeek[(todayIndex + i) % 7]);
    }

    return orderedDays.map((day, index) => (index === 0 ? 'Today' : day)); // Cambia el primer día a 'Today'
};

const toCelsius = (kelvin: number): string => (kelvin - 273.15).toFixed(1);

const Card: React.FC<CardProps> = ({ loadingData, showData, weather, forecast }) => {
    if (loadingData || !showData || !forecast || !weather) {
        return null;
    }

    const weekDays = getWeekDays();
    const forecastData = forecast.list.slice(0, 7);

    return (
        <div className="mt-5 flex justify-center">
            <div className="bg-white border-[1px] border-[#E4602F] rounded-lg p-2 shadow-md w-[450px]">
                <h4 className="text-orange-600 text-[14px] font-semibold mb-2">Local Weather</h4>

                <div className="flex">
                    {/*of icons and weather  */}
                    <div className="flex flex-col w-1/4 text-left">
                        {weekDays.map((day, index) => (
                            <div key={index} className="text-gray-800 font-medium border-b border-gray-200 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Columna of icons and weather  */}
                    <div className="flex flex-col w-3/4">
                        {forecastData.map((forecastItem, index) => {
                            const icon = forecastItem.weather[0].icon.includes('01d') ? faSun : faCloudRain;
                            return (
                                <div key={index} className="flex justify-between items-center border-b border-gray-200 py-1">
                                    {/* icons in the center */}
                                    <div className="flex items-center justify-center gap-1 text-[14px] w-1/2">
                                        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-gray-700" />
                                        <span className="text-gray-600">{(forecastItem.pop * 100).toFixed(0)}%</span>
                                    </div>
                                    {/* Tempeture mínimun y máximun*/}
                                    <div className="flex items-center gap-2 text-[14px] text-gray-700 w-1/2 justify-end">
                                        <span>↓ {toCelsius(forecastItem.main.temp_min)}ºC</span>
                                        <span>↑ {toCelsius(forecastItem.main.temp_max)}ºC</span>
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
