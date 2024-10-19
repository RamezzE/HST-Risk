import React, { useContext, useReducer, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import _ from "lodash";

import countries from "../../constants/countries";

import CountryConnections from "../../constants/country_connections";

import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";
import DottedLine from "../../components/DottedLine";
import MapZone from "../../components/MapZone";

import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/attack_functions";

import { GlobalContext } from "../../context/GlobalProvider";

import { Logout } from "../../helpers/AuthHelpers";

const initialState = {
  zones: [],
  error: null,
  isRefreshing: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ZONES":
      return { ...state, zones: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    default:
      return state;
  }
}

const Home = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  useEffect(() => {
    dispatch({ type: "SET_ZONES", payload: countries });
  }, [])


  const fetchData = async () => {
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const result = await get_country_mappings();
      dispatch({ type: "SET_COUNTRY_MAPPINGS", payload: result });
    } catch (err) {
      console.log(err);
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch country mappings" });
    }

    try {
      const attacksResult = await get_all_attacks();
      globalDispatch({ type: "SET_ATTACKS", payload: attacksResult });
    } catch (err) {
      console.log(err);
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch attacks data" });
    }

    try {
      const teamsResult = await get_all_teams();
      globalDispatch({ type: "SET_TEAMS", payload: teamsResult });
    } catch (err) {
      console.log(err);
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch teams data" });
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    }
  };

  const logoutFunc = () => {
    Alert.alert(
      "Logout",
      globalState.subteam === ""
        ? "Are you sure you want to logout? You won't be able to receive notifications if your team is being attacked."
        : "Are you sure you want to logout?\nYou won't be able to log back in without your username and password.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            Logout(globalDispatch, globalState.expoPushToken, globalState.teamNo);
             router.replace("/");
          },
        },
      ]
    );
  };

  const onMarkerPress = (zone) => {
    try {
      const country = Array.isArray(globalState.countries)
        ? globalState.countries.find((c) => c.name === zone.name)
        : null;

      const team =
        country && Array.isArray(globalState.teams)
          ? globalState.teams.find((t) => t.number === country.teamNo)
          : null;

      const attack = Array.isArray(globalState.attacks)
        ? globalState.attacks.find((a) => a.defending_zone === zone.name)
        : null;

      Alert.alert(
        zone.name,
        `Owned by Team ${team ? team.number : "Unknown"}\n${attack
          ? `Under attack by Team ${attack.attacking_team}${attack.attacking_subteam}`
          : "Not under attack"
        }`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamColor = (countryName) => {
    try {
      const country = globalState.countries.find((c) => c.name === countryName);
      const team = country
        ? globalState.teams.find((t) => t.number === country.teamNo)
        : null;
      return team ? team.color : "#000000";
    } catch (error) {
      return "#000000";
    }
  };

  const renderColorLegend = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          borderRadius: 5,
        }}
      >
        {Array.isArray(globalState.teams) &&
          globalState.teams.map((team, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: team.color,
                  marginRight: 10,
                  borderRadius: 5,
                }}
              />
              <Text style={{ color: "white", fontSize: 12 }}>
                Team {team.number}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  if (state.isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-between">
      <BackButton
        style="w-[20vw]"
        size={32}
        onPress={() => {
          if (globalState.name === "Guest") {
            router.navigate("/guest_choose_team");
          } else if (globalState.userMode === "super_admin") {
            router.navigate("/dashboard");
          } else {
            logoutFunc()
          }
        }}
      />

      {
        globalState.userMode !== "super_admin" ? (
          <View className="flex flex-row pt-2 justify-center gap-0">
            <Text className="font-montez text-center text-5xl my-4 mt-0 pt-2">
              {globalState.name}, Team {globalState.teamNo}
            </Text>
            <Text className="text-center text-5xl m-4 mt-0 pt-2 font-pextralight">
              {globalState.subteam}
            </Text>
          </View>
        ) :
        (
          <Text className="text-center font-pmedium text-base m-4 mt-0 pt-2">
            Ramez can be pretty cool right
          </Text>
        )
      }


      <View
        style={{
          flex: 1,
          borderWidth: 5,
          borderColor: "black",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: 30.357810872761366,
            longitude: 30.392057112613095,
            latitudeDelta: 100,
            longitudeDelta: 180,
          }}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          mapType="satellite"
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {Array.isArray(state.zones) &&
            state.zones.map((zone) => (
              <MapZone
                key={zone.name}
                points={zone.points}
                color={getTeamColor(zone.name)}
                label={zone.name}
                onMarkerPress={() => onMarkerPress(zone)}
              />
            ))}

          {Array.isArray(CountryConnections) &&
            CountryConnections.map((points, index) => (
              <DottedLine
                key={index}
                startPoint={points.point1}
                endPoint={points.point2}
                color="#FFF"
                thickness={3}
              />
            ))}
        </MapView>
      </View>

      {renderColorLegend()}

      {state.error && (
        <Text className="text-white text-center p-2 text-xl">
          {state.error}
        </Text>
      )}
    </View>
  );
};

export default Home;
