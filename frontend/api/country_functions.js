import axios from "axios";
import config from "./config";

// Create an Axios instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/countries",
  timeout: 10000, // 10 seconds timeout
});

export const get_country_mappings = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching countries" };
  }
};

export const get_countries_by_team = async (teamNo) => {
  try {
    const response = await apiClient.get(`/${teamNo}`);
    return response.data;
  } catch (error) {
    return {
      errorMsg:
        error.response?.data || `Error fetching countries for team ${teamNo}`,
    };
  }
};

export const update_country = async (name, teamNo) => {
  try {
    const response = await apiClient.post(`/${name}`, {
      teamNo,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating country" };
  }
};
