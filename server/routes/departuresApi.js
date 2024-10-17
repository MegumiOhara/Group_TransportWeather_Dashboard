import express from "express";
//import cors from "cors";
import axios from "axios";
//require("dotenv").config();
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
//const app = express();

// Router instead of app
const router = express.Router();

// Set the port
//const PORT = 3000;

// Middleware to handle CORS
//app.use(cors());
//app.use(express.json());

// API-key
const apiKey = process.env.TRAFIKVERKET_API_KEY;

// TrainAnnouncement = för realtidsdata om tåg
// TrainMessage : för meddelanden om trafikstörningar eller annan viktig information för tågtrafiken
// FerryAnnouncement: för tidtabeller och status för färjor

// Kombinera detta med Google Geocoding API för att hämta platsdata beroende på användarens position, vilket kan användas för att dynamiskt ställa in "LocationSignature" för den närmaste stationen eller färjeplatsen.

// Route to fetch train departures
router.get("/train-departures", async (req, res) => {
   const requestBody = `
     <REQUEST>
       <LOGIN authenticationkey="${apiKey}" />
       <QUERY sseurl="true" objecttype="TrainAnnouncement" schemaversion="1.9" limit="10">
         <FILTER>
         </FILTER>
        <INCLUDE>ActivityType</INCLUDE>
        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>InformationOwner</INCLUDE>
        <INCLUDE>ProductInformation</INCLUDE>
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>Canceled</INCLUDE>
        <INCLUDE>Deviation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
       </QUERY>
     </REQUEST>
     `;

   console.log("Sending XML request to Trafikverket API:");
   console.log(requestBody);

   try {
      // Fetch station map dynamically
      const stationResponse = await axios.get(
         "http://localhost:8080/api/stations"
      );
      const stationMap = stationResponse.data;

      // Send POST-req to Trafikverket's API
      const response = await axios.post(
         "https://api.trafikinfo.trafikverket.se/v2/data.json",
         requestBody,
         {
            headers: {
               "Content-Type": "application/xml",
            },
         }
      );

      // Replace LocationSignature with full station names
      const trainData = response.data.RESPONSE.RESULT[0].TrainAnnouncement.map(
         (announcement) => {
            // Replace FromLocation and ToLocation signatures with full names if available
            if (announcement.FromLocation) {
               announcement.FromLocation = announcement.FromLocation.map(
                  (location) => {
                     return (
                        stationMap[location.LocationName] ||
                        location.LocationName
                     );
                  }
               );
            }

            if (announcement.ToLocation) {
               announcement.ToLocation = announcement.ToLocation.map(
                  (location) => {
                     return (
                        stationMap[location.LocationName] ||
                        location.LocationName
                     );
                  }
               );
            }

            // Replace LocationSignature with full name
            if (announcement.LocationSignature) {
               announcement.LocationSignature =
                  stationMap[announcement.LocationSignature] ||
                  announcement.LocationSignature;
            }

            return announcement;
         }
      );

      // Send back data to front end
      res.json(response.data);
   } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({
         message: "Error fetching data from Trafikverket",
      });
   }
});

// Route to fetch all station names and their signatures
router.get("/stations", async (req, res) => {
   const requestBody = `
   <REQUEST>
       <LOGIN authenticationkey="${apiKey}" />
       <QUERY objecttype="TrainStation" namespace="rail.infrastructure" schemaversion="1.5">
       <INCLUDE>AdvertisedLocationName</INCLUDE>
       <INCLUDE>Geometry</INCLUDE>
       <INCLUDE>LocationSignature</INCLUDE>
       </QUERY>
     </REQUEST>
   `;

   try {
      const response = await axios.post(
         "https://api.trafikinfo.trafikverket.se/v2/data.json",
         requestBody,
         {
            headers: {
               "Content-Type": "application/xml",
            },
         }
      );
      console.log(
         "Trafikverkets API reponse:",
         JSON.stringify(response.data, null, 2)
      );
      // Process the response to create a mapping of LocationsSignature to full station name
      const stations = response.data.RESPONSE.RESULT[0].TrainStation;

      const stationMap = {};

      // Iterate over stations and create a map
      stations.forEach((station) => {
         stationMap[station.LocationSignature] = station.AdvertisedLocationName;
      });

      // Send back the mapping to the client or store it
      res.json(stationMap);
   } catch (error) {
      console.error("Error fetching station data", error);
      res.status(500).json({
         message: "Error fetching data from Trafikverket",
      });
   }
});

// Route to fetch train traffic messages (disruptions)
// router.get("/train-messages", async (req, res) => {
//    const requestBody = `
//        <REQUEST>
//          <LOGIN authenticationkey="${apiKey}" />
//          <QUERY objecttype="TrainMessage" schemaversion="1.7" limit="10">
//            <FILTER>
//            </FILTER>
//            <INCLUDE>ExternalDescription</INCLUDE>
//            <INCLUDE>ReasonCodeText</INCLUDE>
//            <INCLUDE>TrafficImpact</INCLUDE>
//            <INCLUDE>AffectedLocation</INCLUDE>
//          </QUERY>
//        </REQUEST>
//        `;

//    try {
//       // Send POST-req to Trafikverket's API
//       const response = await axios.post(
//          "https://api.trafikinfo.trafikverket.se/v2/data.json",
//          requestBody,
//          {
//             headers: {
//                "Content-Type": "application/xml",
//             },
//          }
//       );

//       // Send back data to front end
//       res.json(response.data);
//    } catch (error) {
//       console.error("Error fetching tågtrafikstörningar:", error);
//       res.status(500).json({
//          message: "Error fetching data from Trafikverket",
//       });
//    }
// });

// Route to fetch ferry departures
router.get("/ferry-departures", async (req, res) => {
   const requestBody = `
      <REQUEST>
        <LOGIN authenticationkey="${apiKey}" />
        <QUERY objecttype="FerryAnnouncement" namespace="ferry.trafficinfo" schemaversion="1.2" limit="10">
          <FILTER> 
          </FILTER>
          <INCLUDE>DepartureTime</INCLUDE>
          <INCLUDE>FromHarbor</INCLUDE>
          <INCLUDE>ToHarbor</INCLUDE>
        </QUERY>
      </REQUEST>
      `;

   try {
      const response = await axios.post(
         "https://api.trafikinfo.trafikverket.se/v2/data.json",
         requestBody,
         {
            headers: {
               "Content-Type": "application/xml",
            },
         }
      );

      res.json(response.data);
   } catch (error) {
      console.error("Fel vid hämtning av färjedata:", error);
      res.status(500).json({
         message: "Error fetching data from Trafikverket",
      });
   }
});

// Start the express server
// app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
// });

export default router;
