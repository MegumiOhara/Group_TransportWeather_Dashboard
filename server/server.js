// Change to import
import express from "express";
import cors from "cors";
import addressApi from "./routes/addressApi.js";
import trafficApi from "./routes/trafficApi.js";
import dotenv from "dotenv";


dotenv.config(); //Load env variables from .env file

const app = express();
const port = 3000;
const corsOptions = {
   origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());


app.use("/api/traffic", trafficApi);

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
