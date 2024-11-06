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

// Component to display traffic incidents on a map and a list of incidents
const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
  const [data, setData] = useState<{ incidents: TrafficIncident[] }>({ incidents: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch traffic data from the API and update the state when necessary
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
          params: coordinates,
        });
        
        // Filter out incidents without valid location data
        const validIncidents = response.data.incidents.filter((incident: TrafficIncident) => 
          incident.location && 
          typeof incident.location.lat === 'number' && 
          typeof incident.location.lng === 'number'
        );
      
        // Update the state with the valid incidents
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
  
  // Render the map and list of traffic incidents
  return (
    <div className="max-w-full mx-auto rounded-md bg-white">
     {/* <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
        Traffic Updates
      </h2> */}
  
      <div className="flex flex-col gap-y-6">
        <div className="w-full h-[400px]">
          <MapDisplay coordinates={coordinates} incidents={data.incidents} />
        </div>
        <div className="w-full">
          <TrafficList incidents={data.incidents} isLoading={isLoading} />
        </div>  
      </div>
    </div>
  );
}

export default TrafficSituation;

