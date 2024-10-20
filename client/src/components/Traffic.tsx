import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrafficStatusUpdates = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [trafficData, setTrafficData] = useState<any>(null);

    const onLocationSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        submitLocationData(latitude, longitude);
};

    const fetchCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                onLocationSuccess, 
                (error) => {
                console.error('Error fetching geolocation:', error); 
                setLoading(false);
            }
        );
        } else {
            alert('Geolocation is not supported by your browser.');
            setLoading(false);
        }
    };
    
    const submitLocationData = async (latitude: number, longitude: number) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/api/traffic', {
                 latitude, longitude 
                });
            setTrafficData(response.data);
        } catch (error) {
            console.error('Error fetching traffic data from server:', error);
        } finally {    
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (trafficData) {
            console.log('Latest traffic updates:', trafficData);
        } 
    }, [trafficData]);    

};

export default TrafficStatusUpdates;
