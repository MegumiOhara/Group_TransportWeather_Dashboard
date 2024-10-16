import axios from "axios";
import { useEffect } from "react";
import './App.css';
import NavBarW from "./components/NavBarW"

function App() {

  const fetchApi = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response);
  };

  useEffect(() => {
    fetchApi();
  }, [])

  return (
    <div>
      <h1>Local Transport and Weather Dashboard</h1>
      //add components after exporting//

      <NavBarW />


    </div>
  )
}

export default App
