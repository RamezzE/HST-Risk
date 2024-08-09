import axios from "axios";

import config from "./config";

export const get_country_mappings = async () => {
  try {
    const response = await axios.get(`${config.serverIP}/countries`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching countries" };
  }
};

export const get_countries_by_team = async (teamNo) => {
  try {
    const response = await axios.get(`${config.serverIP}/countries`);
    const countries = response.data;
    const filteredZones = countries.filter((country) => country.teamNo === teamNo);
    return filteredZones;
  } catch (error) {
    return { errorMsg: error.response?.data || `Error fetching contries for team ${teamNo}` };
  }
};




export const get_warzones = async () => {
  try {
    const response = await axios.get(`${config.serverIP}/warzones`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching warzones" };
  }
};
