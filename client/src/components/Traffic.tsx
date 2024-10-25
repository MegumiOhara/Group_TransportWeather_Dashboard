import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface TrafficUpdate {
    timestamp: number;
    status: string;
    description: string;
    location: string;
}

interface TrafficProps {
    lat: number;
    lng: number;
}

//Function to fetch and display traffic updates
const TrafficStatusUpdates: React.FC<TrafficProps> = ({lat, lng}) => {
    const [trafficData, setTrafficData] = useState<{updates: TrafficUpdate[], timestamp: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


     // Function to fetch traffic updates based on latitude and longitude
    const fetchTrafficData = async () => {
        try {
            setLoading(true); 
            const response = await axios.post('http://localhost:3000/api/traffic', { lat, lng });
            setTrafficData(response.data); 
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching traffic data:', error);
            setError('Failed to fetch traffic updates. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch traffic data whenever lat/lng change
    useEffect(() => {
        if (lat && lng) {
            fetchTrafficData();
        }
    }, [lat, lng]);  

    return (
        <div className="traffic-updates">
            <h2>Traffic Status Updates</h2>
            {loading && <p>Loading...</p>} 

            {/* Display error message if any */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display traffic updates if available */}

            {trafficData && (
                <div>
                    <h3>Recent Traffic Updates:</h3>
                    <ul>
                    {trafficData.updates.map((update: TrafficUpdate, index: number) => (
                        <li key={index}>
                            <strong>{update.timestamp}</strong>: {update.status} {update.description} {update.location}
                        </li>
                    ))}
                    </ul>   
                </div>
            )}

            {/* Display last updated timestamp if available */}
            {!loading && trafficData && trafficData.timestamp && (
                <p>Last updated: {new Date(trafficData.timestamp).toLocaleString()}</p>
            )}

        </div>
    )
};

export default TrafficStatusUpdates;

