import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import DottedLine from "../../components/DottedLine";

import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/attack_functions";
import { router } from "expo-router";

import { useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import countries from "../../constants/countries";
import BackButton from "../../components/BackButton";

import CountryConnections from "../../constants/country_connections";

const Home = () => {
  const [zones, setZones] = useState([]);
  const [countryMappings, setCountryMappings] = useState([]);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setZones(countries);

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
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const { Logout } = useContext(GlobalContext);

  const logoutFunc = () => {
    Logout();
    router.replace("/")
  }

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

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView>
        <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-between">
          <BackButton style="w-[20vw] mb-4" color="white" size={32} onPress={() => logoutFunc()} />
          {/* <Text className="text-white text-center text-2xl p-3">
              World Map
            </Text> */}
          <MapView
            className="flex-1"
            initialRegion={{
              latitude: 30.357810872761366,
              longitude: 30.392057112613095,
              latitudeDelta: 100,
              longitudeDelta: 180,
            }}
            mapType="satellite"
            // mapType="terrain"
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {zones.map((zone, index) => (
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
                thickness={1.5}
                // dashLength={25}
                dashGap={2}
              />
            ))}
          </MapView>

          {error && (
            <Text className="text-white text-center p-2 text-xl">{error}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
