import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get_all_teams } from "../../api/team_functions";
import { get_country_mappings } from "../../api/country_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [countries, setCountries] = useState([]);
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

  const renderTeams = () => {

    if (!Array.isArray(teams)) {
      return (
        <Text className="text-center">
          No teams available or unexpected data format.
        </Text>
      );
    }
    return teams.map((item, index) => (
      <View
        key={index}
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex flex-col ">
          <Text className="text-4xl font-montez">{item.name}</Text>
          <Text className="text-2xl font-montez">Team Number: {item.number}</Text>
          <Text className="text-2xl font-montez">Running Money: {item.balance}</Text>
          <Text className="text-2xl font-montez">
            Countries Owned:{" "}
            {Array.isArray(countries) && countries.filter((country) => country.teamNo === item.number).length}
          </Text>
        </View>

        <CustomButton
          title="Edit"
          handlePress={() =>
            router.navigate(
              `/edit_team?teamNo=${item.number}&teamName=${item.name}&teamBalance=${item.balance}`
            )
          }
          containerStyles="w-1/4 h-2/3 mt-2 "
          textStyles="text-2xl"
        />
      </View>
    ));
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
      className="bg-black flex-1"
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
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
      </ImageBackground>
    </View>
  );
};

export default Teams;
