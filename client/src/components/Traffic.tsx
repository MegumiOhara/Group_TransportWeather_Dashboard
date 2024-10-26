import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrafficStatusUpdates = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [trafficData, setTrafficData] = useState<any>(null);