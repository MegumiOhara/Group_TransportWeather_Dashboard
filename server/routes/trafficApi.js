import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const router = express.Router();

const API_Key = process.env.TRAFIKVERKET_API_KEY;
console.log("API Key:", process.env.TRAFIKVERKET_API_KEY);


const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

//Define a function to dynamically generate XML data for traffic situations
const generateXmlData = (latitude, longitude) => `
    <REQUEST>
        <LOGIN authenticationkey="${API_Key}"/>
        <QUERY objecttype="Situation" schemaversion="1.5" limit="10">
            <FILTER>
            <NEAR name="Deviation.Geometry.WGS84" value="${latitude} ${longitude}"/>
            <LT name="Deviation.CreationTime" value="${new Date().toDateString()}"/>
            </FILTER>
        </QUERY>
    </REQUEST>
`;      

//Define the route for fetching situation requests

router.post("/traffic", async (req, res) => {
    const { lat, lng } = req.body;
    console.log('Incoming request:', req.body);

    // Ensure latititude and longitude are provided.
    if (!lat ||!lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
        // Generate XML request with the specified coordinates.
        const xmlData = generateXmlData(lat, lng);
        console.log('Generated XML Data:', xmlData); // Log XML data
        
        // Send the XML request to the API
        const response = await axios.post(
            API_URL,
            xmlData,
            {
                headers: {
                    "Content-Type": "text/xml",
                },
            }
        );

        console.log("Received response from Trafikverket API:", response.data);

        // Extract the situation data from the API response
        const situationData = response.data.RESPONSE?.RESULT?.[0]?.Situation || [];

        // Format the response data to match frontend expectations
        const formattedData = situationData.map((situation) => ({
            id: situation.Id,
            title: situation.Title,
            description: situation.Description,
            severity: situation.Severity,
            creationTime: situation.CreationTime,
            location: situation.Geometry?.Point?.[0] || null, // Access the first Point if available
        }));
        
          // Send the formatted data back to the frontend
          res.json({ updates: formattedData, timestamp: new Date().toISOString() });
        } catch (error) {
            console.error("Error fetching traffic situation data:", error.response?.data || error.message);
            res.status(500).json({
                message: "Error fetching data from Trafikverket",
            });
        }
    });


export default router;
