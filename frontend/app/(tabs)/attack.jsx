import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import { get_country_mappings } from "../../api/country_functions";

import MapView from "react-native-maps";
import { Link, router } from "expo-router";

import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import { attack_check } from "../../api/team_functions";

import { get_countries_by_team } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";

import countries from "../../constants/countries";

import MapZone from "../../components/MapZone";

const Attack = () => {
  const { name, teamNo, setAttackData } = useContext(GlobalContext);
  const [countryMappings, setCountryMappings] = useState([]);
  const [initialArea, setInitialArea] = useState([30, 30]);
  const [zones, setZones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [myZones, setMyZones] = useState([]);
  const [otherZones, setOtherZones] = useState([]);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    teamNo: teamNo,
    your_zone: "",
    other_zone: "",
  });

  const getTeamColor = (countryName) => {
    const country = countryMappings.find((c) => c.name === countryName);
    const team = country
      ? teams.find((t) => t.number === country.teamNo)
      : null;
    return team ? team.color : "#000000";
  };

  const changeMapPreview = (zone) => {
    const country = countries.find((c) => c.name === zone);

    const avgLat =
      country.points.reduce((acc, curr) => acc + curr.latitude, 0) /
      country.points.length;
    const avgLong =
      country.points.reduce((acc, curr) => acc + curr.longitude, 0) /
      country.points.length;

    setInitialArea([avgLat, avgLong]);
  };

  useEffect(() => {
    if (!teamNo) {
      setMyZones([]);
      setOtherZones([]);

      Alert.alert("Error", "Please login first");

      router.push("/home");
      return;
    }

    const fetchData = async () => {
      setError(null);

      try {
        const result1 = await get_countries_by_team(parseInt(teamNo));
        const result2 = await get_countries_by_team(2);

        if (result1.errorMsg) {
          setError(result1.errorMsg);
        } else if (result2.errorMsg) {
          setError(result2.errorMsg);
        } else if (Array.isArray(result1) || Array.isArray(result2)) {
          if (Array.isArray(result1)) setMyZones(result1);

          if (Array.isArray(result2)) setOtherZones(result2);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const validateAttack = (zone_1, zone_2, team_1, team_2) => {
    var result = {
      success: false,
      errorMsg: "",
    };

    if (!zone_1 || !zone_2) {
      result.errorMsg = "Please fill in all the fields";
      return result;
    }

    if (team_1 === team_2) {
      result.errorMsg = "You cannot attack your own team";
      return result;
    }

    result.success = true;
    return result;
  };

  const selectYourZone = (zone) => {
    setForm({ ...form, your_zone: zone, other_zone: "" });
    
    if (!zone || zone == "") return;

    changeMapPreview(zone);
  };

  const selectOtherZone = (zone) => {
    setForm({ ...form, other_zone: zone });

    if (!zone || zone == "") return;

    changeMapPreview(zone);
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setZones(countries);

      try {
        const result = await get_country_mappings();
        setCountryMappings(result);
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

    // Fetch zones and teams initially
    fetchData();

    // const interval = setInterval(fetchData, 60000);
    const interval = setInterval(fetchData, 30000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const attack_func = async (zone_1, team_1, zone_2, team_2) => {
    try {
      var result = validateAttack(
        form.your_zone,
        form.other_zone,
        team_1,
        team_2
      );
      if (!result.success) {
        Alert.alert("Attack Failed", result.errorMsg);
        return;
      }

      const response = await attack_check(zone_1, team_1, zone_2, team_2);

      if (!response.success) {
        Alert.alert("Attack Failed", response.errorMsg);
        return;
      }

      console.log("Response", response);
      setAttackData({
        attacking_zone: zone_1,
        attacking_team: team_1,
        defending_zone: zone_2,
        defending_team: team_2,
        war: "",
      });

      setForm({ your_zone: "", other_zone: "" });
      router.push("/warzone");
    } catch (error) {
      Alert.alert(
        "Attack Failed",
        error.response?.data || "Error checking attack"
      );
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-between">
          <View className="flex flex-col mb-6">
            <Text className="text-white text-center text-xl p-5">
              Welcome, {name} -- Team {teamNo}
            </Text>

            <DropDownField
              title="Select Your Zone"
              value={form.your_zone}
              placeholder="Select Your Zone"
              items={myZones.map((zone) => ({
                label: `${zone.name} - Team ${zone.teamNo}`,
                value: zone.name,
              }))}
              handleChange={(e) => selectYourZone(e)}
              otherStyles=""
            />

            <DropDownField
              title="Select Adjacent Zone"
              value={form.other_zone}
              placeholder="Select Adjacent Zone"
              items={otherZones.map((zone) => ({
                label: `${zone.name} - Team ${zone.teamNo}`,
                value: zone.name,
              }))}
              handleChange={(e) => selectOtherZone(e)}
              otherStyles="mt-5"
            />
          </View>

          <MapView
            className="flex-1"
            region={{
              latitude: initialArea[0],
              longitude: initialArea[1],
              latitudeDelta: 50,
              longitudeDelta: 50,
            }}
            mapType="satellite"
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {zones.map((zone, index) => (
              <MapZone
                key={index}
                points={zone.points}
                color={getTeamColor(zone.name)}
                label={zone.name}
              />
            ))}
          </MapView>

          <CustomButton
            title={form.other_zone ? `Attack ${form.other_zone}` : "Attack"}
            handlePress={() =>
              attack_func(form.your_zone, parseInt(teamNo), form.other_zone, 2)
            }
            containerStyles="mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attack;
