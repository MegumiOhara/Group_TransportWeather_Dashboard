import axios from "axios";
import { useEffect } from "react";

function App() {
  
  const fetchApi = async() => {
    const response= await axios.get("http://localhost:8080/api");
    console.log(response);
  };

  useEffect(() => {
    fetchApi();
  }, [])
 
  return (
    <div>
      <h1>Local Transport and Weather Dashboard</h1>
      //add components after exporting//
    </div>
  )
}

export default App
