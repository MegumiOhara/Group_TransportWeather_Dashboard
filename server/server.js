import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departuresApi from "./routes/departuresApi.js";
import addressApi from "./routes/addressApi.js";
import jokeApi from "./routes/jokeApi.js";
import trafficApi from "./routes/trafficApi.js";

dotenv.config(); //Load env variables from .env file

const app = express();
const port = 3000;
const corsOptions = {
   origin: ["http://localhost:5173"],
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
};

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

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
