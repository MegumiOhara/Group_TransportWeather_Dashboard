import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarCrash, faCloud, faExclamationTriangle, faHardHat, faMapMarker, faRoad } from '@fortawesome/free-solid-svg-icons'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
  startTime: string;
  endTime: string | null;
  roadNumber: string;
  messageType: string;
  temporaryLimit: string | null;
  trafficRestrictionType: string;
  modifiedTime: string;
}

interface TrafficProps {
  coordinates: Location;
}

// Component to display traffic incidents on a map
const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
  const [data, setData] = useState<{ incidents: TrafficIncident[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine icon based on incident type
  const getIncidentIcon = (type: string) => {
    // Define icon mapping
    const incidentTypes: { [key: string]: any } = {
      'Vägarbete': faHardHat,
      'Trafikmeddelande': faExclamationTriangle,
      'Olycka': faCarCrash,
      'Hinder': faRoad,
      'Avstängning': faRoad,
      'Väder': faCloud,
      'default': faMapMarker,
    };

    return incidentTypes[type] || incidentTypes['default'];
  };

  const iconMarkUp = (type: string) => {
    const icon = getIncidentIcon(type);


    return L.divIcon({
      iconSize: [24, 24],
      className: 'custom-marker',
      html: `<div style="color: red; display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
          <FontAwesomeIcon icon={icon} />
      </svg>
  </div>`,
    });
  };

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
          params: coordinates,
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
            <div key={incident.id} className="p-2 border-t border-gray-400 bg-white">
              <div className="flex flex-col justify-between">
                {/* Moved up and modified type, severity, and time block */}
                <div
                  className={`flex justify-between items-center p-2 mb-2 rounded-md text-white ${
                    incident.severity === 'Mycket stor påverkan'
                      ? 'bg-red-500'
                      : incident.severity === 'Stor påverkan'
                      ? 'bg-orange-500'
                      : incident.severity === 'Liten påverkan'
                      ? 'bg-green-500'
                      : incident.severity === 'Planerat arbete'
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{incident.type}</span>
                    {incident.severity !== 'Unknown' && (
                      <span className="px-2 py-1 font-bold rounded-full text-sm">
                        {incident.severity}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm">Uppdaterad: {incident.modifiedTime}</span>
                </div>

                <div className="text-black font-lato text-[14px] font-bold mb-1">
                  {incident.description}
                </div>

                <div className="text-gray-800 text-sm font-lato">{incident.title}</div>
                <div className="flex justify-between items-center text-sm font-lato mt-2">
                  <span>Starttid: {incident.startTime}</span>
                  {incident.endTime && <span>Sluttid: {incident.endTime}</span>}
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
          <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {data?.incidents?.map((incident: TrafficIncident) => (
              <Marker
                key={incident.id}
                position={[incident.location.lat, incident.location.lng]}
                icon={iconMarkUp(incident.type)} // Assign icon based on type
              >
                <Popup>
                  <div className="p-2 font-lato">
                    <h3 className="font-bold text-sm">{incident.title}</h3>
                    <p className="text-sm mt-1">{incident.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{incident.roadNumber}</p>
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
