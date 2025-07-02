import axios from "axios";
import config from "./config";

const apiClient = axios.create({
  baseURL: config.serverIP + "/admins",
  timeout: 10000, // 10 seconds timeout
});

export const get_admin_by_name = async (name) => {
  try {
    const response = await apiClient.get(`/${name}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error getting admin by name" };
  }
};

export const get_admins = async () => {
  try {
    const response = await apiClient.get(`/`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error getting admins" };
  }
};

export const add_admin = async (name, war, type = "Wars") => {
  try {
    const response = await apiClient.put(`/`, {
      name,
      war,
      type,
    });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error adding admin" };
  }
};

export const update_admin = async (oldName, name, password, war, type) => {
  try {
    const response = await apiClient.post(`/update`, {
      oldName,
      name,
      password,
      war,
      type,
    });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating admin" };
  }
};

export const delete_admin = async (name) => {
  try {
    const response = await apiClient.delete(`/${name}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error deleting admin" };
  }
};
