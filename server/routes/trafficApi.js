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

// Helper function to parse the response with better error handling
const parseTrafficIncidents = (data) => {
  try {
    // Add debug logging
    console.log('Starting to parse data:', JSON.stringify(data, null, 2));

    // Check if we have valid data
    if (!data?.RESPONSE?.RESULT?.[0]?.Situation) {
      console.log('No Situation data found in response');
      return [];
    }

    return data.RESPONSE.RESULT[0].Situation.map(incident => {
      // Add debug logging for each incident
      console.log('Processing incident:', JSON.stringify(incident, null, 2));

      try {
        return {
          id: incident?.Id || String(Math.random()),
          type: incident?.SituationType || 'Unknown',
          description: incident?.Description || 'No description available',
          location: incident?.Geometry?.WGS84 ? {
            lat: parseFloat(incident.Geometry.WGS84.split(' ')[1]),
            lng: parseFloat(incident.Geometry.WGS84.split(' ')[0])
          } : null,
          severity: incident?.Severity === 'High' ? 'high' : 
                   incident?.Severity === 'Medium' ? 'medium' : 'low',
          startTime: incident?.StartTime || new Date().toISOString(),
          endTime: incident?.EndTime || null
        };
      } catch (error) {
        console.error('Error processing individual incident:', error);
        return null;
      }
    }).filter(incident => incident !== null && incident.location !== null);
  } catch (error) {
    console.error('Error parsing incidents:', error);
    return [];
  }
};

router.get("/location", (req, res) => {
  // Get coordinates from query parameters
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Calculate creation time as 24 hours ago
  const creationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Using exact XML format that we know works
  const xmlData = `<REQUEST>
  <LOGIN authenticationkey="${API_KEY}"/>
  <QUERY objecttype="Situation" schemaversion="1.2" limit="10">
    <FILTER>
      <NEAR name="Deviation.Geometry.WGS84" value="${lng} ${lat}"/>
      <GT name="Deviation.CreationTime" value="${creationTime}"/>
    </FILTER>
    <INCLUDE>Deviation.Id,Deviation.Message,Deviation.Geometry.WGS84,Deviation.Type,Deviation.Priority,Deviation.StartTime,Deviation.EndTime</INCLUDE>
  </QUERY>
</REQUEST>`;

  console.log('Using coordinates:', { lat, lng });
  console.log('XML Request:', xmlData);

  axios
    .post(API_URL, xmlData, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
    .then((response) => {
      // Log the raw response
      console.log('Raw API response:', JSON.stringify(response.data, null, 2));

      const incidents = parseTrafficIncidents(response.data);
      console.log('Successfully parsed incidents:', incidents);

      res.json({
        success: true,
        count: incidents.length,
        incidents: incidents,
        timestamp: new Date().toISOString(),
        coordinates: { lat, lng }
      });
    })
    .catch((error) => {
      console.error("Request failed:", error);
      res.status(500).json({
        error: "Failed to fetch traffic data",
        details: error.message,
        coordinates: { lat, lng }
      });
    });
});

export default router;