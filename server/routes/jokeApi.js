import express from "express";
import axios from "axios";
 

const router = express.Router();

router.get("/", async(req,res) => {
    try{
        const response = await axios.get("https://icanhazdadjoke.com/api", {
            headers: { Accept: "application/json"},
        });
        const joke = response.data;
        console.log(joke);
        res.json(joke); //sends the joke to the client 
    } catch (error){
        console.log("Error fetching joke:", error);
        res.status(500).json({ error: "Failed to fetch a joke"});
    }
    
});

export default router;
