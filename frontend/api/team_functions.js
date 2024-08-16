import axios from "axios";
import config from "./config";

// Create an Axios instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/teams",
  timeout: 10000, // 10 seconds timeout
});

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await apiClient.put('/', {
      teamNo,
      teamName,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error Adding Team" };
  }
};

export const update_team = async (teamNo, teamName, password) => {
  try {
    const response = await apiClient.post(
      `/update/${teamNo}`,
      {
        teamName,
        password,
      }
    );

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating team" };
  }
};

export const delete_team = async (teamNo) => {
  try {
    const response = await apiClient.delete(`/${teamNo}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting team" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching teams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await apiClient.get(`/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching team" };
  }
};
