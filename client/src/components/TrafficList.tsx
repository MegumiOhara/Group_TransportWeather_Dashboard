import React from 'react';
import SkeletonLoader from './SkeletonLoader';
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

interface TrafficIncident {
    id: string;
    type: string;
    description: string;
    severity: string;
    startTime: string;
    endTime: string | null;
    modifiedTime: string;
}
  
interface TrafficListProps {
    incidents: TrafficIncident[];
    isLoading: boolean; // loading prop for spinner
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}

const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mycket stor påverkan':
        return 'bg-red-500 text-white';
      case 'Stor påverkan':
        return 'bg-orange-500 text-white';
      case 'Liten påverkan':
        return 'bg-green-500 text-white';
      case 'Planerat arbete':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vägarbete':
        return <FontAwesomeIcon icon={faRoad} />;
      case 'olycka':
        return <FontAwesomeIcon icon={faCarCrash} />;
      case 'hinder':
        return <FontAwesomeIcon icon={faRoadBarrier} />;
      case 'färjetrafik':
        return <FontAwesomeIcon icon={faShip} />;
      case 'avstängning':
        return <FontAwesomeIcon icon={faRoadCircleXmark} />;
      case 'väder':
        return <FontAwesomeIcon icon={faCloud} />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} />;
    }
};

const TrafficList: React.FC<TrafficListProps> = ({ 
    incidents, 
    isLoading, 
    currentPage,
    totalPages, 
    onNextPage, 
    onPrevPage 
}) => (
    <div className="space-y-4">
        {isLoading ? (
            <div>
            {/* Loading placeholder content */}
            {[...Array(10)].map((_, index) => (
                <SkeletonLoader key={index} width="w-full" height="h-16" />
            ))}   
            </div>           
    ) : (
     incidents.map((incident) => (
        <div key={incident.id} className="p-2 border-t border-gray-400 bg-white">
            <div className="flex flex-col space-y-2 md:space-y-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="mr-2">{getIncidentIcon(incident.type)}</span> 
                        <span className="font-bold text-lg">{incident.type}</span>
                    </div>
                    <span className="text-sm text-gray-500">Updated: {incident.modifiedTime}</span>
                <div className={`rounded-md px-2 py-1 text-sm font-bold ${getSeverityColor(incident.severity)}`}>
                   {incident.severity}
                </div>    
            </div>   
            {/* Incident description */}
            <div className="text-black text-[14px] font-bold mt-1">
            {incident.description}
            </div>
            <div className="flex justify-between text-sm mt-2">
            <span>Starttid: {incident.startTime}</span>
            {incident.endTime && <span>Sluttid: {incident.endTime}</span>}
            </div>
        </div>
    </div>
    ))
   )}
    
        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-4">
        <button onClick={onPrevPage} disabled={currentPage === 1} 
        className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}>
        Tillbaka
        </button>
        <span className="font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={onNextPage} disabled={currentPage === totalPages} 
        className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}>
        Nästa
        </button>
        </div>
    </div>
);

export default TrafficList;
