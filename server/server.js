import express from "express";
import cors from "cors";
import departuresApi from "./routes/departuresApi.js";
import addressApi from "./routes/addressApi.js";
import dotenv from "dotenv";

dotenv.config(); //Load env variables from .env file

const app = express();
const port = 3000;
const corsOptions = {
   origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next(); // Gå vidare till nästa middleware eller route
});

// Use the departures API routes
app.use("/api", departuresApi);
app.use("/api/address", addressApi);

app.get("/api", (req, res) => {
   res.json({ comment: ["example response"] });
});

// Start server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
