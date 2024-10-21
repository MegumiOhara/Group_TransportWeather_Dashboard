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

//POST request to get latitude and long for a given address 
router.post("/", async (req,res) =>{
    const { address } = req.body;//extract the address from the request body.
    console.log(address);

    if(!address){
        //if no address is provided, send the below response.
        return res.status(400).json({error: 'Address is required'})
    }

    try {
        const API_GEO_KEY = process.env.GOOGLE_GEOCODE_API_KEY;//get teh API key from env.file
        const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_GEO_KEY}`
        );

        const data = response.data;
        if (data.status === 'OK') {
            //if the API returns a valid response, extract the lat and lng.
            const { lat, lng } = data.results[0].geometry.location;
            res.json({ lat,lng });//send the lat/lng back to the frontend
        } else {
            //if the API statis is not ok, return below response.
            res.status(400).json({error: 'Unable to geocode the address'})
        }
        
    } catch (error) {
        //if there is a server error, log it and send below response.
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
});


export default router;