import axios from "axios";

const API_BASE_URL = "http://192.168.1.110:8000";

export const admin_login = async (name, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, {
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
    const response = await axios.post(`${API_BASE_URL}/admin/add_team`, {
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
    const response = await axios.put(`${API_BASE_URL}/admin/team/${teamNo}`, {
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
    const response = await axios.delete(`${API_BASE_URL}/admin/team/${teamNo}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting team" };
  }
}
