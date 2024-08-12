import axios from "axios";

import config from "./config";

const serverIP = config.serverIP + "/admins"

export const get_admin_by_name = async (name) => {
  try {
    const response = await axios.get(`${serverIP}/${name}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error getting admin by name" };
  }
}

export const get_admins = async () => {
  try {
    const response = await axios.get(`${serverIP}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error getting admins" };
  }
};

export const add_admin = async (name, password, war) => {
  try {
    const response = await axios.put(`${serverIP}`, {
      name,
      password,
      war,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error adding admin" };
  }
};

export const update_admin = async (oldName, name, password, war) => {
  try {
    const response = await axios.post(`${serverIP}/update`, {
      oldName,
      name,
      password,
      war,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating admin" };
  }
};

export const delete_admin = async (name) => {
  try {
    const response = await axios.delete(`${serverIP}/${name}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting admin" };
  }
};
