import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRoad,
  faCarCrash, 
  faRoadBarrier, 
  faShip, 
  faExclamationTriangle,
  faCloud,
  faRoadCircleXmark,
  faClock
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

interface TrafficListProps {
  incidents: TrafficIncident[];
  isLoading: boolean;
}

const getIncidentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'vägarbete':
      return <FontAwesomeIcon icon={faRoad} className="text-xl" />;
    case 'olycka':
      return <FontAwesomeIcon icon={faCarCrash} className="text-xl" />;
    case 'hinder':
      return <FontAwesomeIcon icon={faRoadBarrier} className="text-xl" />;
    case 'färjetrafik':
      return <FontAwesomeIcon icon={faShip} className="text-xl" />;
    case 'avstängning':
      return <FontAwesomeIcon icon={faRoadCircleXmark} className="text-xl" />;
    case 'väder':
      return <FontAwesomeIcon icon={faCloud} className="text-xl" />;
    default:
      return <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Mycket stor påverkan':
      return 'bg-red-500';
    case 'Stor påverkan':
      return 'bg-orange-500';
    case 'Liten påverkan':
      return 'bg-green-500';
    case 'Planerat arbete':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const TrafficList: React.FC<TrafficListProps> = ({ incidents, isLoading }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const incidentsPerPage = 5;

  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = incidents.slice(indexOfFirstIncident, indexOfLastIncident);
  const totalPages = Math.ceil(incidents.length / incidentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentIncidents.map((incident: TrafficIncident) => (
        <div key={incident.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header section with type and icon */}
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-200">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${getSeverityColor(incident.severity)} text-white`}>
                {getIncidentIcon(incident.type)}
              </div>
              <span className="font-bold text-gray-800">{incident.type}</span>
            </div>
            
            {/* Severity badge */}
            {incident.severity !== 'Unknown' && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            )}
          </div>

          {/* Main content */}
          <div className="p-3 space-y-2">
            <p className="text-sm font-medium text-gray-800">{incident.description}</p>
            <p className="text-sm text-gray-600">{incident.title}</p>
            
            {/* Time information */}
            <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
              <div className="flex items-center text-xs text-gray-500">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                <span>Uppdaterad: {incident.modifiedTime}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Starttid: {incident.startTime}</span>
                {incident.endTime && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>Sluttid: {incident.endTime}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {(!incidents || incidents.length === 0) && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 font-lato">
            No traffic incidents reported in this area
          </p>
        </div>
      )}

      {/* Pagination */}
      {incidents.length > incidentsPerPage && (
        <div className="flex justify-center space-x-1 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded-md transition-colors duration-150 ${
                currentPage === pageNumber
                  ? 'bg-[#D13C1D] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrafficList;