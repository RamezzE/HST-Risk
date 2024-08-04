import axios from "axios";

import { serverIP } from "./config";

export const get_zones = async () => {
  try {
    const response = await axios.get(`${serverIP}/zones`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching zones" };
  }
};