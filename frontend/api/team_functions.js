import axios from "axios";
import config from "./config";

// Create an Axios instance with a global 10-second timeout
const apiClient = axios.create({
  baseURL: config.serverIP + "/teams",
  timeout: 10000, // 10 seconds timeout
});

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await apiClient.put('/', {
      teamNo,
      teamName,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error Adding Team" };
  }
};

export const update_team = async (teamNo, teamName, teamBalance) => {
  try {
    const response = await apiClient.post(
      `/update/${teamNo}`,
      {
        teamName,
        teamBalance,
      }
    );

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating team" };
  }
};

export const delete_team = async (teamNo) => {
  try {
    const response = await apiClient.delete(`/${teamNo}`);

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error deleting team" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching teams" };
  }
};

export const get_all_subteams = async () => {
  try {
    const response = await apiClient.get('/subteams');
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching subteams" };
  }
};

export const get_team = async (teamNo) => {
  try {
    const response = await apiClient.get(`/${teamNo}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching team" };
  }
};

export const create_teams = async ( numTeams, numSubTeams ) => {
  try {
    const response = await apiClient.post('/create-teams', {
      numTeams,
      numSubTeams,
    });
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error creating teams" };
  }
};

export const update_subteam = async (username, password) => {
  try {
    const response = await apiClient.post('/update-subteam', {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating subteam" };
  }
};

export const update_team_balance = async (teamNo, amount, type) => {
  try {
    const response = await apiClient.post('/update-balance', {
      teamNo,
      amount,
      type,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error updating team balance" };
  }
}