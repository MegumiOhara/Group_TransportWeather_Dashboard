import React from 'react';
import SpinnerW from './SpinnerW';

const Card = ({ loadingData, showData, weather, forecast }) => {

    var url = "";
    var iconUrl = "";

    var iconUrl3 = "";
    var iconUrl6 = "";
    var iconUrl9 = "";

    var forecastDate3 = "";
    var forecastDate6 = "";
    var forecastDate9 = "";

    if (loadingData) {
        return <SpinnerW />;
    }

    if (showData) {
        url = "http://openweathermap.org/img/w/";
        iconUrl = url + weather.weather[0].icon + ".png";

        iconUrl3 = url + forecast.list[1].weather[0].icon + ".png";
        iconUrl6 = url + forecast.list[2].weather[0].icon + ".png";
        iconUrl9 = url + forecast.list[3].weather[0].icon + ".png";

        forecastDate3 = forecast.list[1].dt_txt.substring(8, 10) + '/' + forecast.list[1].dt_txt.substring(5, 7) + '/' + forecast.list[1].dt_txt.substring(0, 4) + ' ' + forecast.list[1].dt_txt.substring(11, 13);
        forecastDate6 = forecast.list[2].dt_txt.substring(8, 10) + '/' + forecast.list[2].dt_txt.substring(5, 7) + '/' + forecast.list[2].dt_txt.substring(0, 4) + ' ' + forecast.list[2].dt_txt.substring(11, 13);
        forecastDate9 = forecast.list[3].dt_txt.substring(8, 10) + '/' + forecast.list[3].dt_txt.substring(5, 7) + '/' + forecast.list[3].dt_txt.substring(0, 4) + ' ' + forecast.list[3].dt_txt.substring(11, 13);
    }

    return (
        <div className="mt-5">

            {
                showData === true ? (

                    <div className="container">
                        <div className="card mb-3 mx-auto bg-dark text-light">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <h4>LOCAL WEATHER</h4>
                                    <h3 className="card-title">{weather.name}</h3>



                                </div>
                                <div className="col-md-8">
                                    <div className="card-body text-start mt-2">
                                        <h5 className="card-text">Temperatura máxima: {(weather.main.temp_max - 273.15).toFixed(1)}ºC</h5>
                                        <h5 className="card-text">Temperatura mínima: {(weather.main.temp_min - 273.15).toFixed(1)}ºC</h5>


                                    </div>
                                    <hr />

                                    <div className="row mt-4">
                                        <div className="col">

                                            <p className="description"><img src={iconUrl3} alt="icon" />{forecast.list[1].weather[0].description}</p>

                                        </div>


                                    </div>


                                </div>

                            </div>
                        </div>

                    </div>

                ) : (
                    <h2 className="text-light">Sin datos</h2>
                )
            }



        </div>

    );
}

export default Card;