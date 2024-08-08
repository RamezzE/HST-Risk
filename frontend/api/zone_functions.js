import axios from "axios";

import config from './config';

export const get_zones = async () => {
  try {
    const response = await axios.get(`${config.serverIP}/zones`);
    return response.data;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching zones" };
  }
};

export const get_zones_by_team = async (team_no) => {
  try {
    const response = await axios.get(`${config.serverIP}/zones`);
    const zones = response.data;
    const filteredZones = zones.filter(zone => zone.team_no === team_no);
    return filteredZones;
  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching zones" };
  }
};