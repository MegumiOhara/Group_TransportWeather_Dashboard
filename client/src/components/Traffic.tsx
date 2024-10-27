import React from 'react';
import axios from 'axios';



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
  
  
