import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay';
import TrafficList from './TrafficList';

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

const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
  const [data, setData] = useState<{ incidents: TrafficIncident[] }>({ incidents: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
          params: coordinates,
        });
        
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
        <TrafficList incidents={data.incidents} isLoading={isLoading} />
        <MapDisplay coordinates={coordinates} incidents={data.incidents} />
      </div>
    </div>
  );
}

export default TrafficSituation;