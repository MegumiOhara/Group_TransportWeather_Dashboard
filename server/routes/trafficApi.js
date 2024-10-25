import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_Key = process.env.TRAFIKVERKET_API_KEY;
const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

//Define the XML data for situation data from the API
const xmlData = `
    <REQUEST>
        <LOGIN authenticationkey="${API_Key}"/>
        <QUERY objecttype="Situation" schemaversion="1.5" limit="10">
            <FILTER>
            <NEAR name="Deviation.Geometry.WGS84" value="57.78145 14.15618" maxdistance="5000"/>
            <GT name="Deviation.CreationTime" value="2024-10-25T12:00:00.660+01:00"/>

            </FILTER>
        </QUERY>
    </REQUEST>
`;      
console.log(xmlData);






export default router;
