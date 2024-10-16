import { useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

import { get_all_attacks } from "../api/attack_functions";
import { get_all_teams } from "../api/team_functions";
import { get_country_mappings } from "../api/country_functions";
import { get_admins } from "../api/admin_functions";
import { get_settings } from "../api/settings_functions";
import { get_all_subteams } from "../api/team_functions";
import { get_warzones } from "../api/warzone_functions";

const GlobalInitializer = () => {
    const { globalDispatch } = useContext(GlobalContext);

    useEffect(() => {
        const fetchAttacks = async () => {
            try {
                let response = await get_all_attacks();
                globalDispatch({ type: "SET_ATTACKS", payload: response });
            } catch (error) {
                console.error("Failed to fetch attacks:", error);
            }
        };

        const fetchTeams = async () => {
            try {
                let response = await get_all_teams();
                globalDispatch({ type: "SET_TEAMS", payload: response });
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        };

        const fetchCountries = async () => {
            try {
                let response = await get_country_mappings();
                globalDispatch({ type: "SET_COUNTRIES", payload: response });
            } catch (error) {
                console.error("Failed to fetch countries:", error);
            }
        };

        const fetchAdmins = async () => {
            try {
                let response = await get_admins();
                globalDispatch({ type: "SET_ADMINS", payload: response.admins });
            } catch (error) {
                console.error("Failed to fetch admins:", error);
            }
        };

        const fetchSettings = async () => {
            try {
                let response = await get_settings();
                globalDispatch({ type: "SET_SETTINGS", payload: response });
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        const fetchSubteams = async () => {
            try {
                let response = await get_all_subteams();
                globalDispatch({ type: "SET_SUBTEAMS", payload: response });
            } catch (error) {
                console.error("Failed to fetch subteams:", error);
            }
        };

        const fetchWarzones = async () => {
            try {
                let response = await get_warzones();
                globalDispatch({ type: "SET_WARZONES", payload: response });
            } catch (error) {
                console.error("Failed to fetch warzones:", error);
            }
        };

        fetchWarzones();
        fetchSubteams();
        fetchSettings();
        fetchAdmins();
        fetchCountries();
        fetchTeams();
        fetchAttacks();
    }, [globalDispatch]);

    return null;
};

export default GlobalInitializer;
