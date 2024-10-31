import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import images using ES6 syntax for use in leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icons

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Define interfaces for TypeScript type checking

interface Location {
    lat: number;
    lng: number;
}

interface TrafficIncident {
    id: string;
    type: string;
    title: string;
    description: string;
    location: Location;
    severity: string;
    startTime: Date;
    endTime: Date | null;
    roadNumber: string;
    messageType: string;
    affectedDirection: string;
}

interface TrafficProps {
    coordinates: Location;
}

// Component to display traffic incidents on a map

const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
    
    const [data, setData] = useState<{incidents: TrafficIncident[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);    

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                setIsLoading(true); 
                const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
                params: coordinates
                });
                setData(response.data);
                setError(null);
            } catch (error) {   
                console.error('Error fetching traffic data:', error);
                setError('Error fetching traffic data. Please try again');
            } finally { 
                setIsLoading(false);
            }
        };

        fetchTrafficData();

        // Set up auto-refresh every 5 minutes
        const intervalId = setInterval(fetchTrafficData, 300000);

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);
        }, [coordinates]);

    // Loading state 
    if (error) {
        return (
            <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
                <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
                    Traffic Updates
                </h2>
                <div className="text-red-600 p-4 rounded-md bg-red-50">
                    {error}
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
        <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
            <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
            Traffic Updates
            </h2>
            <div className="animate-pulse">
            {/* Loading placeholder content */}   
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
            <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
                Traffic Updates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traffic updates list */}
                <div className="space-y-4">
                    {data?.incidents?.map((incident: TrafficIncident) => (
                        <div
                            key={incident.id}
                            className="p-2 border-t border-gray-400 bg-white"
                        >
                             <div className="flex flex-col justify-between">                                 
                <div className="flex flex-col space-y-1">
                    <span className="font-bold text-lg font-lato">                                     
                        Startar: {new Date(incident.startTime).toLocaleString('sv-SE', {                                          
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',                                          
                            minute: '2-digit'                                      
                        })}                                 
                    </span>
                    {incident.endTime && (
                        <span className="text-gray-600 font-lato">
                            Slutar: {new Date(incident.endTime).toLocaleString('sv-SE', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    )}
                </div>
                        <div className="text-black font-lato text-[14px] font-normal mb-1">
                             {incident.description}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 rounded-md bg-[#DEDBD4] p-2">
                            <span className="text-xs">
                                {incident.roadNumber} - {incident.type}
                            </span>
                            {incident.severity !== 'Unknown' && (                                         
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">                                             
                            {incident.severity}                                         
                        </span>                                     
                    )}            
                        </div>
                    </div>
                </div>
                    ))}
                    {(!data?.incidents || data.incidents.length === 0) && (
                        <p className="text-gray-500 text-center py-4 font-lato">
                            No traffic incidents reported in this area
                        </p>
                    )}
                </div>

                {/* Map Display */}
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                        center={[coordinates.lat, coordinates.lng]}
                        zoom={13}
                        className="h-full w-full"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {data?.incidents?.map((incident: TrafficIncident) => (
                            <Marker
                                key={incident.id}
                                position={[incident.location.lat, incident.location.lng]}
                            >
                                <Popup>
                                    <div className="p-2 font-lato">
                                        <h3 className="font-bold text-sm">{incident.title}</h3>
                                        <p className="text-sm mt-1">{incident.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {incident.roadNumber}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default TrafficSituation;