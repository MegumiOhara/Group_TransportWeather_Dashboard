import React, { ChangeEvent, useState } from "react";
import axios from "axios";
//import { useState } from "react";
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

   //handle changes in the input field when typed.
   const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setAddress(e.target.value);
   };

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
      <div className="w-full h-full pb-2 bg-custom-bg .box-border flex flex-col items-center overflow-x-hidden">
         <div className="w-full box-border font-lato px-5 pt-4 flex content-evenly items-center justify-evenly sm:justify-normal sm:p-3 md:grid grid-cols-6">
            <img
               className="w-[50px] h-[44px] mr-3 md:w-[105px] md:h-[93px] md:col-start-1 justify-self-end md:mt-5"
               src={mapImg}
               alt="logo"
            />
            <h1 className="text-[20px] md:text-[32px] text-slate-950 font-bold w-[223px] h-[28px] md:col-start-3 justify-self-end md:mr-5 ">
               <span className="block sm:hidden">Local Traffic & Weather</span>
               <span className="hidden sm:block w-[513px] h-[45px]">
                  {" "}
                  Local Traffic & Weather Dashboard
               </span>
            </h1>
         </div>
         <div>
            <hr className="block sm:hidden left-0 w-screen border-t border-zinc-800 my-4 mx-auto" />
            <form
               className="m-auto .box-border w-[287px] h-[40px] md:w-[449px] md:h-[40px] bg-white flex border rounded hover:border-orange-200 transition-colors duration-300"
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
                  className="w-full text-xs rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border bg-white border-transparent"
                  type="text"
                  value={address}
                  onChange={handleAddressChange} //handle user input changes.
                  placeholder="Enter your address..."
               />
            </form>
            <hr className="hidden sm:block left-0 w-screen border-t border-zinc-600 my-4" />
         </div>
      </div>
   );
}

export default AddressInput;
