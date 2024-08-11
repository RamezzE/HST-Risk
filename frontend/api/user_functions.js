import axios from "axios";

import config from "./config";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${config.serverIP}/login`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Could not log in" };
  }
};