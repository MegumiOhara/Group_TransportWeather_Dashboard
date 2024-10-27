import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
<<<<<<< HEAD
import './App.css';
import NavBarW from "./components/NavBarW";
import WeatherPanel from "./components/WeatherPanel";

const App: React.FC = () => {
  const fetchApi = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching API:", error); // manage of errors
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div>
      <NavBarW />
      <WeatherPanel />
    </div>
  );
}

export default App;
