import React, { useState, useEffect, useContext } from "react";
import { View, Text, Alert, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import DottedLine from "../../components/DottedLine";

import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/attack_functions";
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
  const [isRefreshing, setIsRefreshing] = useState(true); // Add isRefreshing state
  const insets = useSafeAreaInsets();
  const { name, teamNo, subteam } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setZones(countries);
    console.log("Fetching data");

    try {
      const result = await get_country_mappings();
      setCountryMappings(result);

      const attacksResult = await get_all_attacks();
      setAttacks(attacksResult);
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

  const { Logout } = useContext(GlobalContext);

  const logoutFunc = () => {
    Logout();
    router.replace("/");
  };

  const onMarkerPress = (zone) => {
    try {
      const country = countryMappings.find((c) => c.name === zone.name);
      const team = country
        ? teams.find((t) => t.number === country.teamNo)
        : null;
      const attack = attacks.find((a) => a.defending_zone === zone.name);

      Alert.alert(
        zone.name,
        `Owned by: Team ${team.number}\n${
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
        <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-between">
          <BackButton
            style="w-[20vw]"
            size={32}
            onPress={() => logoutFunc()}
          />
          <Text className="font-montez text-center text-5xl m-4 pt-2">
            {name}, Team {teamNo}
            {subteam}
          </Text>
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
              {zones.map((zone) => (
                <MapZone
                  key={zone.name}
                  points={zone.points}
                  color={getTeamColor(zone.name)}
                  label={zone.name}
                  onMarkerPress={() => onMarkerPress(zone)}
                />
              ))}

              {CountryConnections.map((points, index) => (
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

          {error && (
            <Text className="text-white text-center p-2 text-xl">{error}</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;
