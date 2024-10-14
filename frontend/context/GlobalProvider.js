import React, { createContext, useState, useReducer, useEffect } from "react";
import io from "socket.io-client";
import { logout } from "../api/user_functions";
import config from "../api/config";

export const GlobalContext = createContext();

const initialState = {
  name: "",
  teamNo: "",
  isLoggedIn: false,
  userMode: "",
  subteam: "",
  adminType: "",
  expoPushToken: "",
  currentAttack: null,
  currentDefence: [],
  socket: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_TEAM_NO":
      return { ...state, teamNo: action.payload };
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload };
    case "SET_USER_MODE":
      return { ...state, userMode: action.payload };
    case "SET_SUBTEAM":
      return { ...state, subteam: action.payload };
    case "SET_EXPO_PUSH_TOKEN":
      return { ...state, expoPushToken: action.payload };
    case "SET_CURRENT_ATTACK":
      return { ...state, currentAttack: action.payload };
    case "SET_CURRENT_DEFENCE":
      return { ...state, currentDefence: action.payload };
    case "SET_ADMIN_TYPE":
      return { ...state, adminType: action.payload };
    case "ADD_CURRENT_DEFENCE":
      return {
        ...state,
        currentDefence: [...state.currentDefence, action.payload],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [globalState, globalDispatch] = useReducer(reducer, initialState);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(config.serverIP);

    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => {
      if (newSocket) newSocket.disconnect();
      if (socket) socket.disconnect();
    };
  }, []);

  const Logout = async () => {
    try {
      globalDispatch({ type: "RESET" });
      await logout();
    } catch (error) {
      console.log("Error logging out\n", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        socket,
        globalDispatch,
        Logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
