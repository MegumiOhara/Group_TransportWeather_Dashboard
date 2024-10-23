import express from "express";
import axios from "axios";
<<<<<<< Updated upstream
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_Key = process.env.TRAFIKVERKET_API_KEY;
const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";









export default router;
=======
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
>>>>>>> Stashed changes
