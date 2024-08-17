import axios from "axios";
import config from "./config";

const apiClient = axios.create({
  baseURL: config.serverIP + "/attacks",
  timeout: 10000, // 10 seconds timeout
});

export const attack_check = async (zone_1, team_1, subteam_1, zone_2, team_2) => {
  try {
    const response = await apiClient.post('/check', {
      zone_1,
      team_1,
      subteam_1,
      zone_2,
      team_2,
    });

    return response.data;
  } catch (error) {
    console.log("Error checking attack:", error);
    return {
      errorMsg: error.response?.data || "API: Error checking attack"
    };
  }
};

export const attack = async (zone_1, team_1, subteam_1, zone_2, team_2, warzone_id, war) => {
  try {
    const response = await apiClient.post('/attack', {
      zone_1,
      team_1,
      subteam_1,
      zone_2,
      team_2,
      warzone_id,
      war,
    });

    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error making attack request",
    };
  }
};

export const get_all_attacks = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error fetching all attacks",
    };
  }
};


export const get_attacks_by_war = async (war) => {
  try {
    const response = await apiClient.get(`/wars/${war}`);

    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error getting attacks by war",
    };
  }
};

export const set_attack_result = async (attack_id, result) => {
  try {
    const response = await apiClient.post('/set_result', {
      attack_id,
      winnerTeam: result,
    });

    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error setting attack result",
    };
  }
}

export const delete_attack = async (attack_id) => {
  try {
    const response = await apiClient.delete('/', {
      data: { attack_id } // Ensures the attack_id is sent in the request body
    });
    
    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error deleting attack",
    };
  }
}

export const get_attack_expiry_time = async (attack_id) => {

  try {
    const response = await apiClient.get(`/expiry/${attack_id}`);

    return response.data;
  } catch (error) {
    return {
      errorMsg: error.response?.data || "API: Error getting attack expiry time",
    };
  }
}