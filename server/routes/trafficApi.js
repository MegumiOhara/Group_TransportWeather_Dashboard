import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const API_KEY = process.env.TRAFIKVERKET_API_KEY;

if (!API_KEY) {
  console.error("Warning: TRAFIKVERKET_API_KEY is not set in environment variables");
}

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';

// Fetch traffic data for a specific location
router.get("/location", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const creationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Create XML request to fetch location data
    const xmlData = `
    <REQUEST>
      <LOGIN authenticationkey="${API_KEY}"/>
      <QUERY objecttype="Situation" schemaversion="1.2" limit="10">
        <FILTER>
        <NEAR name="Deviation.Geometry.WGS84" value="${lng} ${lat}"/>
        <GT name="Deviation.CreationTime" value="${creationTime}"/>
        </FILTER>
      </QUERY>
    </REQUEST>`;

    console.log('Request coordinates:', { lat, lng });
    console.log('XML Request:', xmlData);

    const response = await axios.post(
      API_URL,
      xmlData,
      {
        headers: { "Content-Type": "text/xml" },
      }
    );

    console.log('Raw response:', JSON.stringify(response.data, null, 2));

    // Parse and transform the response
    const situations = response.data?.RESPONSE?.RESULT[0]?.Situation || [];
    console.log('Found situations:', situations.length);
    
    const incidents = situations
      .filter(situation => situation?.Deviation?.[0])
      .map(situation => {
        const dev = situation.Deviation[0];
        
        let coordinates = { lat: null, lng: null };
        try {
          if (dev.Geometry?.WGS84) {
            const coordString = dev.Geometry.WGS84
              .replace('POINT (', '')
              .replace(')', '');
            const [lng, lat] = coordString.split(' ').map(Number);
            coordinates = { lat, lng };
          }
        } catch (e) {
          console.error('Error parsing coordinates:', e);
        }
      
        return {
          id: dev.Id || situation.Id,
          type: dev.MessageType || 'Unknown',
          title: dev.Message || dev.Header || 'No title',
          description: dev.LocationDescriptor || 'No description',
          location: coordinates,
          severity: dev.SafetyRelatedMessage ? 'high' : 'medium',
          startTime: dev.StartTime,
          endTime: dev.EndTime || null,
          roadNumber: dev.RoadNumber || '',
          messageType: dev.MessageTypeValue || '',
          affectedDirection: 'Both directions'
        };
      })
      .filter(incident => incident.location.lat !== null && incident.location.lng !== null);

    console.log('Processed incidents:', incidents);

  // Send the formatted incidents back to the client
    res.json({
      success: true,
      count: incidents.length,
      incidents,
      timestamp: new Date().toISOString(),
      coordinates: { lat, lng }
    });


  // Handle errors
  } catch (error) {
    console.error("Request failed:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      error: "Failed to fetch traffic data",
      details: error.message,
      coordinates: { lat, lng }
    });
  }
});

export default router;