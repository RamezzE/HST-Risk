import axios from "axios";

import config from './config';


export const admin_login = async (name, password) => {
  try {
    const response = await axios.post(`${config.serverIP}/admin/login`, {
      name,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error logging in" };
  }
};

export const get_attacks_on_zone = async (zone) => {
  try {
    const response = await axios.get(`${config.serverIP}/attacks/get_attacks/${zone}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error getting attacks on zone" };
  }
}

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await axios.post(`${config.serverIP}/admin/add_team`, {
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
    const response = await axios.put(`${config.serverIP}/admin/team/${teamNo}`, {
      teamName,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating team" };
  }
};

export const update_country = async (name, teamNo) => {
  try {
    const response = await axios.put(`${config.serverIP}/admin/country/${name}`, {
      teamNo,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating country" };
  }
};

export const delete_team = async (teamNo) => {
  try {
    const response = await axios.delete(`${config.serverIP}/admin/team/${teamNo}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting team" };
  }
}
