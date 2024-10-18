import React, { ChangeEvent } from "react";
import axios from "axios";
import { useState } from "react";

function AddressInput (){
    const [address, setAddress] = useState<string>("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAddress(e.target.value);
    }

    const handleFormSubmit = async (e:React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setLat(null);
        setLng(null);

        try {
            const response = await axios.post<{ lat: number; lng: number }>
            ("http://localhost:3000/api/address", {address});
            const {lat, lng} = response.data;
            setLat(lat);
            setLng(lng);
        } catch (error) {
            console.error('Error fetching location:');
            setError('Error fetching location. Please try again');
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

            {error && <p>{error}</p>}
            {lat && lng &&(
                <div>
                    <p>Latitude: {lat}</p>
                    <p>Longitude: {lng}</p>
                </div>
            )}
        </div>
    );
};

export default AddressInput;
