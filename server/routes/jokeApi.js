import express from "express";
import axios from "axios";
 
//setting up an Express route to fetch jokes from API and send to the client

const router = express.Router();

//GET route at the root endpoint "/"
router.get("/", async(req,res) => {
    try{
        //fetch a randomg joke from APO.
        //JSON format in the header- the way shown on API webpage
        const response = await axios.get("https://icanhazdadjoke.com/", {
            headers: { Accept: "application/json"},
        });
        //get joke from the API response
        const joke = response.data;
        console.log(joke);
        //sends the joke to the client
        res.json(joke);  
    } catch (error){
        console.log("Error fetching joke:", error);
        res.status(500).json({ error: "Failed to fetch a joke"});
    }
    
});

export default router;
