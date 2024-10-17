// Change to import
import express from "express";
import cors from "cors";
//const express = require("express");
//const cors = require("cors");
import departuresApi from "./routes/departuresApi.js";
import addressApi from "./routes/addressApi.js";

dotenv.config(); //Load env variables from .env file

const app = express();
const corsOptions = {
   origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Use the departures API routes
app.use("/api", departuresApi);
app.use("/address", addressApi);

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
app.listen(8080, () => {
   console.log("Server is running on port 8080");
});
