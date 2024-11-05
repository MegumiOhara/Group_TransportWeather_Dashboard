import { useState, useEffect } from "react";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";

//Component fetches and displays joke from the backend server
//when fetchNewJoke is "true"

//Component props for fetchNewJoke prop
interface JokeProps {
   fetchNewJoke: boolean;
}

function Joke({ fetchNewJoke }: JokeProps) {
   //local state to store joke
   const [joke, setJoke] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);

   //useEffect will be triggered when fetchNewJoke changes
   useEffect(() => {
      //Exit early if fetchNewJoke is false
      if (!fetchNewJoke) return;

      //asynchronous function to fetch a joke from the backend
      const getJoke = async () => {
         setLoading(true); // Start Loading
         try {
            //Get request to the backend joke route
            const response = await axios.get("http://localhost:3000/api/joke");
            //if success -response from the backend.Store the joke in the 'joke'state
            setJoke(response.data.joke);
         } catch (error) {
            console.error("Error fetching joke:", error);
            setJoke("Joke could not load.");
         } finally {
            setLoading(false);
         }
      };
      //call the function
      getJoke();
      //only re-run this effect when fetchNewJoke changes
   }, [fetchNewJoke]);

   return (
      <div className="p-4 bg-custom-bg md:p-0 md:pt-0">
         <div className="w-full max-w-[297px] sm:max-w-[449px] md:max-w-[669px] lg:max-w-[669px] xl:max-w-[669px] mx-auto p-4 border-2 border-[#E4602F] rounded-md bg-white">
            <h2 className="text-[#D13C1D] font-lato text-base font-semibold mb-2">
               Dad joke of the day
            </h2>
            <div className="p-4 border border-[#DEDBD4] rounded-md bg-white">
               {loading ? (
                  // Show Skeleton Loader while loading
                  <SkeletonLoader width="w-full" height="h-6" />
               ) : (
                  // Show the joke once it's loaded
                  <p className="text-black font-lato text-sm font-semibold mb-4">
                     {joke}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}

export default Joke;
