import axios from "axios";

import config from "./config";

const serverIP = config.serverIP + "/countries";

export const get_country_mappings = async () => {
  try {
    const response = await axios.get(`${serverIP}`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching countries" };
  }
};

export const get_countries_by_team = async (teamNo) => {
  try {
    const response = await axios.get(`${serverIP}/:${teamNo}`);
    return response.data;
  } catch (error) {
    return {
      errorMsg:
        error.response?.data || `Error fetching countries for team ${teamNo}`,
    };
  }
};

export const update_country = async (name, teamNo) => {
  try {
    const response = await axios.post(`${config.serverIP}/:${name}`, {
      teamNo,
    });

    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "API: Error updating country" };
  }
};


