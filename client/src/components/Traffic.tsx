import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRoad,
  faCarCrash, 
  faRoadBarrier, 
  faShip, 
  faExclamationTriangle,
  faCloud,
  faRoadCircleXmark
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
    startTime: string;
    endTime: string | null;
    roadNumber: string;
    messageType: string;
    affectedDirection: string;
    modifiedTime: string;
    publicationTime: string;
}

interface TrafficProps {
    coordinates: Location;
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



const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vägarbete':
        return <FontAwesomeIcon icon={faRoad} className="mr-2" />;
      case 'olycka':
        return <FontAwesomeIcon icon={faCarCrash} className="mr-2" />;
      case 'hinder':
        return <FontAwesomeIcon icon={faRoadBarrier} className="mr-2" />;
      case 'färjetrafik':
        return <FontAwesomeIcon icon={faShip} className="mr-2" />;
      case 'avstängning':
        return <FontAwesomeIcon icon={faRoadCircleXmark} className="mr-2" />;
      case 'väder':
        return <FontAwesomeIcon icon={faCloud} className="mr-2" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />;
    }
};

const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
  const [data, setData] = useState<{ incidents: TrafficIncident[] }>({ incidents: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
          params: coordinates,
        });
        
        // Ensure incidents have valid location data
        const validIncidents = response.data.incidents.filter((incident: TrafficIncident) => 
          incident.location && 
          typeof incident.location.lat === 'number' && 
          typeof incident.location.lng === 'number'
        );
        
        setData({ incidents: validIncidents });
        setError(null);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        setError('Error fetching traffic data. Please try again');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrafficData();
    const intervalId = setInterval(fetchTrafficData, 300000);
    return () => clearInterval(intervalId);
  }, [coordinates]);

  const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
  };

  if (error) {
    return (
      <div className="max-w-full mx-auto p-4 border border-[#D13C1D] rounded-md bg-white">
        <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
          Traffic Updates
        </h2>
        <div className="text-red-600 p-4 rounded-md bg-red-50">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-full mx-auto p-4 border border-[#D13C1D] rounded-md bg-white">
      <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
        Traffic Updates
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              {data.incidents.map((incident: TrafficIncident) => (
                <div key={incident.id} className="p-2 border-t border-gray-400 bg-white">
                  <div className="flex flex-col justify-between">
                    <div
                      className={`flex justify-between items-center p-2 mb-2 rounded-md text-white ${
                        incident.severity === 'Mycket stor påverkan' ? 'bg-red-500' :
                        incident.severity === 'Stor påverkan' ? 'bg-orange-500' :
                        incident.severity === 'Liten påverkan' ? 'bg-green-500' :
                        incident.severity === 'Planerat arbete' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        {getIncidentIcon(incident.type)}
                        <span className="font-bold text-lg">{incident.type}</span>
                      </div>
                      {incident.severity !== 'Unknown' && (
                        <span className="px-2 py-1 font-bold rounded-full text-sm">
                          {incident.severity}
                        </span>
                      )}
                      <span className="text-sm">Uppdaterad: {incident.modifiedTime}</span>
                    </div>
    
                    <div className="text-black text-[14px] font-bold mb-1">
                      {incident.description}
                    </div>
                    <div className="text-gray-800 text-sm">{incident.title}</div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Starttid: {incident.startTime}</span>
                      {incident.endTime && <span>Sluttid: {incident.endTime}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {(!data.incidents || data.incidents.length === 0) && (
                <p className="text-gray-500 text-center py-4 font-lato">
                  No traffic incidents reported in this area
                </p>
              )}
            </>
          )}
        </div>
  
        <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              center={coordinates}
              zoom={13}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              options={mapOptions}
            >
              {data.incidents.map((incident: TrafficIncident) => {
                // Double-check that location data is valid
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
                        scaledSize: new window.google.maps.Size(24, 24), // Adjust size as needed
                        anchor: new window.google.maps.Point(16, 16) // Center the icon
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
      </div>
    </div>
  );
}

export default TrafficSituation;