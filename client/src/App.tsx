import React, { useState, useEffect } from 'react';
import WeatherPanel from './components/WeatherPanel';
import TrafficStatusUpdates from './components/Traffic';

const App: React.FC = () => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLoading(false); // Termina la carga al obtener las coordenadas
      },
      (error) => {
        console.error("Error obteniendo la geolocalización:", error);
        setError("No se pudo obtener la ubicación. Asegúrate de que los permisos de ubicación estén habilitados.");
        setLoading(false); // Termina la carga en caso de error
      }
    );
  }, []);

  if (loading) {
    return <p>Loading location...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Muestra el mensaje de error si existe
  }

  return (
    <div>
      {lat !== null && lng !== null ? (
        <>
          <WeatherPanel lat={lat} lng={lng} />
          <TrafficStatusUpdates lat={lat} lng={lng} />
        </>
      ) : (
        <p>Unable to fetch location.</p>
      )}
    </div>
  );
};

export default App;

