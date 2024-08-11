import axios from "axios";

import config from "./config";

serverIP = config.serverIP + "/warzones";

export const get_warzones = async () => {
  try {
    const response = await axios.get(`${serverIP}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching warzones" };
  }
};

export const get_wars = async () => {
  try {
    const response = await axios.get(`${serverIP}/wars`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching wars" };
  }
};
