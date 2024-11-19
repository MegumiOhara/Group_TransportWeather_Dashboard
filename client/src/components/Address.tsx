import React, { ChangeEvent, useState, FormEvent } from "react";
import axios from "axios";
import searchImg from "../images/magnifying-glass-solid.svg";
import mapImg from "../images/map-location-dot-solid.svg";

//component takes user's input and make a request to backend for geocode.

interface AddressInputProps {
   onGeocode: (lat: number, lng: number) => void;
   onError: (errorMessage: string) => void;
}

function AddressInput({ onGeocode, onError }: AddressInputProps) {
   //local state to store the user-inputted address.
   const [address, setAddress] = useState<string>("");
   //local state for suggestions 
   const [suggestions, setSuggestions] = useState<string[]>([]);

   //handle changes in the input field when typed.
   const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setAddress(input);

      if (input.length > 2){
         console.log("Sending input:", input)
         try {
            const response = await axios.post("http://localhost:3000/api/autocomplete", 
               {input,});
            setSuggestions(response.data.map((suggestion:any) => 
            suggestion.description));
         } catch (error) {
            console.error("Error fetching autocomplete suggestions", error)
            setSuggestions([]);
         } 
      } else{
         setSuggestions([]);
      }
   };

   const handleSuggestionClick = (suggestion: string) => {
      setAddress(suggestion);
      setSuggestions([]);
   }
   
   //handle form submission to trigger geocoding.
   const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault(); //prevents page regresn on form submit.

      try {
         //Send a POST request to the backend to get lat and lng.
         const response = await axios.post<{ lat: number; lng: number }>(
            "http://localhost:3000/api/address",
            { address }
         );
         //backend API route. Send the entered address in the request body.
         const { lat, lng } = response.data; //extract lat/lng from the response(API).
         onGeocode(lat, lng); //Pass lat/lng  to App.tsx.
      } catch (error) {
         console.error("Error fetching location:", error);
         onError("Error fetching location. Please try again");
      }
   };

   return (
      <div className="bg-custom-bg w-full h-full pb-2 .box-border flex flex-col items-center overflow-x-hidden">
         <div className="w-full box-border font-lato px-5 pt-4 flex content-evenly items-center 
            justify-evenly sm:justify-normal sm:p-3 md:grid grid-cols-6">
            <img
               className="w-[50px] h-[44px] mr-3 md:w-[105px] md:h-[93px] md:col-start-1 
               justify-self-end md:mt-5"
               src={mapImg}
               alt="logo"
            />
            <h1 className="text-[20px] md:text-[32px] text-slate-950 font-bold w-[223px] h-[28px] 
               md:col-start-3 justify-self-end md:mr-5 ">
               <span className="block sm:hidden">Local Traffic & Weather</span>
               <span className="hidden sm:block w-[513px] h-[45px]">
                  Local Traffic & Weather Dashboard
               </span>
            </h1>
         </div> 
         <div>
            <hr className="block sm:hidden left-0 w-screen border-t border-zinc-800 my-4 mx-auto" />
            <form
               className="bg-white appearance-none border-2 border-gray-200 m-auto box-border w-[287px]
               h-[40px] md:w-[449px] md:h-[45px] flex border-none rounded hover:border-solid border-2 
               border-orange-200 transition-colors duration-300 active:border-orange-300 transition-all duration-300
               "
               onSubmit={handleFormSubmit}>
               <button
                  className="m-auto h-[40px] w-[40px] cursor-pointer"
                  type="submit">
                  <img
                     className="h-[16px] w-[16px] md:w-[25px] m-auto bg-inherit"
                     src={searchImg}
                     alt="search"
                  />
               </button>
               <input
                  className="bg-white appearance-none border-2 border-gray-200 w-full
                  text-xs rounded py-2 px-3 leading-tight md:text-[21px] 
                  border-none focus:outline-none focus:border-orange-500 md:focus:ring-1 focus:ring-orange-200 "
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange} //handle user input changes.
                  placeholder="Enter your address..."
               />
            </form>
            <ul>
               {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                     {suggestion}
                  </li>
               ))}
            </ul>
            <hr className="hidden sm:block left-0 w-screen border-t border-zinc-600 my-4" />
         </div>
      </div>
   );
}

export default AddressInput;
