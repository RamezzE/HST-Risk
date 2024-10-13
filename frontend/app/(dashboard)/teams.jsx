import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { get_all_teams } from "../../api/team_functions";
import { get_country_mappings } from "../../api/country_functions";
import Loader from "../../components/Loader";

import { GlobalContext } from "../../context/GlobalProvider";
import PageWrapper from "../../components/PageWrapper";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [countries, setCountries] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null); // State to track the expanded team

  const { socket } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_all_teams();
      const countriesR = await get_country_mappings();
      setCountries(countriesR);

      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result)) {
        setTeams(result);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();

      socket.on("update_team", (updatedTeam) => {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.number === updatedTeam.number ? updatedTeam : team
          )
        );
      });

      socket.on("update_country", (updatedCountry) => {
        setCountries((prevCountries) =>
          prevCountries.map((country) =>
            country.name === updatedCountry.name ? updatedCountry : country
          )
        );
      });

      return () => {
        socket.off("update_team");
        socket.off("update_country");
      };
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpandTeam = (teamNumber) => {
    setExpandedTeam((prev) => (prev === teamNumber ? null : teamNumber));
  };

  const renderTeams = () => {
    if (!Array.isArray(teams)) {
      return (
        <Text className="text-center">
          No teams available or unexpected data format.
        </Text>
      );
    }

    return teams.map((item, index) => {
      const ownedCountries = countries.filter(
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
                  `/edit_team?teamNo=${item.number}&teamName=${item.name}&teamBalance=${item.balance}`
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

  if (isRefreshing) {
    return (
      <PageWrapper>
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchData}
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

          <View className="flex flex-row justify-between">
            <CustomButton
              title="View Subteams"
              handlePress={() => router.navigate("/subteams")}
              containerStyles="w-[45%] my-2 p-3"
              textStyles={"text-2xl"}
            />
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
    </PageWrapper>
  );
};

export default Teams;
