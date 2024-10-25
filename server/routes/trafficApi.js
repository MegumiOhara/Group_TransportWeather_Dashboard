import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_Key = process.env.TRAFIKVERKET_API_KEY;
const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

//Define a function to dynamically generate XML data for traffic situations
const generateXmlData = (latitude, longitude) => `
    <REQUEST>
        <LOGIN authenticationkey="${API_Key}"/>
        <QUERY objecttype="Situation" schemaversion="1.5" limit="10">
            <FILTER>
            <NEAR name="Deviation.Geometry.WGS84" value="${latitude} ${longitude}" maxdistance="5000"/>
            <GT name="Deviation.CreationTime" value="2024-10-25T12:00:00.660+01:00"/>
            </FILTER>
        </QUERY>
    </REQUEST>
`;      

//Define the route for fetching situation data

router.get("/traffic", async (req, res) => {
    try {
        // Send XML request to Trafikverket API
        const response = await axios.post(
            API_URL,
            xmlData,
            {
                headers: {
                    "Content-Type": "application/xml",
                },
            }
        );

        // Extract the situation data from the API response
        const situationData = response.data.RESPONSE.RESULT.SITUATION;

        // If no situations are found, return an empty array
        if (situationData.length === 0) {
            return res.json([]);
        }

        // Filter and format the situation data
        const formattedData = situationData.map((situation) => ({
            id: situation.ID,
            title: situation.TITLE,
            description: situation.DESCRIPTION,
            severity: situation.SEVERITY,
            creationTime: situation.CREATIONTIME,
            location: situation
            // Extract location details from the Geometry element
            // For demonstration purposes, we assume the location is the first point in the Geometry array
            // In a real-world application, you might need to parse the Geometry element to extract the exact location details
            .Geometry.Point[0],
        }));
        
        // Return the formatted situation data
        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching traffic situation data:", error);
        res.status(500).json({
            message: "Error fetching data from Trafikverket",
        });
    }
});





export default router;
