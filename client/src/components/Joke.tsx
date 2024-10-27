import React, { useState, useEffect } from "react";
import axios from "axios";

interface JokeProps {
    fetchNewJoke: boolean; 
}

function Joke ({ fetchNewJoke}: JokeProps){
    //local state to store joke
    const [joke, setJoke] = useState<string>("");

    useEffect(() => {
        const getJoke = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/joke");
                setJoke(response.data.joke); //response frpm the backend
            } catch (error) {
                console.error("Error fetching joke:", error);
                setJoke("Joke could not load.");
            }
        };

        if (fetchNewJoke) {
        getJoke();
    }
    } ,[fetchNewJoke]);

    return (
        <div>
            <h2>Dad joke of the day</h2>
            <p>{joke}</p>
        </div>
    )
   
};

export default Joke