import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrafficStatusUpdates = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [trafficData, setTrafficData] = useState<any>(null);

    onLocationSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        submitLocationData(latitude, longitude);

};

export default TrafficStatusUpdates;
