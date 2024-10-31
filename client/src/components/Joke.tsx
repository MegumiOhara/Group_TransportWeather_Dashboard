import { useState, useEffect } from "react";
import axios from "axios";

//Component fetches and displays joke from the backend server
//when fetchNewJoke is "true"

//Component props for fetchNewJoke prop
interface JokeProps {
   fetchNewJoke: boolean;
}

function Joke({ fetchNewJoke }: JokeProps) {
   //local state to store joke
   const [joke, setJoke] = useState<string>("");

   //useEffect will be triggered when fetchNewJoke changes
   useEffect(() => {
      //Exit early if fetchNewJoke is false
      if (!fetchNewJoke) return;

      //asynchronous function to fetch a joke from the backend
      const getJoke = async () => {
         try {
            //Get request to the backend joke route
            const response = await axios.get("http://localhost:3000/api/joke");
            //if success -response from the backend.Store the joke in the 'joke'state
            setJoke(response.data.joke);
         } catch (error) {
            console.error("Error fetching joke:", error);
            setJoke("Joke could not load.");
         }
      };
      //call the function
      getJoke();
      //only re-run this effect when fetchNewJoke changes
   }, [fetchNewJoke]);

   return (
      <div className="p-4">
         <div className="max-w-md mx-auto p-4 border border-[#E4602F] rounded-md bg-white">
            <h2 className="text-[#E4602F] font-lato text-base font-semibold mb-2">
               Dad joke of the day
            </h2>
            <div className="max-w-md mx-auto p-4 border border-[#DEDBD4] rounded-md bg-white">
               <p className="text-black font-lato text-sm font-semibold mb-4">
                  {joke}
               </p>
            </div>
         </div>
      </div>
   );
}

export default Joke;
