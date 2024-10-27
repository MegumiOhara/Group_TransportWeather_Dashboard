import express from "express";
import cors from "cors";
import addressApi from "./routes/addressApi.js";
import trafficApi from "./routes/trafficApi.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route to verify server is working
app.get("/test", (req, res) => {
    res.json({ message: "Server is working" });
});

// API Routes
app.use("/api/address", addressApi);
app.use("/api/traffic", trafficApi);

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
    console.log(`- Health check: http://localhost:${port}/api/traffic/health`);
    console.log(`- Traffic data: http://localhost:${port}/api/traffic/location`);
});