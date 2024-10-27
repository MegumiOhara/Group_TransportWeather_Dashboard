import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
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
    severity: 'high' | 'medium' | 'low';
    startTime: string;
    endTime: string | null;
    roadNumber: string;
    messageType: string;
    affectedDirection: string;
}

interface TrafficProps {
    coordinates: Location;
}
//
const TrafficSituation: React.FC<TrafficProps> = ({ coordinates }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['trafficSituations', coordinates],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/traffic/location`, {
                params: coordinates
      });
      return response.data;
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-[400px] bg-gray-200 rounded"></div>
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">Failed to load traffic data. Please try again later.</p>
                </div>
              );
            }
          

               
export default TrafficSituation;
