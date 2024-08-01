import axios from "axios";

const API_BASE_URL = "http://192.168.1.110:8000";

export const login = async (teamNo, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      teamNo,
      password,
    });

    return response.data;

  } catch (error) {
    return { errorMsg: error.response?.data || "Error logging in4" };
  }
};

export const add_team = async (teamNo, teamName, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add_team`, {
      teamNo,
      teamName,
      password,
    });

    return response.data;

  } catch (error) {
    return { errorMsg: error.response?.data || "Error Adding Team" };
  }
};

export const get_all_teams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all_teams`);
    console.log(response.data)
    return response.data;

  } catch (error) {
    return { errorMsg: error.response?.data || "Error fetching teams" };
  }
};

// export const getCurrentUser = async (token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/current-user`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Error fetching current user");
//   }
// };
