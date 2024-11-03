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
      return <FontAwesomeIcon icon={faCloud} className="text-lg" />;
    default:
      return <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />;
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

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Mycket stor påverkan':
        return 'bg-red-500/10 border-red-500 text-red-700';
      case 'Stor påverkan':
        return 'bg-orange-500/10 border-orange-500 text-orange-700';
      case 'Liten påverkan':
        return 'bg-green-500/10 border-green-500 text-green-700';
      case 'Planerat arbete':
        return 'bg-blue-500/10 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {currentIncidents.map((incident: TrafficIncident) => (
        <div 
          key={incident.id} 
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Header with Icon and Type */}
          <div className="p-2 flex items-center justify-between border-b border-gray-100 bg-custom-bg">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white text-gray-700">
                {getIncidentIcon(incident.type)}
              </div>
              <h3 className="font-bold text-gray-900">{incident.type}</h3>
            </div>
            <div className="flex items-center text-xs text-gray-900">
              {/*<FontAwesomeIcon icon={faClock} className="mr-1" />*/}
              <span>Uppdaterad: {incident.modifiedTime}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Severity and Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{incident.description}</p>
                {incident.severity !== 'Unknown' && (
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ml-2 whitespace-nowrap ${getSeverityStyles(incident.severity)}`}>
                    {incident.severity}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{incident.title}</p>
            </div>

            {/* Time Information */}
            <div className="flex flex-wrap justify-between items-center pt-2 text-xs font-semibold border-t border-gray-100">
              <span>Starttid: {incident.startTime}</span>
              {incident.endTime && <span>Sluttid: {incident.endTime}</span>}
            </div>
          </div>
        </div>
      ))}
      
      {(!incidents || incidents.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 font-lato">
            No traffic incidents reported in this area
          </p>
        </div>
      )}

      {/* Pagination */}
      {incidents.length > incidentsPerPage && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === pageNumber
                  ? 'bg-[#D13C1D] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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