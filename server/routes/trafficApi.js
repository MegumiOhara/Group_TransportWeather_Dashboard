import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables

dotenv.config();
const router = express.Router();
const API_KEY = process.env.TRAFIKVERKET_API_KEY;

// Check if API key is provided
if (!API_KEY) {
  console.error("Warning: TRAFIKVERKET_API_KEY is not set in environment variables");
}

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';

// Mapping of Swedish incident types to English
const incidentTypes = {
  "Vägarbete": "Roadwork",
  "Olycka": "Accident",
  "Avstängd väg": "Road Closure",
  "Trafikstörning": "Traffic Disruption",
  "Kövarning": "Queue Warning",
  "Hinder": "Obstacle",
  "Begränsad framkomlighet": "Limited Accessibility"
};





export default router;

