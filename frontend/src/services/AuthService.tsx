import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/user'; 


export const getToken = () => {
    return Cookies.get('token'); 
};

export const register = async (fullName: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            fullName,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log("I am access.")
        // console.log(response.data)
        Cookies.set('token', response.data.data.accessToken);
        Cookies.set('refreshToken', response.data.refreshToken);

        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const logout = async () => {
    const token = getToken();
    try {
        const response = await axios.post(`${API_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        
        Cookies.remove('token');
        Cookies.remove('refreshToken');

        return response.data;
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/current-user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
