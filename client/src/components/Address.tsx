import React from "react";
import axios from "axios";
import { useState } from "react";

function Address(){
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [error, setError] = useSate('');

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    
}