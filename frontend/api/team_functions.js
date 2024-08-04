import axios from "axios";

import { serverIP } from "./config";

export const login = async (teamNo, password) => {
  try {
    const response = await axios.post(`${serverIP}/login`, {
      teamNo,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error logging in4" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await axios.get(`${serverIP}/all_teams`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching teams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await axios.get(`${serverIP}/team/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching team" };
  }
};
