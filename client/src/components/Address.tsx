import React, { ChangeEvent } from "react";
import axios from "axios";
import { useState } from "react";

interface AddressInputProps {
    onGeocode: (lat: number, lng: number) => void;
    onError: (errorMessage: string) => void;
}

function AddressInput ({ onGeocode, onError}: AddressInputProps){
    const [address, setAddress] = useState<string>("");

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAddress(e.target.value);
    }

    const handleFormSubmit = async (e:React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const response = await axios.post<{ lat: number; lng: number }>
            ("http://localhost:3000/api/address", {address});
            const {lat, lng} = response.data;
            onGeocode(lat, lng); //Pass lat/lng  to the parent component
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
                    onChange= {handleAddressChange}
                    placeholder= "Enter your address..."
                    />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default AddressInput;
