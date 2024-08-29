import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get_all_teams } from "../../api/team_functions";
import { get_country_mappings } from "../../api/country_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";
import CustomButton from "../../components/CustomButton";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [countries, setCountries] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null); // State to track the expanded team
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpandTeam = (teamNumber) => {
    setExpandedTeam((prev) =>
      prev === teamNumber ? null : teamNumber
    );
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
          className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
          style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
        >
          <View className="flex flex-col justify-between">
            <View className="flex flex-row justify-between w-full">
            <Text className="text-4xl font-montez">{item.name}</Text>
            <Text className="text-2xl font-montez">Team Number: {item.number}</Text>
            </View>
            <Text className="text-[16px] font-pregular">Running Money: {item.balance}</Text>
            <Text className="text-[16px] font-pregular">
              Countries Owned: {ownedCountries.length}
            </Text>

            {/* Button to toggle country names */}

            <CustomButton 
              title= {expandedTeam === item.number ? "Hide Countries" : "Show Countries"}
              containerStyles="p-2 rounded-md mt-2 w-[50%] ml-auto"
              handlePress={() => toggleExpandTeam(item.number)}
              textStyles={"text-[12px] font-pregular"}
            />

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
        </View>
      );
    });
  };

  if (isRefreshing) {
    return (
      <View
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        }}
        className="flex-1 bg-black"
      >
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Loader />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
      className="bg-black h-full"
    >
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchData}
              tintColor="#000"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="w-full justify-start p-4 mb-24">
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Teams
            </Text>

            {error ? (
              <Text style={{ color: "black", textAlign: "center" }}>
                {error}
              </Text>
            ) : (
              renderTeams()
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Teams;
