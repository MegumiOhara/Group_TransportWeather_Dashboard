// Change to import
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//const express = require("express");
//const cors = require("cors");
import departuresApi from "./routes/departuresApi.js";
import addressApi from "./routes/addressApi.js";
import trafficApi from "./routes/trafficApi.js";


dotenv.config(); //Load env variables from .env file

const app = express();
const port = 3000;
const corsOptions = {
   origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Use the departures API routes
app.use("/api", departuresApi);
app.use("/api/address", addressApi);
app.use("/api/", trafficApi);

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
