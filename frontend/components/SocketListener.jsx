import { useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const SocketListener = () => {
  const { globalDispatch, socket } = useContext(GlobalContext);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_attack", (newAttack) => {
      globalDispatch({ type: "ADD_ATTACK", payload: newAttack });
    });

    socket.on("remove_attack", (attackId) => {
      globalDispatch({ type: "REMOVE_ATTACK", payload: attackId });
    });

    socket.on("update_team", (updatedTeam) => {
      globalDispatch({ type: "UPDATE_TEAM", payload: updatedTeam });
    });

    socket.on("update_country", (updatedCountry) => {
      globalDispatch({ type: "UPDATE_COUNTRY", payload: updatedCountry });
    });

    socket.on("add_admin", (newAdmin) => {
      globalDispatch({ type: "ADD_ADMIN", payload: newAdmin });
    });

    socket.on("delete_admin", (name) => {
      globalDispatch({ type: "REMOVE_ADMIN", payload: name });
    });

    socket.on("update_admin", (updatedAdmin) => {
      globalDispatch({ type: "UPDATE_ADMIN", payload: updatedAdmin });
    });

    socket.on("update_setting", (updatedSetting) => {
      globalDispatch({ type: "UPDATE_SETTING", payload: updatedSetting });
    });

    socket.on("update_subteam", (updatedSubteam) => {
      globalDispatch({ type: "UPDATE_SUBTEAM", payload: updatedSubteam });
    });

    socket.on("new_warzone", (newWarzone) => {
      globalDispatch({ type: "ADD_WARZONE", payload: newWarzone });
    });

    socket.on("delete_warzone", (warzoneId) => {
      globalDispatch({ type: "REMOVE_WARZONE", payload: warzoneId });
    });

    socket.on("update_warzone", (updatedWarzone) => {
      globalDispatch({ type: "UPDATE_WARZONE", payload: updatedWarzone });
    });

    socket.on("new_game", () => {
      // Handle new game
    });

    // Clean up socket listeners on unmount
    return () => {
        socket.off("new_attack");
        socket.off("remove_attack");
        socket.off("update_team");
        socket.off("update_country");
        socket.off("add_admin");
        socket.off("delete_admin");
        socket.off("update_admin");
        socket.off("update_setting");
        socket.off("update_subteam");
        socket.off("new_warzone");
        socket.off("delete_warzone");
        socket.off("update_warzone");
        socket.off("new_game");
    };
  }, [socket, globalDispatch]);

  return null; // No UI rendering
};

export default SocketListener;
