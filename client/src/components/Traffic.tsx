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

    // Handle successful geocoding from AddressInput
    const handleGeocode = (lat: number, lng: number) => {
        setError(null); // Clear any previous error
        fetchTrafficData(lat, lng); // Fetch traffic data for the given lat/lng
    };
       
    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };
   
    // Log traffic data when it is updated (for debugging)
    useEffect(() => {
        if (trafficData) {
            console.log('Latest traffic updates:', trafficData);
        } 
    }, [trafficData]);   

    return (
        <div className="traffic-updates">
            <h2>Traffic Status Updates</h2>
            {loading && <p>Loading...</p>} 
            <AddressInput
                onGeocode={handleGeocode} // Pass geocode handler
                onError={handleError} // Pass error handler
            />

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
