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
            </FILTER>
        </QUERY>
    </REQUEST>
`;        







export default router;
