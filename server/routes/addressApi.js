const express = require('express');
const axios = require('axios');
const cors = require('cors');
//require('dotenv').config(); //to use environment variables.

const app = express();
const port = 3000;

//Middleware
app.use(express.json());//to parse incoming JSON requests

//Route to fetch latitude and long for a given address 
app.get("/address", async (req,res) =>{
    const { address } = req.body;
    console.log(address);

    try {
        const API_KEY = 'AIzaSyBiMI3n3WUqQ_XiIeUL0TT1yDYiIH-JeF8'
        const reponse = await fetch();

        const data = response.json();
        if (data.status === 'OK') {

        }
        
    } catch (error) {
        console.log(error);
    }
})