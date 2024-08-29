import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import _ from "lodash";

import { images } from "../../constants";
import countries from "../../constants/countries";
import CountryConnections from "../../constants/country_connections";

import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";
import DottedLine from "../../components/DottedLine";
import MapZone from "../../components/MapZone";

import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/attack_functions";
import { deletePushToken } from "../../api/user_functions";

import { GlobalContext } from "../../context/GlobalProvider";

import { useFocusEffect } from "@react-navigation/native";

import config from "../../api/config";
import io from "socket.io-client";
const socket = io(config.serverIP); // Replace with your server URL

const Home = () => {
  const [zones, setZones] = useState([]);
  const [countryMappings, setCountryMappings] = useState([]);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const insets = useSafeAreaInsets();
  const {
    name,
    teamNo,
    subteam,
    Logout,
    expoPushToken,
    currentAttack,
    setCurrentAttack,
    currentDefence,
    setCurrentDefence,
  } = useContext(GlobalContext); // Access currentAttack, currentDefence, setCurrentAttack, and setCurrentDefence

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
  
      // Check for defenses
      const matchingDefenses = attacksResult.filter(
        (attack) => attack.defending_team === teamNo
      );

      if (matchingDefenses.length === 0 && currentDefence.length > 0) {
        setCurrentDefence([]);
      }

      // Only update if the attack has changed
      if (!_.isEqual(matchingAttack, currentAttack)) {
        console.log('Attack has changed');
        setCurrentAttack(matchingAttack); // Update currentAttack in GlobalContext
      } else {
        console.log('Attack has not changed');
      }
  
      // Only update if the defenses have changed
      if (!_.isEqual(matchingDefenses, currentDefence)) {
        console.log('Defenses have changed');
        setCurrentDefence(matchingDefenses); // Update currentDefence in GlobalContext
      } else {
        console.log('Defenses have not changed');
      }
    } catch (err) {
      console.log(err);
      setError('Failed to fetch country mappings');
    }
  
    try {
      const teamsResult = await get_all_teams();
      setTeams(teamsResult);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch teams data');
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch initial data
  
      // Set up socket listeners for real-time updates
      socket.on("update_country", (updatedCountryMapping) => {
        setCountryMappings((prevMappings) =>
          prevMappings.map((mapping) =>
            mapping.name === updatedCountryMapping.name ? updatedCountryMapping : mapping
          )
        );
      });
  
      socket.on("update_team", (updatedTeam) => {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.number === updatedTeam.number ? updatedTeam : team
          )
        );
      });
  
      socket.on("new_attack", (newAttack) => {
        if (newAttack.defending_team === teamNo.toString()) {
          setCurrentDefence((prevDefences) => [...prevDefences, newAttack]);
        }
      });
  
      socket.on("remove_attack", (attackId) => {
        setCurrentDefence((prevDefences) =>
          prevDefences.filter((attack) => attack._id !== attackId)
        );
      });

      socket.on("new_game", () => {
        Alert.alert(
          "New Game",
          "A new game has started. You will be logged out automatically."
        );
      
        setTimeout(async () => {
          deletePushToken(expoPushToken, teamNo);
          router.replace("/");
        }, 3000);
      });
      
      
  
      return () => {
        socket.off("update_country");
        socket.off("update_team");
        socket.off("new_attack");
        socket.off("remove_attack");
        socket.off("new_game");
      };
    }, [teamNo])
  );

  useEffect(() => {
    fetchData();
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
        >
          <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-between">
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => logoutFunc()}
            />

            <View className="flex flex-row pt-2 justify-center gap-0">
              <Text className="font-montez text-center text-5xl my-4 mt-0 pt-2">
                {name}, Team {teamNo}
              </Text>
              <Text className="text-center text-5xl m-4 mt-0 pt-2 font-pextralight">
                {subteam}
              </Text>
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
                provider= { Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
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
