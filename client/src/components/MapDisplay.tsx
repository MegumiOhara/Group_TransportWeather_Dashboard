import React from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import SkeletonLoader from './SkeletonLoader';

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
    roadNumber: string;
    publicationTime: string;
}

interface MapDisplayProps {
    coordinates: Location;
    incidents: TrafficIncident[];
    isLoading: boolean; // loading prop for spinner
    activeMarker: string | null;
    onMarkerClick: (id: string) => void;
    onInfoWindowClose: () => void;
}
// Paths for the marker icons
const markerIcons = {
    'vägarbete': '../Assets/under-construction-symbol-icon.svg',
    'olycka': '../Assets/accident-icon.svg',
    'hinder': '../Assets/access-denied-icon.svg',
    'default': '../Assets/warning-icon.svg',
};
const getMarkerIcon = (type: string): string => {
    const iconType = type.toLowerCase();
    return markerIcons[iconType as keyof typeof markerIcons] || markerIcons.default;
};

const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
  };

const MapDisplay: React.FC<MapDisplayProps> = ({
     coordinates, 
     incidents, 
     isLoading, 
     activeMarker, 
     onMarkerClick, 
     onInfoWindowClose
   
    }) => (
        <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
            {isLoading ? (
                <SkeletonLoader width="w-full" height="h-full" />
            ) : (
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        center={coordinates}
                        zoom={13}
                        mapContainerStyle={{ height: '100%', width: '100%' }}
                        options={mapOptions}
                    >
                        {incidents.map((incident) => (
                            <Marker
                                key={incident.id}
                                position={incident.location}
                                icon={{
                                    url: getMarkerIcon(incident.type),
                                    scaledSize: new window.google.maps.Size(24, 24), 
                                    anchor: new window.google.maps.Point(12, 24) // Center the icon
                                }}
                                onClick={() => onMarkerClick(incident.id)}
                            >
                                {activeMarker === incident.id && (
                                    <InfoWindow onCloseClick={onInfoWindowClose}>
                                        <div className="p-2 font-lato">
                                            <h3 className="font-bold text-sm">{incident.title}</h3>
                                            <p className="text-sm mt-1">{incident.description}</p>
                                            <p className="text-sm font-bold mt-2">{incident.roadNumber}</p>
                                            <p className="text-sm">Publicerad: {incident.publicationTime}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ))}
                    </GoogleMap>
                </LoadScript>
            )}
        </div>
    );
    
    export default MapDisplay;    