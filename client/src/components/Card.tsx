import React from 'react';
import SpinnerW from './SpinnerW';

// Función para obtener los nombres de los días de la semana, empezando por el día actual
const getWeekDays = () => {
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date().getDay();
    return [...weekDays.slice(today), ...weekDays.slice(0, today)];
};

const Card = ({ loadingData, showData, weather, forecast }) => {

    if (loadingData) {
        return <SpinnerW />;
    }

    if (!showData) {
        return <h2 className="text-light">Sin datos</h2>;
    }

    const url = "http://openweathermap.org/img/w/";

    // Obtener los días de la semana comenzando desde el día de hoy
    const weekDays = getWeekDays();

    // Obtener pronósticos para los próximos 7 días (cada 24 horas)
    const forecastData = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 7);

    return (
        <div className="mt-5">
            <div className="container">
                <div className="card mb-3 mx-auto bg-dark text-light">
                    <div className="row g-0">
                        <div className="col-md-12">
                            <h4>LOCAL WEATHER</h4>
                            <h3 className="card-title">{weather.name}</h3>
                        </div>

                        <div className="col-md-12">
                            <div className="card-body text-start mt-2">
                                <h5 className="card-text">Temperatura máxima: {(weather.main.temp_max - 273.15).toFixed(1)}ºC</h5>
                                <h5 className="card-text">Temperatura mínima: {(weather.main.temp_min - 273.15).toFixed(1)}ºC</h5>
                            </div>
                            <hr />

                            {/* Mostrar pronósticos en filas */}
                            <div className="row">
                                {forecastData.map((forecastItem, index) => (
                                    <div key={index} className="col-12 mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {/* Columna para el día */}
                                            <div className="col-3">
                                                <h5>{weekDays[index % 7]}</h5> {/* Mostrar el día */}
                                            </div>

                                            {/* Columna para la información del clima */}
                                            <div className="col-9 d-flex align-items-center">
                                                <img src={`${url}${forecastItem.weather[0].icon}.png`} alt="icon" className="me-2" />
                                                <p className="m-0 me-3">{forecastItem.weather[0].description}</p>
                                                <p className="m-0">{(forecastItem.main.temp - 273.15).toFixed(1)}ºC</p>
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
