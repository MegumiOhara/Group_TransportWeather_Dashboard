import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddressInput from './Address';

interface TrafficUpdate {
    timestamp: number;
    status: string;
    description: string;
    location: string;
    severity: string;
}

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

    return (
        <div className="traffic-updates">
            <h2>Traffic Status Updates</h2>
            <button onClick={fetchCurrentLocation} disabled={loading}>
                {loading? 'Loading...' : 'Get current location'}
            </button>

            {latitude && longitude && (
                <p>Your current location: {latitude}, {longitude}</p>
            )}

            {trafficData && (
                <div>
                    <h3>Recent Traffic Updates:</h3>
                    <ul>
                    {trafficData.updates.map((update: any, index: number) => (
                        <li key={index}>
                            <strong>{update.timestamp}</strong>: {update.status} {update.description} {update.location}
                        </li>
                    ))}
                    </ul>   
                </div>
            )}
            {!loading && trafficData && trafficData.timestamp && (
                <p>Last updated: {new Date(trafficData.timestamp).toLocaleString()}</p>
            )}
        </div>
    )
};

export default TrafficStatusUpdates;
