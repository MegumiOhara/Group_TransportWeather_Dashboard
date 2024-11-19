import express from "express";
import axios from "axios";
import dotenv from "dotenv"; //to use environment variables.

// Load env vairables frmo .env file
dotenv.config();

//Router instead of app.Create a router for API endpoints. 
const router = express.Router();

//Middleware
//app.use(cors());
//app.use(express.json());//to parse incoming JSON requests

//autocomplete
router.post("/", async (req,res) => {
    const {input} = req.body;
    console.log("Received input:", input)

    if(!input){
        return res.status(400).json({ error: "Input is required"});
    }
    

    try {
        const API_PLACES_KEY = process.env.GOOGLE_PLACE_API_KEY;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                input
           )}&types=address&components=country:SE&key=${API_PLACES_KEY}`
           
        );
        console.log("Google API response:", response.data);
        res.json(response.data.predictions);
        console.log(response.data);
        console.log(response.data.predictions);
    } catch (error) {
        console.error("Error fetching autocompelte suggestions:", error);
        res.status(500).json({ error: "Error fetching autocomplete suggestions"});
    }
}) 

export default router;