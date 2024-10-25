import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const router = express.Router();
const apiKey = process.env.RESROBOT_API_KEY;

// Base URL's
const nearbyStopsApiUrl = `https://api.resrobot.se/v2.1/location.nearbystops`;
const departureBoardApiUrl = `https://api.resrobot.se/v2.1/departureBoard`;

// Mapping of vehicle types to Font Awesome icons
const vehicleTypeIcons = {
   Flygbuss: { type: "Airport Bus", icon: "fa-bus-alt" },
   Buss: { type: "Bus", icon: "fa-bus" },
   Tåg: { type: "Train", icon: "fa-train" },
   Tunnelbana: { type: "Metro", icon: "fa-train-subway" },
   Spårvagn: { type: "Tram", icon: "fa-train-tram" },
   Tvärbana: { type: "Tram", icon: "fa-train-tram" },
   Färja: { type: "Ferry", icon: "fa-ferry" },
};

// Function to get nearest station ID based on coordinates
const getNearestStationId = async (latitude, longitude) => {
   try {
      const response = await axios.get(nearbyStopsApiUrl, {
         params: {
            format: "json",
            accessId: apiKey,
            originCoordLat: latitude,
            originCoordLong: longitude,
            lang: "en",
         },
      });

      // Handle response
      if (
         response.data.stopLocationOrCoordLocation &&
         response.data.stopLocationOrCoordLocation.length > 0
      ) {
         // Return nearest station object
         return response.data.stopLocationOrCoordLocation[0].StopLocation;
      } else {
         return null; // No station found
      }
   } catch (error) {
      console.error("Error fetching nearest station:", error);
      throw new Error("Error fetching nearest station");
   }
};

// Common function for making API request to Resrobot
const fetchDataFromResRobot = async (url, params) => {
   try {
      const response = await axios.get(url, { params });
      return response.data;
   } catch (error) {
      console.error(`Error fetching data from ${url}`, error);
      throw new Error(`Error fetching data from ${url}`);
   }
};

// Function to fetch departure data
const getDepartureBoard = async (stationId) => {
   const params = {
      accessId: apiKey,
      id: stationId,
      format: "json",
      duration: 60,
      passlist: 1,
      lang: "en",
      products: 0,
   };

   const data = await fetchDataFromResRobot(departureBoardApiUrl, params);

   console.log("Departure data:", data); // Log the data for debugging

   return data.Departure.map((departure) => {
      const product = departure.ProductAtStop || {};

      // Extracting information for the journey including arrival times
      const stops =
         departure.Stops && departure.Stops.Stop ? departure.Stops.Stop : [];
      const finalStop = stops.length > 0 ? stops[stops.length - 1] : null;

      // Arrival time at the final destination
      let arrivalTime = finalStop ? finalStop.arrTime : "Unknown";
      if (arrivalTime !== "Unknown") {
         arrivalTime = arrivalTime.slice(0, 5);
      }

      // Extracting departure date if available
      const departureDate =
         finalStop && finalStop.depDate ? finalStop.depDate : null;

      // Extracting arrival date if available
      const arrivalDate =
         finalStop && finalStop.arrDate ? finalStop.arrDate : null;

      // Calculating the duration (if both times are available)
      let duration = "Unknown";
      if (departureDate && arrivalDate && departure.time && arrivalTime) {
         try {
            const departureDateTime = new Date(
               `${departureDate}T${departure.time}:00`
            );
            const arrivalDateTime = new Date(
               `${arrivalDate}T${finalStop.arrTime}:00`
            );

            // Ensure we only calculate if both times are valid
            if (
               !isNaN(departureDateTime.getTime()) &&
               !isNaN(arrivalDateTime.getTime())
            ) {
               duration =
                  Math.abs((arrivalDateTime - departureDateTime) / 60000) +
                  " min";
            }
         } catch (error) {
            console.error("Error calculating duration:", error);
         }
      }

      return {
         name: product.name || "Unknown",
         displayNumber: product.displayNumber || "Unknown",
         transportType: product.catOutL || "Unknown",
         operator: product.operator || "Unknown",
         scheduledTime: departure.time ? departure.time.slice(0, 5) : "Unknown",
         realTime: departure.rtTime ? departure.rtTime.slice(0, 5) : "On time",
         track: departure.rtTrack || "Unknown",
         depTrack: departure.rtDepTrack || "Unknown",
         line: product.num || "Unknown",
         type: departure.transportCategory,
         destination: departure.direction,
         arrivalTime: arrivalTime,
         duration: duration,
      };
   }).filter((departure) => departure.scheduledTime);
};

// Unified route to handle both stations and departures based on coordinates
router.post("/location", async (req, res) => {
   console.log("Request received for departures and arrivals", req.body);

   // Extract latitude and longitude from request body
   const { latitude, longitude } = req.body;

   if (!latitude || !longitude) {
      return res
         .status(400)
         .json({ message: "Latitude and longitude are required" });
   }

   try {
      // Fetch nearest station
      const nearestStation = await getNearestStationId(latitude, longitude);

      // 1. Check if any stations ID were found
      if (!nearestStation) {
         return res.status(400).json({ message: "No stations found nearby" });
      }
      // 2. Fetch departures for nearest station
      const departures = await getDepartureBoard(nearestStation.id);

      // Send station info and departures as response
      return res.json({
         station: nearestStation.name,
         departures,
      });
   } catch (error) {
      console.error("Error fetching location data", error);
      return res.status(500).json({ message: "Error fetching location data" });
   }
});

export default router;
