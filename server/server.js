import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departuresApi from "./routes/departuresApi.js";
import addressApi from "./routes/addressApi.js";
import jokeApi from "./routes/jokeApi.js";
import trafficApi from "./routes/trafficApi.js";

dotenv.config();

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
   origin: ["http://localhost:5173"],
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next();
});

// Use the departures API routes
app.use("/api", departuresApi);
app.use("/api/address", addressApi);
app.use("/api/joke", jokeApi);
app.use("/api/traffic", trafficApi);
app.use("/api/joke", jokeApi);

// Health check endpoint
app.get("/api/traffic/health", (req, res) => {
    res.json({ 
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    //console.log(`- Health check: http://localhost:${port}/api/traffic/health`);
    //console.log(`- Traffic data: http://localhost:${port}/api/traffic/location`);
});