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

// Function to generate the XML request based on dynamic latitude and longitude
router.get("/location", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const creationTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const generateXmlData = `
    <REQUEST>
      <LOGIN authenticationkey="${API_KEY}"/>
        <QUERY objecttype="Situation" schemaversion="1.2" limit="10">
          <FILTER>
            <NEAR name="Deviation.Geometry.WGS84" value="${lng} ${lat}"/>
            <GT name="Deviation.CreationTime" value="${creationTime}"/>
          </FILTER>
          <INCLUDE>
          Id
          ModifiedTime
          PublicationTime
          Deviation.IconId
          Deviation.Header
          TrafficRestrictionType
          Deviation.SeverityText
          Deviation.LocationDescriptor
          Deviation.RoadNumber
          Deviation.StartTime
          Deviation.AffectedDirection
          NumberOfLanesRestricted 
          Deviation.MessageType
          Deviation.MessageCode 
          Deviation.EndTime  
          </INCLUDE>
      </QUERY>
    </REQUEST>`;

const response = await axios.post(
      API_URL,
      xmlData,
      {
        headers: { "Content-Type": "text/xml" },
      }
    );

    // Parse and transform the response
    const incidents = response.data?.RESPONSE?.RESULT[0]?.Situation?.map(situation => {
      const { Deviation } = situation;

      // Extract coordinates from WGS84 point if available
      let coordinates = { lat: null, lng: null };
      if (Deviation?.Geometry?.WGS84) {
        const [lng, lat] = Deviation.Geometry.WGS84.split(' ').map(Number);
        coordinates = { lat, lng };
      }
      
      // Extract the first image URL if available
      let imageUrl = null;
      if (Deviation?.IconId) {
        imageUrl = `https://api.trafikinfo.trafikverket.se/v2/icon/${Deviation.IconId}`;
      }
      
      // Return the transformed data
      return {
        id: situation.Id,
        modifiedTime: situation.ModifiedTime,
        publicationTime: situation.PublicationTime,
        headerText: Deviation?.Header,
        severityText: Deviation?.SeverityText,
        locationDescriptor: Deviation?.LocationDescriptor,
        roadNumber: Deviation?.RoadNumber,
        startTime: Deviation?.StartTime,
        endTime: Deviation?.EndTime || null,
        affectedDirection: Deviation?.AffectedDirection,
        numberOfLanesRestricted: Deviation?.NumberOfLanesRestricted,
        messageType: Deviation?.MessageType,
        messageCode: Deviation?.MessageCode,
        imageUrl,
        coordinates,
      };
    }) || [];  
    



export default router;