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
   BLT: { type: "Regional Bus", icon: "fa-bus" },
   BXB: { type: "Express Bus", icon: "fa-bus-alt" },
   BAX: { type: "Airport Express Bus", icon: "fa-bus-alt" },
   BRE: { type: "Regional Bus", icon: "fa-bus" },
   BBL: { type: "Train Replacement Bus", icon: "fa-bus" },
   ULT: { type: "Metro", icon: "fa-train-subway" },
   JAX: { type: "Airport Express Train", icon: "fa-train" },
   JEX: { type: "Express Train", icon: "fa-train" },
   JIC: { type: "InterCity Train", icon: "fa-train" },
   JLT: { type: "Local Train", icon: "fa-train" },
   JPT: { type: "PågaTåg", icon: "fa-train" },
   JST: { type: "High-speed Train", icon: "fa-train" },
   JRE: { type: "Regional Train", icon: "fa-train" },
   SLT: { type: "Tram", icon: "fa-train-tram" },
   FLT: { type: "Local Ferry", icon: "fa-ferry" },
   FUT: { type: "International Ferry", icon: "fa-ferry" },
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
            maxNo: 1,
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

// Function to fetch departure from the nearest station
const getDepartureBoard = async (stationId) => {
   const params = {
      accessId: apiKey,
      id: stationId,
      format: "json",
      //duration: 60, // Get departures for the next hour
      maxJourneys: 5, // Limit to 5 departures
      passlist: 1, // Passlist (list of stops along the route) to get arrival times
      lang: "en",
   };

   const data = await fetchDataFromResRobot(departureBoardApiUrl, params);

   console.log("Departure data:", data); // Log the data for debugging

   if (!data.Departure || data.Departure.length === 0) {
      return null;
   }

   // Extract information for each departure
   const departures = data.Departure.map((departure) => {
      const product = departure.ProductAtStop || {};

      console.log("Product at Stop:", product);

      const vehicleCode = product.catOut || product.catOutS || "Unknown";

      console.log("Vehicle Code:", vehicleCode);

      let vehicleType = "Unknown";
      let vehicleIcon = "fa-circle-question";

      // Map vehicle code to type and icon
      if (vehicleCode !== "Unknown") {
         const matchingType = vehicleTypeIcons[vehicleCode.toUpperCase()];
         if (matchingType) {
            vehicleType = matchingType.type;
            vehicleIcon = matchingType.icon;
         } else {
            console.log(`No match found for vehicle code: ${vehicleCode}`);
         }
      }

      // Extract arrival time and calculate journey duration
      let arrivalTime = "XX.XX";
      let duration = "";

      if (departure.Stops && departure.Stops.Stop) {
         const stops = departure.Stops.Stop;
         const lastStop = stops[stops.length - 1];

         if (lastStop && lastStop.arrTime && lastStop.arrDate) {
            arrivalTime = lastStop.arrTime.slice(0, 5); // Only time part

            // Calculate duration with between departure and arrival times (ISO Format)
            const departureDateTime = new Date(
               `${departure.date}T${departure.time}`
            );
            const arrivalDateTime = new Date(
               `${lastStop.arrDate}T${lastStop.arrTime}`
            );
            // Check if both Date objects are valid
            if (!isNaN(departureDateTime) && !isNaN(arrivalDateTime)) {
               const diffMs = arrivalDateTime - departureDateTime;

               // Convert milliseconds to total minutes
               const diffMins = Math.round(diffMs / 60000);

               // Convert total minutes to hours and remaining minutes
               const hours = Math.floor(diffMins / 60); // Get the whole number of hours
               const minutes = diffMins % 60; // Get the remaining minutes

               // Format the duration string depending on wheter the trip is longer than one hour
               if (hours > 0) {
                  duration = `${hours} h ${minutes} min`; // If there are hours, include both hours and minutes
               } else {
                  duration = `${minutes} min`; // Otherwise, only show minutes
               }
            }
         }
      }

      const formattedDepartureTime = departure.time.slice(0, 5); // Only hours and minutes

      // Create and return a new object for each departure, containing all relevant fields for easier use in the frontend.
      return {
         departureStation: departure.stop,
         arrivalStation: departure.direction,
         departureTime: formattedDepartureTime,
         arrivalTime,
         duration,
         vehicleType,
         vehicleIcon,
         displayNumber: product.displayNumber || product.num || "Unknown",
         operator: product.operator || "Unknown",
      };
   });

   return departures;
};

// Route to handle departures based on coordinates
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
      // Fetch nearest station
      const nearestStation = await getNearestStationId(latitude, longitude);

      // 1. Check if any stations ID were found
      if (!nearestStation) {
         return res.status(200).json({
            message:
               "No stations found nearby. Please try a different location.",
         });
      }
      // 2. Fetch departures for nearest station
      const departures = await getDepartureBoard(nearestStation.id);

      if (!departures) {
         return res.status(200).json({
            message:
               "No departures found at this time. Please try again later.",
         });
      }

      // Send station info and departures as response
      return res.json({
         station: nearestStation.name,
         departures: departures,
      });
   } catch (error) {
      console.error("Error fetching location data", error);
      return res.status(500).json({ message: "Error fetching location data" });
   }
});

export default router;
