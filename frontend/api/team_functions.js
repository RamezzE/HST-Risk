import axios from "axios";

import config from "./config";

serverIP = config.serverIP + "/teams"

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await axios.put(`${serverIP}`, {
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
    const response = await axios.post(
      `${serverIP}/update/${teamNo}`,
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
    const response = await axios.delete(
      `${serverIP}/${teamNo}`
    );

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting team" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await axios.get(`${serverIP}`);
    console.log(response)
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching teams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await axios.get(`${serverIP}/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error fetching team" };
  }
};