import { useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { update_country } from './../api/country_functions';

const SocketListener = () => {
    const { globalState, globalDispatch, socket } = useContext(GlobalContext);

    useEffect(() => {

        if (!socket) return;

        socket.on("new_attack", (newAttack) => {
            globalDispatch({ type: "ADD_ATTACK ", payload: newAttack })
        });

        socket.on("remove_attack", (attackId) => {
            globalDispatch({ type: "REMOVE_ATTACK", payload: attackId })
        });

        socket.on("update_team", (updatedTeam) => {
            globalDispatch({ type: "UPDATE_TEAM", payload: updatedTeam })
        });

        socket.on("update_country", (updatedCountry) => {
            globalDispatch({ type: "UPDATE_COUNTRY", payload: updatedCountry })
        });

        socket.on("add_admin", (newAdmin) => {
            globalDispatch({ type: "ADD_ADMIN", payload: newAdmin })
        });

        socket.on("remove_admin", (adminId) => {
            globalDispatch({ type: "REMOVE_ADMIN", payload: adminId })
        });

        socket.on("update_admin", (updatedAdmin) => {
            globalDispatch({ type: "UPDATE_ADMIN", payload: updatedAdmin })
        });

        socket.on("update_setting", (updatedSetting) => {
            globalDispatch({ type: "UPDATE_SETTING", payload: updatedSetting })
        });

        socket.on("update_subteam", (updatedSubteam) => {
            globalDispatch({ type: "UPDATE_SUBTEAM", payload: updatedSubteam })
        });

        socket.on("new_warzone", (newWarzone) => {
            globalDispatch({ type: "ADD_WARZONE", payload: newWarzone })
        });

        socket.on("remove_warzone", (warzoneId) => {
            globalDispatch({ type: "REMOVE_WARZONE", payload: warzoneId })
        });

        socket.on("update_warzone", (updatedWarzone) => {
            globalDispatch({ type: "UPDATE_WARZONE", payload: updatedWarzone })
        });

        socket.on("new_game", () => {

        });

        // Clean up socket listeners on unmount
        return () => {
            socket.off("new_attack");
            socket.off("remove_attack");
            socket.off("new_game");
        };
    }, [globalState, globalDispatch]);

    return null; // No UI rendering
};

export default SocketListener;
