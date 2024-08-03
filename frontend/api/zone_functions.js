import axios from "axios";

const API_BASE_URL = "http://192.168.1.101:8000";

export const get_zones = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching zones" };
  }
};