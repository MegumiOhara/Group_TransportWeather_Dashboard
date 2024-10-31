import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { fontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCarCrash, 
    faHardHat, 
    faRoad, 
    faExclamationTriangle,
    faCloud,
    faMapMarker
    } from '@fortawesome/free-solid-svg-icons';


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
    modifiedTime: Date;
}

interface TrafficProps {
    coordinates: Location;
}

const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
    const [data, setData] = useState<{ incidents: TrafficIncident[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(null);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
                    params: {
                        lat: coordinates.lat,
                        lng: coordinates.lng
                    }
                });
                console.log('Traffic API response:', response.data);
                setData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching traffic data:', error);
                setError('Error fetching traffic data. Please try again');
            } finally {
                setIsLoading(false);
            }
        };

        if (coordinates.lat && coordinates.lng) {
            fetchTrafficData();

            // Set up auto-refresh every 5 minutes
            const intervalId = setInterval(fetchTrafficData, 300000);

            // Cleanup function to clear interval when component unmounts
            return () => clearInterval(intervalId);
        }
    }, [coordinates]);

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
                <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
                    Traffic Updates
                </h2>
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

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
                                <div className={`flex justify-between items-center p-2 mb-2 rounded-md text-white ${
                                    incident.severity === 'Mycket stor påverkan' ? 'bg-red-500' :
                                    incident.severity === 'Stor påverkan' ? 'bg-orange-500' :
                                    incident.severity === 'Liten påverkan' ? 'bg-green-500' :
                                    incident.severity === 'Planerat arbete' ? 'bg-blue-500' :
                                    'bg-gray-500'
                                }`}>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-lg">{incident.type}</span>
                                        {incident.severity !== 'Unknown' && (
                                            <span className="px-2 py-1 font-bold rounded-full text-sm">
                                                {incident.severity}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-sm">
                                        Uppdaterad {new Date(incident.modifiedTime).toLocaleString('sv-SE', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="text-black font-lato text-[14px] font-bold mb-1">
                                    {incident.description}
                                </div>

                                <div className="text-gray-600 text-sm font-lato">
                                    {incident.title}
                                </div>

                                <div className="flex justify-between items-center text-sm font-lato mt-2">
                                    <span>
                                        Starttid: {new Date(incident.startTime).toLocaleString('sv-SE', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {incident.endTime && (
                                        <span>
                                            Sluttid: {new Date(incident.endTime).toLocaleString('sv-SE', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
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
                    <LoadScript googleMapsApiKey="AIzaSyCAbIEZa0XICdQQNpbj9S7myW7JvcvToa4">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={coordinates}
                            zoom={13}
                            options={{
                                styles: [],
                                disableDefaultUI: false,
                                zoomControl: true,
                                mapTypeControl: false,
                                streetViewControl: false,
                            }}
                        >
                            {data?.incidents?.map((incident: TrafficIncident) => (
                                <Marker
                                    key={incident.id}
                                    position={incident.location}
                                    onClick={() => setSelectedIncident(incident)}
                                />
                            ))}

                            {selectedIncident && (
                                <InfoWindow
                                    position={selectedIncident.location}
                                    onCloseClick={() => setSelectedIncident(null)}
                                >
                                    <div className="p-2 font-lato">
                                        <h3 className="font-bold text-sm">{selectedIncident.title}</h3>
                                        <p className="text-sm mt-1">{selectedIncident.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {selectedIncident.roadNumber}
                                        </p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
        </div>
    );
};

export default TrafficSituation;