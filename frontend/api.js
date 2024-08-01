import axios from 'axios';

const API_BASE_URL = 'http://your-server-address:3000'; // Replace with your server's address

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error signing in');
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching current user');
  }
};
