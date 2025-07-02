import axios from "axios";

import config from "./config";

// Create an apiClient instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/users",
  timeout: 10000, // 10 seconds timeout
});

export const login = async (username, password) => {
  try {
    const response = await apiClient.post(`/login`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Could not log in" };
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.get(`/logout`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Could not log out" };
  }
};

export const is_logged_in = async () => {
  try {
    const response = await apiClient.get(`/is_logged_in`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Could not check login status" };
  }
};

export const addPushToken = async (token, teamNo) => {
  try {
    const response = await apiClient.post(`/pushToken`, { token, teamNo });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Could not add push token" };
  }
}

export const deletePushToken = async (token, teamNo) => {
  try {
    const response = await apiClient.delete(`/pushToken`, { data: { token, teamNo } });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Could not delete push token" };
  }
}