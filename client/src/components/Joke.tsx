import React, { useState, useEffect } from "react";
import axios from "axios";

interface JokeProps {
    fetchNewJoke: boolean; 
}

function Joke ({ fetchNewJoke}: JokeProps){
    //local state to store joke
    const [joke, setJoke] = useState<string>("");

    useEffect(() => {
        if(!fetchNewJoke) return; //Exit early if no new fetch required
        const getJoke = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/joke");
                setJoke(response.data.joke); //response frpm the backend
            } catch (error) {
                console.error("Error fetching joke:", error);
                setJoke("Joke could not load.");
            }
        };

        getJoke();
    
    } ,[fetchNewJoke]);

    return (
        <div className = "p-4">
            <div className = "max-w-md mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
                <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
                    Dad joke of the day
                </h2>
                <div className = "max-w-md mx-auto p-4 border border-[#DEDBD4] rounded-md bg-white">
                    <p className="text-black font-lato text-sm font-semibold mb-4">
                        {joke}
                    </p>
                </div>
            </div>
        </div>
    )
   
};

export default Joke