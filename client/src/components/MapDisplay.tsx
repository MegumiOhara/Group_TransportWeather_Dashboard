import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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
  startTime: string;
  endTime: string | null;
  roadNumber: string;
  messageType: string;
  affectedDirection: string;
  modifiedTime: string;
  publicationTime: string;
}

interface MapDisplayProps {
  coordinates: Location;
  incidents: TrafficIncident[];
}

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

const MapDisplay: React.FC<MapDisplayProps> = ({ coordinates, incidents }) => {
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);

  const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          center={coordinates}
          zoom={13}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          options={mapOptions}
        >
          {incidents.map((incident: TrafficIncident) => {
            if (!incident.location?.lat || !incident.location?.lng) {
              console.warn(`Invalid location data for incident ${incident.id}`);
              return null;
            }

            return (
              <Marker
                key={incident.id}
                position={{
                  lat: incident.location.lat,
                  lng: incident.location.lng
                }}
                onClick={() => setActiveMarker(incident.id)}
                icon={{
                  url: getMarkerIcon(incident.type),
                  scaledSize: new window.google.maps.Size(24, 24),
                  anchor: new window.google.maps.Point(16, 16)
                }}
              >
                {activeMarker === incident.id && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div className="p-2 font-lato">
                      <h3 className="font-bold text-sm">{incident.title}</h3>
                      <p className="text-sm mt-1">{incident.description}</p>
                      <p className="text-sm font-bold mt-2">{incident.roadNumber}</p>
                      <p className="text-sm">Publicerad: {incident.publicationTime}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapDisplay;