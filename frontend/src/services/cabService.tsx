import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/cabs'; 



const getToken = () => {
    return Cookies.get('token'); 
};

export const getCabs = async () => {
    const token = getToken();
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cabs:', error);
        throw error;
    }
};



interface Location {
    type: string; 
    coordinates: [number, number]; 
}

interface CabData {
    cabId: string;
    location: Location;
}

export const addCab = async (cabData: CabData) => {
    const token = getToken();
    try {
        const response = await axios.post(`${API_URL}/add-cab`, cabData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding cab:', error);
        throw error;
    }
};
