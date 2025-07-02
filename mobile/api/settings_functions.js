import axios from "axios";
import config from "./config";

// Create an Axios instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/settings",
  timeout: 10000, // 10 seconds timeout
});

export const get_settings = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching settings" };
  }
};

export const update_setting = async (name, value) => {
  try {
    const response = await apiClient.put(`/update`, { name, value });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating setting" };
  }
}
