import {
    faHardHat,
    faExclamationTriangle,
    faCarCrash,
    faRoad,
    faCloud,
    faMapMarker,
} from '@fortawesome/free-solid-svg-icons';


export const incidentTypes: { [key: string]: any } = {
    'Vägarbete': faHardHat,
    'Trafikmeddelande': faExclamationTriangle,
    'Olycka': faCarCrash,
    'Hinder': faRoad,
    'Avstängning': faRoad,
    'Väder': faCloud,
    'default': faMapMarker,
};