import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { get_all_teams } from "../../../api/team_functions";
import { get_country_mappings } from "../../../api/country_functions";

import { GlobalContext } from "../../../context/GlobalProvider";

import BackButton from "../../../components/BackButton";
import Loader from "../../../components/Loader";
import CustomButton from "../../../components/CustomButton";

import { Logout } from "../../../helpers/AuthHelpers";

const Teams = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState(null); // State to track the expanded team

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    try {
      const result = await get_all_teams();
      const countriesR = await get_country_mappings();

      globalDispatch({ type: "SET_COUNTRIES", payload: countriesR });

      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result)) {
        globalDispatch({ type: "SET_TEAMS", payload: result });
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleExpandTeam = (teamNumber) => {
    setExpandedTeam((prev) => (prev === teamNumber ? null : teamNumber));
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
          className="p-4 my-2 rounded-md flex flex-row"
          style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
        >
          <View className="flex flex-col justify-start w-[70%]">
            <Text className="text-4xl font-montez">{item.name}</Text>
            <Text className="text-xl font-pregular">Team {item.number}</Text>
            <Text className="text-[16px] font-pregular">
              Running Money: {item.balance}
            </Text>
            <Text className="text-[16px] font-pregular">
              Countries Owned: {ownedCountries.length}
            </Text>

            {/* Conditional rendering of countries */}
            {expandedTeam === item.number && (
              <View className="mt-2">
                {ownedCountries.map((country, index) => (
                  <Text key={index} className="text-l font-pmedium">
                    {country.name}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View className="flex flex-col justify-start w-[30%]">
            <CustomButton
              title="Edit"
              handlePress={() =>
                router.push(
                  `/dashboard/teams/edit?teamNo=${item.number}&teamName=${item.name}&teamBalance=${item.balance}`
                )
              }
              containerStyles="mt-2"
              textStyles="text-xl font-pregular"
            />
            <CustomButton
              title={
                expandedTeam === item.number
                  ? "Hide Countries"
                  : "Show Countries"
              }
              containerStyles="p-4 rounded-md mt-2"
              handlePress={() => toggleExpandTeam(item.number)}
              textStyles={"text-[14px] font-pregular"}
            />
          </View>
        </View>
      );
    });
  };

  const logoutFunc = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?\nYou won't be able to log back in without your username and password.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            Logout(globalDispatch);
            router.replace("/");
          },
        },
      ]
    );
  };

  if (isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
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
        {
          globalState.userMode === "admin" && (
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => {
                logoutFunc();
              }}
            />
          )
        }

        <Text className="text-6xl text-center font-montez py-2 mt-7">
          Teams
        </Text>

        <View className="flex flex-row justify-between">
          {
            globalState.userMode === "super_admin" && (
              <CustomButton
                title="View Subteams"
                handlePress={() => router.navigate("/dashboard/teams/subteams")}
                containerStyles="w-[45%] my-2 p-3"
                textStyles={"text-2xl"}
              />
            )
          }

        </View>

        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {error}
          </Text>
        ) : (
          renderTeams()
        )}
      </View>
    </ScrollView>
  );
};

export default Teams;
