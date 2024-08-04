import axios from "axios";

import { serverIP } from "./config";

export const admin_login = async (name, password) => {
  try {
    const response = await axios.post(`${serverIP}/admin/login`, {
      name,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error logging in" };
  }
};

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await axios.post(`${serverIP}/admin/add_team`, {
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
    const response = await axios.put(`${serverIP}/admin/team/${teamNo}`, {
      teamName,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating team" };
  }
};

export const delete_team = async (teamNo) => {
  try {
    const response = await axios.delete(`${serverIP}/admin/team/${teamNo}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting team" };
  }
}
