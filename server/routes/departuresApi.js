import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Router
const router = express.Router();

// API-key
const apiKey = process.env.RESROBOT_API_KEY;

// Define base URL's
const stationsProximityApiUrl = `https://api.resrobot.se/v2.1/location.nearbystops`;
const departureBoardApiUrl = `https://api.resrobot.se/v2.1/departureBoard`;

// Function to get nearest station ID based on coordinates
const getNearestStationId = async (latitude, longitude) => {
   try {
      const response = await axios.get(stationsProximityApiUrl, {
         params: {
            format: "json",
            accessId: apiKey,
            originCoordLat: latitude,
            originCoordLong: longitude,
         },
      });

      // Handle response
      if (
         response.data.stopLocationOrCoordLocation &&
         response.data.stopLocationOrCoordLocation.length > 0
      ) {
         // Return nearest station object
         return response.data.stopLocationOrCoordLocation[0].StopLocation; // Return nearest station object
      } else {
         return null; // No station found
      }
   } catch (error) {
      console.error("Error fetching nearest station:", error);
      throw new Error("Error fetching nearest station");
   }
};

// Function uses the ID to fetch departure list for s specific station
const getDepartureBoard = async (stationId) => {
   try {
      const params = {
         accessId: apiKey,
         id: stationId, // Mandatory: Station ID
         format: "json", // Response format: JSON
         duration: 60, // Time interval for departures
         passlist: 0,
      };

      // Make the API request
      const response = await axios.get(departureBoardApiUrl, { params });

      // Map the departures to a simplified format
      const departures = response.data.Departure.map((departure) => {
         const scheduledTime = departure.time.slice(0, 5); // Removes seconds from time
         const realTime = departure.rtTime
            ? departure.rtTime.slice(0, 5)
            : "On time"; // Real-time departure in HH:MM

         // Calculate the journey duration if realtime data available
         let duration = null;
         if (departure.rtTime && departure.time) {
            const departureTime = new Date(
               `${departure.date}T${departure.time}`
            );
            const realDepartureTime = new Date(
               `${departure.rtDate || departure.date}T${departure.rtTime}`
            );
            const timeDifference =
               Math.abs(realDepartureTime - departureTime) / 60000; // Difference in minutes
            duration = `${timeDifference} min`;
         }

         return {
            name: departure.name, // Transport name
            scheduledTime,
            realTime,
            track: departure.rtDepTrack || "Unknown",
            destination: departure.direction, // Final stop
            duration: duration || "N/A",
            line: departure.transportNumber, // Line number
            operator: departure.ProductAtStop.operator || "Unknown", // Operator Name
            type: departure.transportCategory, // Transport type
         };
      });

      return departures;
   } catch (error) {
      console.error("Error fetching departure board:", error);
      throw new Error("Error fetching departure board");
   }
};

// Unified route to handle both stations and departures based on coordinates
router.post("/location", async (req, res) => {
   console.log("Request received for departures", req.body);

   // Extract latitude and longitude from request body
   const { latitude, longitude } = req.body;

   if (!latitude || !longitude) {
      return res
         .status(400)
         .json({ message: "Latitude and longitude are required" });
   }

   try {
      // Fetch nearby station object
      const nearestStation = await getNearestStationId(latitude, longitude);

      // 1. Check if any stations ID were found
      if (!nearestStation) {
         return res
            .status(400)
            .json({ message: "No stations found near the given coordinates" });
      }
      // 2. Fetch departures for nearest station (stationID)
      const departures = await getDepartureBoard(nearestStation.id);

      // Send station info and departures as response
      return res.json({
         nearestStation: {
            name: nearestStation.name, // Return station's name
            id: nearestStation.id, // Return the station's ID
         },
         departures,
      });
   } catch (error) {
      console.error("Error fetching location data", error);
      return res.status(500).json({ message: "Error fetching location data" });
   }
});

export default router;
