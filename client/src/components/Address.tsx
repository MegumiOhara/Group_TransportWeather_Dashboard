import React, { ChangeEvent } from "react";
import axios from "axios";
import { useState } from "react";

//component takes user's input and make a request to backend for geocode.

interface AddressInputProps {
    onGeocode: (lat: number, lng: number) => void;
    onError: (errorMessage: string) => void;
}

function AddressInput ({ onGeocode, onError} : AddressInputProps){
    //local state to store the user-inputted address.
    const [address, setAddress] = useState<string>("");

    //handle changes in the input field when typed.
    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAddress(e.target.value);
    }

    //handle form submission to trigger geocoding.
    const handleFormSubmit = async (e:React.FormEvent): Promise<void> => {
        e.preventDefault();//prevents page regresn on form submit.

        try {
            //Send a POST request to the backend to get lat and lng.
            const response = await axios.post<{ lat: number; lng: number }>
            ("http://localhost:3000/api/address", {address}); 
            //backend API route. Send the entered address in the request body.
            const {lat, lng} = response.data;//extract lat/lng from the response(API).
            onGeocode(lat, lng); //Pass lat/lng  to App.tsx.
        } catch (error: any) {
            console.error('Error fetching location:');
            onError('Error fetching location. Please try again');
        }
    };

    return(
        <div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type= "text"
                    value= {address}
                    onChange= {handleAddressChange}//handle user input changes.
                    placeholder= "Enter your address..."
                    />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default AddressInput;
