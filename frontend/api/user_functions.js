import axios from "axios";

import config from "./config";

serverIP = config.serverIP + "/users";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${serverIP}/login`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Could not log in" };
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${serverIP}/logout`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Could not log out" };
  }
};

export const is_logged_in = async () => {
  try {
    const response = await axios.get(`${serverIP}/is_logged_in`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Could not check login status" };
  }
};