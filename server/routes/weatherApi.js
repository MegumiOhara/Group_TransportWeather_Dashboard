import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const apiKey = process.env.OPENWEATHER_API_KEY; // Lee la API Key del archivo .env
if (process.env.NODE_ENV !== "production") {
   console.log("API Key:", apiKey);
} // Verifica que se esté leyendo correctamente

router.post("/weather", async (req, res) => {
   const { lat, lng } = req.body;

   try {
      const weatherResponse = await axios.get(
         `https://api.openweathermap.org/data/2.5/weather`,
         {
            params: {
               lat,
               lon: lng,
               appid: apiKey,
               units: "metric", // Para obtener la temperatura en Celsius
               lang: "en", // Para obtener los datos en inglés
            },
         }
      );

      const forecastResponse = await axios.get(
         `https://api.openweathermap.org/data/2.5/forecast`,
         {
            params: {
               lat,
               lon: lng,
               appid: apiKey,
               units: "metric", // Para obtener la temperatura en Celsius
               lang: "en", // Para obtener los datos en inglés
            },
         }
      );

      const weatherData = {
         city: weatherResponse.data.name,
         temperature: weatherResponse.data.main.temp,
         condition: weatherResponse.data.weather[0].description,
         forecast: forecastResponse.data.list,
      };

      res.json(weatherData);
   } catch (error) {
      console.error(
         "Error fetching weather data:",
         error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch weather data" });
   }
});

export default router;
