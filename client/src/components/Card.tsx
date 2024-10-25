import React from 'react';
import SpinnerW from './SpinnerW';

// function of days of week
const getWeekDays = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const today = new Date().getDay(); // Obtain the actual day 


    const orderedDays = [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];

    orderedDays[0] = 'Today';

    return orderedDays;
};

const Card = ({ loadingData, showData, weather, forecast }) => {
    if (loadingData) {
        return <SpinnerW />;
    }

    if (!showData || !forecast.list || forecast.list.length === 0) {
        return null; // Ocultamos si no hay datos
    }

    const url = "http://openweathermap.org/img/w/";
    const weekDays = getWeekDays();
    const forecastData = forecast.list.slice(0, 7); // only 7 days

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

                        {/* Container of the days and forecast */}
                        <div className="weather-container">
                            {/* Column of days of the week */}
                            <div className="week">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="day">{day}</div>
                                ))}
                            </div>

                            {/* Column of forecast */}
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

