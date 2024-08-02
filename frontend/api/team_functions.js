import axios from "axios";

const API_BASE_URL = "http://192.168.1.110:8000";

export const login = async (teamNo, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      teamNo,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error logging in4" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all_teams`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching teams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching team" };
  }
};
