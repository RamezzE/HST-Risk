import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState, useContext, useCallback } from "react";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

import { images } from "../../constants";
import countries from "../../constants/countries";

import {
  get_countries_by_team,
  get_country_mappings,
} from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_settings } from "../../api/settings_functions";
import { attack_check, get_all_attacks } from "../../api/attack_functions";

import MapZone from "../../components/MapZone";
import CountryConnections from "../../constants/country_connections";
import DottedLine from "../../components/DottedLine";
import Loader from "../../components/Loader";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import { useFocusEffect } from "@react-navigation/native";

import config from "../../api/config";
import io from "socket.io-client";
const socket = io(config.serverIP); // Replace with your server URL

const Attack = () => {
  const { name, teamNo, subteam } = useContext(GlobalContext);

  const [countryMappings, setCountryMappings] = useState([]);
  const [initialArea, setInitialArea] = useState([30, 30]);
  const [zones, setZones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [myZones, setMyZones] = useState([]);
  const [otherZones, setOtherZones] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [attacks, setAttacks] = useState([]);
  const [attackCost, setAttackCost] = useState(0);
  const [balance, setBalance] = useState(0);

  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    teamNo: teamNo,
    your_zone: "",
    other_zone: "",
  });

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

  const changeMapPreview = (zone) => {
    if (!zone || zone === "Select Your Country" || zone === "Select Country to Attack") {
      return;
    }
  
    if (!Array.isArray(countries)) {
      return;
    }
  
    const country = countries.find((c) => c.name === zone);
  
    if (!country || !Array.isArray(country.points) || country.points.length === 0) {
      return;
    }
  
    const avgLat =
      country.points.reduce((acc, curr) => acc + curr.latitude, 0) /
      country.points.length;
    const avgLong =
      country.points.reduce((acc, curr) => acc + curr.longitude, 0) /
      country.points.length;
  
    setInitialArea([avgLat, avgLong]);
  };
  

  const validateAttack = (zone_1, zone_2) => {
    var result = {
      success: false,
      errorMsg: "",
    };

    if (!zone_1 || !zone_2) {
      result.errorMsg = "Please fill in all the fields";
      return result;
    }

    result.success = true;
    return result;
  };

  const selectYourZone = (zone) => {
    setForm({ ...form, your_zone: zone, other_zone: "" });
  
    if (!zone || zone === "") return;
  
    changeMapPreview(zone);
  
    if (!Array.isArray(countries)) return;
  
    const country = countries.find((c) => c.name === zone);
  
    if (!country || !Array.isArray(country.adjacent_zones)) return;
  
    setOtherZones(country.adjacent_zones);
  };
  
  const selectOtherZone = (zone) => {
    setForm({ ...form, other_zone: zone });
  
    if (!zone || zone === "") return;
  
    changeMapPreview(zone);
  };  

  const fetchData = async () => {
    setError(null);

    console.log("Fetching data");

    try {
      const result = await get_country_mappings();
      setCountryMappings(result);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch country mappings");
    }

    try {
      const result1 = await get_countries_by_team(parseInt(teamNo));
      setMyZones(result1.countries);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch your team's countries");
    }

    try {
      const attacksResult = await get_all_attacks();
      setAttacks(attacksResult);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch attacks data");
    }

    try {
      const settingsResult = await get_settings();
      const attackCost = settingsResult.find(
        (setting) => setting.name === "Attack Cost"
      );
      setAttackCost(attackCost.value);
    }
    catch (err) {
      console.log(err);
      setError("Failed to fetch settings data");
    }

    try {
      const teamsResult = await get_all_teams();
      setTeams(teamsResult);

      const team = teamsResult.find((t) => t.number === parseInt(teamNo));
      setBalance(team.balance);

    } catch (err) {
      console.log(err);
      setError("Failed to fetch teams data");
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
    }, [teamNo, subteam])
  );

  useEffect(() => {
    setZones(countries);

    fetchData();

  }, []);

  const attack_func = async (zone_1, team_1, zone_2) => {
    setIsSubmitting(true);
    try {
      var result = validateAttack(form.your_zone, form.other_zone);

      // setForm({ ...form, your_zone: "", other_zone: "" });
      // setOtherZones([]);

      if (!result.success) {
        Alert.alert("Attack Failed", result.errorMsg);
        fetchData();
        return;
      }

      team_2 = parseInt(countryMappings.find((c) => c.name === zone_2).teamNo);

      console.log("Attacking", zone_1, team_1);
      console.log("Defending: ", zone_2, team_2);

      const response = await attack_check(zone_1, team_1, subteam, zone_2, team_2);

      if (!response.success) {
        Alert.alert("Attack Failed", response.errorMsg);
        return;
      }

      // setForm({ your_zone: "", other_zone: "" });
      router.navigate(`/warzone?attacking_zone=${zone_1}&defending_zone=${zone_2}&attacking_team=${team_1}&defending_team=${team_2}&attacking_subteam=${subteam}`);
    } catch (error) {
      Alert.alert(
        "Attack Failed",
        error.response?.data || "Error checking attack"
      );
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (error) {
      console.log(error);
    }
  };

  if (isRefreshing) {
    return (
      <View
        className="flex-1 bg-black"
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingLeft: insets.left,
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
      className="bg-black h-full"
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
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
        >
          <View className="w-full min-h-[82.5vh] px-4 pt-4 mt-2 flex flex-col justify-start">
            <View className="flex flex-col mb-6">

              <View className="flex flex-row justify-between pb-4">
                <Text className="font-pmedium text-[16px]">
                  Team money:{" "}
                  {balance}
                </Text>
                <Text className="font-pmedium text-[16px]">Attack cost: {attackCost}</Text>
              </View>

              {!Array.isArray(myZones) || myZones.length === 0 ? (
                <View></View>
              ) : (
                <DropDownField
                  title="Select Your Country"
                  value={form.your_zone}
                  placeholder="Select Your Country"
                  items={myZones.map((zone) => ({
                    label: `${zone.name}`,
                    value: zone.name,
                  }))}
                  handleChange={(e) => selectYourZone(e)}
                  otherStyles=""
                />
              )}

              {!Array.isArray(otherZones) || otherZones.length === 0 ? (
                <View></View>
              ) : (
                <DropDownField
                  title="Select Country to Attack"
                  value={form.other_zone}
                  placeholder="Select Country to Attack"
                  items={otherZones.map((zone) => ({
                    label: `${zone}`,
                    value: zone,
                  }))}
                  handleChange={(e) => selectOtherZone(e)}
                  otherStyles="mt-5"
                />
              )}
            </View>

            <MapView
              className="flex-1"
              region={{
                latitude: initialArea[0],
                longitude: initialArea[1],
                latitudeDelta: 50,
                longitudeDelta: 100,
              }}
              provider= { Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              mapType="satellite"
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {Array.isArray(zones) && zones.map((zone, index) => (
                <MapZone
                  key={index}
                  points={zone.points}
                  color={getTeamColor(zone.name)}
                  label={zone.name}
                  onMarkerPress={() => onMarkerPress(zone)}
                />
              ))}

              {Array.isArray(CountryConnections) && CountryConnections.map((points, index) => (
                <DottedLine
                  key={index}
                  startPoint={points.point1}
                  endPoint={points.point2}
                  color="#FFF"
                  thickness={2}
                  // dashLength={25}
                  dashGap={2}
                />
              ))}
            </MapView>

            <CustomButton
              title={form.other_zone ? `Attack ${form.other_zone}` : "Attack"}
              handlePress={() =>
                attack_func(form.your_zone, parseInt(teamNo), form.other_zone)
              }
              containerStyles="mt-5 mb-5 p-3"
              textStyles={"text-xl font-pregular"}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Attack;
