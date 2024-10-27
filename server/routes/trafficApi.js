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

const getSeverity = (priority) => {
  if (!priority) return 'low';
  const priorityNum = parseInt(priority);
  switch (priorityNum) {
     case 1:
     case 2:
        return 'high';
     case 3:
        return 'medium';
     default:
        return 'low';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;
  try {
     const date = new Date(dateTimeString);
     return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
     });
  } catch (error) {
     console.error("Error formatting datetime:", error);
     return dateTimeString;
  }
};

const extractCoordinates = (geometry) => {
  try {
     if (!geometry || !geometry.WGS84) {
        return null;
     }
     
     const pointMatch = geometry.WGS84.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
     if (pointMatch) {
        return {
           lng: parseFloat(pointMatch[1]),
           lat: parseFloat(pointMatch[2])
        };
     }
     
     return null;
  } catch (error) {
     console.error("Error parsing coordinates:", error);
     return null;
  }
};

// Health check route
router.get("/health", (req, res) => {
  res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString() 
  });
});

router.post("/location", async (req, res) => {
  if (!API_KEY) {
     return res.status(500).json({
        error: 'Server configuration error',
        message: 'API key not configured'
     });
  }

  console.log("Received traffic request for location:", req.body);
  
  const { latitude, longitude } = req.body;
  
  if (!latitude || !longitude) {
     return res.status(400).json({ 
        error: 'Latitude and longitude are required',
        message: "Missing coordinates" 
     });
  }

  try {
    const xmlRequest = `
       <REQUEST>
          <LOGIN authenticationkey="${API_KEY}" />
          <QUERY objecttype="Situation" schemaversion="1.5" limit="10">
             <FILTER>
                <WITHIN name="Geometry.WGS84" shape="center" value="${longitude} ${latitude}" radius="50000" />
                <AND>
                   <EQ name="MessageType" value="Incident" />
                   <EQ name="Deviation.MessageType" value="Incident" />
                   <LIKE name="Geometry.WGS84" value="POINT%" />
                </AND>
             </FILTER>
             <INCLUDE>Id,Deviation,CreationTime,StartTime,EndTime,HeaderText,LocationText,Geometry,Priority</INCLUDE>
          </QUERY>
       </REQUEST>
    `;

    console.log("Sending request to Trafikverket API...");

      // Make request to Trafikverket API with corrected URL
      const response = await axios.post(
         TRAFIKVERKET_API_URL,
         xmlRequest,
         {
            headers: {
               'Content-Type': 'text/xml',
               'Accept': 'application/json'
            }
         }
      );

      console.log("Received response from Trafikverket API");

      // Check if we have valid response data
      if (!response.data || !response.data.RESPONSE || !response.data.RESPONSE.RESULT) {
        return res.json({ incidents: [] });
     }

     // Extract and transform the incidents data
     const situations = response.data.RESPONSE.RESULT[0].Situation || [];
     const incidents = situations.map(situation => {
        const coordinates = extractCoordinates(situation.Geometry);
        // Skip if no valid POINT coordinates
        if (!coordinates) return null;

        const deviation = situation.Deviation?.[0] || {};




export default router;

