import axios from 'axios';
import { getToken } from './AuthService'; 

const API_URL = 'http://localhost:5000/api/trips'; 
export const createTrip = async (startLocation: { type: string; coordinates: [number, number] }, endLocation: { type: string; coordinates: [number, number] }) => {
    const token = getToken();
    try {
        const response = await axios.post(API_URL, {
            startLocation,
            endLocation
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
};
