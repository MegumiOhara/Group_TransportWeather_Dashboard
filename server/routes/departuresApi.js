import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Router instead of app
const router = express.Router();

// API-key
const apiKey = process.env.RESROBOT_API_KEY;

// Function to get nearest station
const getNearestStationId = async (latitude, longitude) => {
   try {
      const nearbyStationsUrl = `https://api.resrobot.se/v2.1/location.nearbystops?format=json&accessId=${apiKey}&originCoordLat=${latitude}&originCoordLong=${longitude}`;
      const response = await axios.get(nearbyStationsUrl);

      if (response.data.StopLocation && response.data.StopLocation.length > 0) {
         return response.data.StopLocation[0];
      } else {
         return null; // No station found
      }
   } catch (error) {
      console.error("Error fetching nearest station:", error);
      throw new Error("Error fetching nearest station");
   }
};

// Function to get the departure board based on stationId
const getDepartureBoard = async (stationId) => {
   try {
      const departureBoardUrl = `https://api.resrobot.se/v2.1/departureBoard?format=json&accessId=${apiKey}&originId=${stationId}&maxJourneys=10`;
      const response = await axios.get(departureBoardUrl);

      const departures = response.data.Departure.map((departure) => ({
         name: departure.stop,
         time: departure.time,
         date: departure.date,
         line: departure.transportNumber,
         type: departure.transportMode,
         destination: departure.direction,
      }));

      return departures;
   } catch (error) {
      console.error("Error fetching departure board:", error);
      throw new Error("Error fetching departure board");
   }
};

// Unified route to handle both stations and departures based on coordinates
router.get("/location", async (req, res) => {
   console.log("Request received for departures", req.query);

   // Extract latitude and longitude from request query
   const { latitude, longitude } = req.query;

   if (!latitude || !longitude) {
      return res
         .status(400)
         .json({ message: "Latitude and longitude are required" });
   }

   try {
      // Fetch nearby station
      const nearestStation = await getNearestStationId(latitude, longitude);

      // Check if any stations were found
      if (!nearestStation) {
         return res
            .status(400)
            .json({ message: "No stations found near the given coordinates" });
      }
      // Fetch departures for nearest station
      const departures = await getDepartureBoard(nearestStation);

      // More info about the nearest station
      const stationInfo = {
         name: nearestStation.name,
         id: nearestStation.id,
         lat: nearestStation.lat,
         lon: nearestStation.lon,
      };

      return res.json({
         nearestStation: stationInfo,
         departures,
      });
   } catch (error) {
      console.error("Error fetching location data", error);
      return res.status(500).json({ message: "Error fetching location data" });
   }
});

// Test route
router.get("/test", (req, res) => {
   res.json({ message: "Test route works!" });
});

export default router;
