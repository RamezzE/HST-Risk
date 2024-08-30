import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get_all_teams } from "../../api/team_functions";
import { get_country_mappings } from "../../api/country_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";

import { GlobalContext } from "../../context/GlobalProvider";

import BackButton from "../../components/BackButton";


const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [countries, setCountries] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null); // State to track the expanded team
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { Logout, socket } = useContext(GlobalContext);

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
            country._id === updatedCountry._id ? updatedCountry : country
          )
        );
      });
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
              containerStyles="p-2 rounded-md mt-2"
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
            Logout();
            router.replace("/");
          },
        },
      ]
    );
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
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => {
                logoutFunc();
              }}
            />
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Teams
            </Text>

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
