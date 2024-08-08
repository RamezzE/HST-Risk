import axios from "axios";

import config from "./config";

export const login = async (teamNo, password) => {
  try {
    const response = await axios.post(`${config.serverIP}/teams/login`, {
      teamNo,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error logging in" };
  }
};

export const check_team_session = async () => {
  try {
    const response = await axios.post('')
  }
  catch(error) {
    return false 
  }
}

export const get_all_teams = async () => {
  try {
    const response = await axios.get(`${config.serverIP}/all_teams`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching teams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await axios.get(`${config.serverIP}/team/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching team" };
  }
};

export const attack = async (zone_1, team_1, zone_2, team_2) => {
  try {
    const response = await axios.post(`${config.serverIP}/attack`, {
      zone_1,
      team_1,
      zone_2,
      team_2,
    });
    
    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error making attack request",
    };
  }
};
