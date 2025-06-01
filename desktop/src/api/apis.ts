import axios from "axios";

// Create an Axios instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_IP as string,
  timeout: 10000, // 10 seconds timeout
});

export const get_country_mappings = async () => {
  try {
    const response = await apiClient.get('/countries');
    console.log("Countries response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as import("axios").AxiosError;
      return { errorMsg: axiosError.response?.data || "Error fetching countries" };
    }
    return { errorMsg: "Error fetching countries" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await apiClient.get('/teams');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as import("axios").AxiosError;
      return { errorMsg: axiosError.response?.data || "Error fetching teams" };
    }
    return { errorMsg: "Error fetching teams" };
  }
};