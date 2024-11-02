import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

// Import default marker icons for Leaflet
import L from 'leaflet';
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

// Helper function to get icon based on incident type (for list only)
const getIncidentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'vägarbete':
      return <FontAwesomeIcon icon={faRoad} className="mr-2" />;
    case 'olycka':
      return <FontAwesomeIcon icon={faCarCrash} className="mr-2" color="red" />;
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
  const [data, setData] = useState<{ incidents: TrafficIncident[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const intervalId = setInterval(fetchTrafficData, 300000);
    return () => clearInterval(intervalId);
  }, [coordinates]);

  if (isLoading || error) {
    return (
      <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
        <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
          Traffic Updates
        </h2>
        {error ? (
          <div className="text-red-600 p-4 rounded-md bg-red-50">{error}</div>
        ) : (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
      <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
        Traffic Updates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* List of incidents with icons */}
        <div className="space-y-4">
          {data?.incidents?.map((incident: TrafficIncident) => (
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
                    {incident.severity} </span> )}
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
          {(!data?.incidents || data.incidents.length === 0) && (
            <p className="text-gray-500 text-center py-4">
              No traffic incidents reported in this area
            </p>
          )}
        </div>

        {/* Map with default markers */}
        <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data?.incidents?.map((incident: TrafficIncident) => (
              <Marker
                key={incident.id}
                position={[incident.location.lat, incident.location.lng]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold mb-2">{incident.type}</p>
                    <p className="text-sm font-bold mb-2">{incident.title}</p>
                    <p className="text-sm mb-2">{incident.description}</p>
                    <div className="text-xs text-gray-600">
                      <p>Starttid: {incident.startTime}</p>
                      {incident.endTime && <p>Sluttid: {incident.endTime}</p>}
                      {incident.roadNumber && (
                        <p className="mt-1">{incident.roadNumber}</p>
                      )}
                    </div>
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