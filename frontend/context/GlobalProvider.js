import { createContext, useState, useReducer, useEffect } from "react";
import io from "socket.io-client";
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
  attacks: [],
  teams: [],
  countries: [],
  admins: [],
  settings: [],
  subteams: [],
  warzones: [],
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
    case "SET_ADMIN_TYPE":
      return { ...state, adminType: action.payload };
    case "SET_ATTACKS":
      return { ...state, attacks: action.payload };
    case "ADD_ATTACK":
      return {
        ...state,
        attacks: [...state.attacks, action.payload],
        currentDefence:
          action.payload.defending_team.toString() === state.teamNo.toString()
            ? [...(state.currentDefence || []), action.payload]
            : state.currentDefence,
        currentAttack:
          action.payload.attacking_team.toString() ===
            state.teamNo.toString() &&
          action.payload.attacking_subteam.toString() ===
            state.subteam.toString()
            ? action.payload
            : state.currentAttack,
      };
    case "REMOVE_ATTACK":
      return {
        ...state,
        attacks: state.attacks.filter(
          (attack) => attack._id !== action.payload
        ),
        currentDefence: state.currentDefence
          ? state.currentDefence.filter(
              (attack) => attack._id !== action.payload
            )
          : [],
        currentAttack:
          state.currentAttack && state.currentAttack._id === action.payload
            ? null
            : state.currentAttack,
      };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "UPDATE_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.number === action.payload.number ? action.payload : team
        ),
      };
    case "SET_COUNTRIES":
      return { ...state, countries: action.payload };
    case "UPDATE_COUNTRY":
      return {
        ...state,
        countries: state.countries.map((country) =>
          country._id === action.payload._id ? action.payload : country
        ),
      };
    case "SET_ADMINS":
      return { ...state, admins: action.payload };
    case "ADD_ADMIN":
      return { ...state, admins: [...state.admins, action.payload] };
    case "REMOVE_ADMIN":
      return {
        ...state,
        admins: state.admins.filter((admin) => admin.name !== action.payload),
      };
    case "UPDATE_ADMIN":
      return {
        ...state,
        admins: state.admins.map((admin) =>
          admin._id === action.payload._id ? action.payload : admin
        ),
      };
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "UPDATE_SETTING":
      return {
        ...state,
        settings: state.settings.map((setting) =>
          setting._id === action.payload._id ? action.payload : setting
        ),
      };
    case "SET_SUBTEAMS":
      return { ...state, subteams: action.payload };
    case "UPDATE_SUBTEAM":
      return {
        ...state,
        subteams: state.subteams.map((subteam) =>
          subteam._id === action.payload._id ? action.payload : subteam
        ),
      };
    case "SET_WARZONES":
      return { ...state, warzones: action.payload };
    case "ADD_WARZONE":
      return { ...state, warzones: [...state.warzones, action.payload] };
    case "UPDATE_WARZONE":
      return {
        ...state,
        warzones: state.warzones.map((warzone) =>
          warzone._id === action.payload._id ? action.payload : warzone
        ),
      };
    case "REMOVE_WARZONE":
      return {
        ...state,
        warzones: state.warzones.filter(
          (warzone) => warzone._id !== action.payload
        ),
      };
    case "UPDATE_POPUP_ATTACKS":
      return {
        ...state,
        currentDefence: state.attacks.filter(
          (attack) =>
            attack.defending_team.toString() === state.teamNo.toString()
        ),
        currentAttack: state.attacks.find(
          (attack) =>
            attack.attacking_team.toString() === state.teamNo.toString() &&
            attack.attacking_subteam.toString() === state.subteam.toString()
        ),
      };
    case "RESET":
      return {
        ...state,
        name: "",
        teamNo: "",
        isLoggedIn: false,
        userMode: "",
        subteam: "",
        adminType: "",
        currentAttack: null,
        currentDefence: [],
      };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [globalState, globalDispatch] = useReducer(reducer, initialState);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(config.serverIP);

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        socket,
        globalDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
