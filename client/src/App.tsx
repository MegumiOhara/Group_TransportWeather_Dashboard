import axios from "axios";
import { useEffect } from "react";
import AddressInput from "./components/Address";

function App() {
  
  const fetchApi = async() => {
    const response= await axios.get("http://localhost:3000/api");
    console.log(response);
  };

  useEffect(() => {
    fetchApi();
  }, [])
 
  return (
    <div>
      <h1>Local Transport and Weather Dashboard</h1>
      <AddressInput/>
    </div>
  )
}

export default App
