import { is_logged_in } from "../api/user_functions";
import { logout } from "../api/user_functions";
import { login, addPushToken } from "../api/user_functions";

export const isLoggedIn = async (globalState, globalDispatch) => {
  if (globalState.isLoggedIn) {
    if (globalState.userMode === "subteam") return { path: "/home" };

    if (globalState.userMode === "admin") {
      if (globalState.adminType === "Wars") return { path: "/admin_home" };

      return { path: "/dashboard/teams" };
    }
    if (globalState.userMode === "super_admin") return { path: "dashboard" };
  }

  const response = await is_logged_in();

  if (!response.success) return { path: "/sign_in" };

  if (response.subteam !== "") {
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
    globalDispatch({ type: "SET_NAME", payload: response.subteam.name });
    globalDispatch({ type: "SET_USER_MODE", payload: "subteam" });
    globalDispatch({ type: "SET_TEAM_NO", payload: response.subteam.number });
    globalDispatch({ type: "SET_SUBTEAM", payload: response.subteam.letter });

    return { path: "/home" };
  }

  if (response.admin !== "") {
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
    globalDispatch({ type: "SET_NAME", payload: response.admin.name });
    globalDispatch({ type: "SET_USER_MODE", payload: "admin" });

    if (response.admin.type === "Wars") return { path: "/admin_home" };

    return { path: "/dashboard/teams" };
  }

  if (response.superAdmin !== "") {
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
    globalDispatch({ type: "SET_NAME", payload: response.superAdmin.name });
    globalDispatch({ type: "SET_USER_MODE", payload: "super_admin" });

    return { path: "dashboard" };
  }
};

export const Login = async (username, password, globalState, globalDispatch) => {
  const response = await login(username.trim(), password.trim());

  if (!response.success) return response;

  if (response.subteam !== "") {
    globalDispatch({ type: "SET_TEAM_NO", payload: response.subteam.number });
    globalDispatch({ type: "SET_SUBTEAM", payload: response.subteam.letter });
    globalDispatch({ type: "SET_NAME", payload: response.subteam.name });
    globalDispatch({ type: "SET_USER_MODE", payload: "subteam" });

    await addPushToken(globalState.expoPushToken, response.subteam.number);
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
    return { path: "/home" };
  }

  if (response.admin !== "") {
    globalDispatch({ type: "SET_NAME", payload: username });
    globalDispatch({ type: "SET_USER_MODE", payload: "admin" });
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });

    if (response.admin.type === "Wars") return { path: "/admin_home" };

    return { path: "/dashboard/teams" };
  }

  if (response.superAdmin !== "") {
    globalDispatch({ type: "SET_USER_MODE", payload: "super_admin" });
    globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });

    return { path: "/dashboard" };
  }
};

export const Logout = async (globalDispatch) => {
  try {
    globalDispatch({ type: "RESET" });
    await logout();
  } catch (error) {
    console.log("Error logging out\n", error);
  }
};

