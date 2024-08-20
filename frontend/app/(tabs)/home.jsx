import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import DottedLine from "../../components/DottedLine";
import Timer from "../../components/Timer"; // Assuming you have a Timer component

import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/attack_functions";
import { deletePushToken } from "../../api/user_functions";
import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

import countries from "../../constants/countries";
import BackButton from "../../components/BackButton";

import CountryConnections from "../../constants/country_connections";
import { images } from "../../constants";

import Loader from "../../components/Loader";

const Home = () => {
  const [zones, setZones] = useState([]);
  const [countryMappings, setCountryMappings] = useState([]);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentAttack, setCurrentAttack] = useState(null); // To store the matching attack

  const insets = useSafeAreaInsets();
  const { name, teamNo, subteam, Logout, expoPushToken } =
    useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setZones(countries);

    try {
      const result = await get_country_mappings();
      setCountryMappings(result);

      const attacksResult = await get_all_attacks();
      setAttacks(attacksResult);

      // Check for matching attack
      const matchingAttack = attacksResult.find(
        (attack) =>
          attack.attacking_team === teamNo &&
          attack.attacking_subteam === subteam
      );

      setCurrentAttack(matchingAttack);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch country mappings");
    }

    try {
      const teamsResult = await get_all_teams();
      setTeams(teamsResult);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch teams data");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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
          onPress: async () => {
            deletePushToken(expoPushToken, teamNo);
            Logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const onMarkerPress = (zone) => {
    try {
      const country = Array.isArray(countryMappings)
        ? countryMappings.find((c) => c.name === zone.name)
        : null;

      const team =
        country && Array.isArray(teams)
          ? teams.find((t) => t.number === country.teamNo)
          : null;

      const attack = Array.isArray(attacks)
        ? attacks.find((a) => a.defending_zone === zone.name)
        : null;

      Alert.alert(
        zone.name,
        `Owned by: Team ${team ? team.number : "Unknown"}\n${
          attack
            ? `Under attack by: Team ${attack.attacking_team}`
            : "Not under attack"
        }`
      );
    } catch (error) {}
  };

  const getTeamColor = (countryName) => {
    try {
      const country = countryMappings.find((c) => c.name === countryName);
      const team = country
        ? teams.find((t) => t.number === country.teamNo)
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
        {Array.isArray(teams) &&
          teams.map((team, index) => (
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

  if (isRefreshing) {
    return (
      <View
        className="flex-1 bg-black"
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
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
      className="flex-1 bg-black"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchData();
              }}
            />
          }
        >
          <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-between">
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => logoutFunc()}
            />

            <View className="flex flex-row justify-center gap-0">
              <Text className="font-montez text-center text-5xl my-4 mt-0 pt-2">
                {name}, Team {teamNo}
              </Text>
              <Text className="text-center text-5xl m-4 mt-0 pt-2 font-pextralight">
                {subteam}
              </Text>
            </View>
            <View>
              {currentAttack && (
                <View className="mb-4 flex flex-row justify-center">
                  <Timer attack_id={currentAttack._id} 
                  textStyles={"font-pbold text-red-800 text-2xl"}/>
                </View>
              )}
            </View>
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
                mapType="satellite"
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {Array.isArray(zones) &&
                  zones.map((zone) => (
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

            {error && (
              <Text className="text-white text-center p-2 text-xl">
                {error}
              </Text>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Home;
