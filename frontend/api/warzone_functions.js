import axios from "axios";

import config from "./config";

// Create an apiClient instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/warzones",
  timeout: 10000, // 10 seconds timeout
});

export const get_warzones = async () => {
  try {
    const response = await apiClient.get(`/`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching warzones" };
  }
};

export const get_wars = async () => {
  try {
    const response = await apiClient.get(`/wars`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching wars" };
  }
};

export const create_warzone = async (data) => {
  try {
    const response = await apiClient.post(`/`, data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error creating warzone" };
  }
};

export const update_warzone = async (data) => {
  try {
    const response = await apiClient.put(`/`, data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating warzone" };
  }
};

export const delete_warzone = async (id) => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error deleting warzone" };
  }
};
