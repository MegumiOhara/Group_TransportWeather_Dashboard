import React from 'react';
import '../Spinner.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta

const Spinner = () => {
    return (
        <div className="lds-dual-ring"></div> // Usa className en lugar de class
    );
}

export default Spinner;
