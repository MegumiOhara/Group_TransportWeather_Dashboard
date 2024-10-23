import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_Key = process.env.TRAFIKVERKET_API_KEY;
const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";









export default router;