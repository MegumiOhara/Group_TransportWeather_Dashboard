import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv"; //to use environment variables.
//import instead of const

//const app = express();
//const port = 3000;

// Load env vairables frmo .env file
dotenv.config();

//Router instead of app 
const router = express.Router();
//Middleware
//app.use(cors());
//app.use(express.json());//to parse incoming JSON requests

//Route to fetch latitude and long for a given address 
router.post("/address", async (req,res) =>{
    const { address } = req.body;
    console.log(address);

    if(!address){
        return res.status(400).json({error: 'Address is required'})
    }

    try {
        const API_GEO_KEY = process.env.GOOGLE_GEOCODE_API_KEY;
        const reponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_GEO_KEY}`
        );

        const data = response.data;
        if (data.status === 'OK') {
            const {lat, lng} = data.results[0].geometry.location;
            res.json({lat,lng});
        } else {
            res.status(400).json({error: 'Unable to geocode the address'})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.listen(port, () => {
    console.log(`Server is runnong on port ${port}`);
});

export default router;