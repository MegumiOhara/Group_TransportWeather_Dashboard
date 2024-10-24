import React from 'react';
import SpinnerW from './SpinnerW';

// Función para obtener los nombres de los días de la semana, empezando por el día actual
const getWeekDays = () => {
    return ['Today', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

    // Obtener pronósticos para los próximos 7 días
    const forecastData = forecast.list.slice(0, 7); // Solo tomamos los primeros 7 días

    return (
        <div className="mt-5">
            <div className="container">
                <div className="card mb-3 mx-auto bg-dark text-light">
                    <div className="row g-0">
                        <div className="col-md-12">
                            <h4>LOCAL WEATHER</h4> {/* Título principal */}
                        </div>

                        <div className="col-md-12">
                            <div className="card-body text-start mt-2">
                                <h5 className="card-text">Max Temperature: {(weather.main.temp_max - 273.15).toFixed(1)}ºC</h5>
                                <h5 className="card-text">Min Temperature: {(weather.main.temp_min - 273.15).toFixed(1)}ºC</h5>
                            </div>
                            <hr />

                            {/* Mostrar pronósticos en filas */}
                            <div className="row">
                                {forecastData.map((forecastItem, index) => (
                                    <div key={index} className="col-12 mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {/* Columna para el día */}
                                            <div className="col-3">
                                                <h5>{weekDays[index]}</h5> {/* Muestra "Today" para el primer día y otros días para el resto */}
                                            </div>

                                            {/* Columna para la información del clima */}
                                            <div className="col-9 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <img src={`${url}${forecastItem.weather[0].icon}.png`} alt="icon" className="me-2" />
                                                    <p className="m-0">{(forecastItem.pop * 100).toFixed(0)}%</p> {/* Probabilidad de lluvia al lado del ícono */}
                                                </div>
                                                <p className="m-0">{(forecastItem.main.temp - 273.15).toFixed(1)}ºC</p> {/* Temperatura en la otra columna */}
                                            </div>
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
}

export default Card;




