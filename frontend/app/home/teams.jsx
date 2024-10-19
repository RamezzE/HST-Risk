import React, { useReducer, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { get_all_teams } from "../../api/team_functions";
import { get_country_mappings } from "../../api/country_functions";
import Loader from "../../components/Loader";
import CustomButton from "../../components/CustomButton";

import { GlobalContext } from "../../context/GlobalProvider";

const initialState = {
  error: null,
  isRefreshing: false,
  expandedTeam: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    case "SET_EXPANDED_TEAM":
      return { ...state, expandedTeam: action.payload(state.expandedTeam) };

    default:
      return state;
  }
}

const Teams = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    dispatch({ type: "SET_ERROR", payload: null })
    try {
      const result = await get_all_teams();
      const countriesR = await get_country_mappings();
      dispatch({ type: "SET_COUNTRIES", payload: countriesR })

      if (result.success === false)
        dispatch({ type: "SET_ERROR", payload: result.errorMsg })
      else if (Array.isArray(result))
        globalDispatch({ type: "SET_TEAMS", payload: result })
      else
        dispatch({ type: "SET_ERROR", payload: "Unexpected Response Format" })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch teams" })
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false })
    }
  };

  const toggleExpandTeam = (teamNumber) => {
    dispatch({
      type: "SET_EXPANDED_TEAM",
      payload: (prevExpandedTeam) => (prevExpandedTeam === teamNumber ? null : teamNumber),
    });
  };

  const renderTeams = () => {
    if (!Array.isArray(globalState.teams)) {
      return (
        <Text className="text-center">
          No teams available or unexpected data format.
        </Text>
      );
    }

    return globalState.teams.map((item, index) => {
      const ownedCountries = globalState.countries.filter(
        (country) => country.teamNo === item.number
      );

      return (
        <View
          key={index}
          className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
          style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
        >
          <View className="flex flex-col justify-between">
            <View className="flex flex-row justify-between w-full">
              <Text className="text-4xl font-montez">{item.name}</Text>
              <Text className="text-2xl font-montez">
                Team Number: {item.number}
              </Text>
            </View>
            <Text className="text-[16px] font-pregular">
              Running Money: {item.balance}
            </Text>
            <Text className="text-[16px] font-pregular">
              Countries Owned: {ownedCountries.length}
            </Text>

            {/* Button to toggle country names */}

            <CustomButton
              title={
                state.expandedTeam === item.number
                  ? "Hide Countries"
                  : "Show Countries"
              }
              containerStyles="p-2 rounded-md mt-2 w-[50%] ml-auto"
              handlePress={() => toggleExpandTeam(item.number)}
              textStyles={"text-[12px] font-pregular"}
            />

            {/* Conditional rendering of countries */}
            {state.expandedTeam === item.number && (
              <View className="mt-2">
                {ownedCountries.map((country, index) => (
                  <Text key={index} className="text-l font-pmedium">
                    {country.name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      );
    });
  };

  if (state.isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={() => {
            dispatch({ type: "SET_IS_REFRESHING", payload: true });
            fetchData();
          }}
          tintColor="#000"
        />
      }
      bounces={false}
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="w-full justify-start p-4 mb-24">
        <Text className="text-6xl text-center font-montez py-2 mt-7">
          Teams
        </Text>

        {state.error ? (
          <Text style={{ color: "black", textAlign: "center" }}>
            {state.error}
          </Text>
        ) : (
          renderTeams()
        )}
      </View>
    </ScrollView>
  );
};

export default Teams;
