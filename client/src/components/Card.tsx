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
                <div className="card mb-3 mx-auto bg-light text-dark weather-card">
                    <h4 className='title'>Local Weather</h4> {/* Título principal */}
                    <div className="card-body p-2">

                        {/* Mostrar pronósticos en filas */}
                        <div className="card-content"> {/* Contenedor para el contenido */}
                            {forecastData.map((forecastItem, index) => (
                                <div key={index} className="weather-row" style={{ justifyContent: 'center' }}>
                                    {/* Columna para el día */}
                                    <div className="week">{weekDays[index]}</div>

                                    {/* Ícono y probabilidad de lluvia */}
                                    <div className="weather-icon">
                                        <img src={`${url}${forecastItem.weather[0].icon}.png`} alt="icon" />
                                        <p className="pop">{(forecastItem.pop * 100).toFixed(0)}%</p> {/* Porcentaje al lado del ícono */}
                                    </div>

                                    {/* Temperaturas máxima y mínima */}
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
    );
};

export default Card;
