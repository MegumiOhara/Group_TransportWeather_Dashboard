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
//Function to fetch and display traffic updates
const TrafficStatusUpdates: React.FC = () => {
    const [trafficData, setTrafficData] = useState<{updates: TrafficUpdate[], timestamp: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    

     // Function to fetch traffic updates based on latitude and longitude
    const fetchTrafficData = async (lat: number, lgn: number) => {
        try {
            setLoading(true); 
            const response = await axios.post('http://localhost:3000/api/traffic', { latitude: lat, longitude: lgn });
            setTrafficData(response.data); 
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching traffic data:', error);
            setError('Failed to fetch traffic updates. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
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
