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
    return { errorMsg: error.response?.data || "API: Error getting admin by name" };
  }
};

export const get_admins = async () => {
  try {
    const response = await apiClient.get(`/`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error getting admins" };
  }
};

export const add_admin = async (name, war) => {
  try {
    const response = await apiClient.put(`/`, {
      name,
      war,
    });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error adding admin" };
  }
};

export const update_admin = async (oldName, name, password, war) => {
  try {
    const response = await apiClient.post(`/update`, {
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
    const response = await apiClient.delete(`/${name}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error deleting admin" };
  }
};
