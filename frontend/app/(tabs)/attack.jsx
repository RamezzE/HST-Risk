import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import MapView from "react-native-maps";
import { Link, router } from "expo-router";

import { get_zones_by_team } from "../../api/zone_functions";

import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import { attack_check } from "../../api/team_functions";

const Attack = () => {
  
  const { name, teamNo, setAttackData } = useContext(GlobalContext);

  const [form, setForm] = useState({
    teamNo: teamNo,
    your_zone: "",
    other_zone: "",
  });
  const [myZones, setMyZones] = useState([]);
  const [otherZones, setOtherZones] = useState([]);
  const [error, setError] = useState(null);

  

  useEffect(() => {

    if (!teamNo) {
      setMyZones([]);
      setOtherZones([]);

      Alert.alert("Error", "Please login first");

      router.push("/home");
      return;
    }

    const fetchZones = async () => {
      setError(null);

      try {
        const result1 = await get_zones_by_team(parseInt(teamNo));
        const result2 = await get_zones_by_team(2);

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
        setError("Failed to fetch zones");
      }
    };

    // Fetch zones initially
    fetchZones();
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
        <View className="w-full min-h-[80vh] px-4 my-6 flex flex-col justify-between">
          <View className="flex flex-col ">
            <Text className="text-white text-center text-xl p-5">
              Welcome, {name} -- Team {teamNo}
            </Text>

            <DropDownField
              title="Select Your Zone"
              value={form.your_zone}
              placeholder="Select Your Zone"
              items={myZones.map((zone) => ({
                label: `${zone.label} - Team ${zone.team_no}`,
                value: zone.label,
              }))}
              handleChange={(e) => setForm({ ...form, your_zone: e })}
              otherStyles=""
            />

            <DropDownField
              title="Select Adjacent Zone"
              value={form.other_zone}
              placeholder="Select Adjacent Zone"
              items={otherZones.map((zone) => ({
                label: `${zone.label} - Team ${zone.team_no}`,
                value: zone.label,
              }))}
              handleChange={(e) => setForm({ ...form, other_zone: e })}
              otherStyles="mt-5"
            />

          </View>

          <MapView
            className="flex-1 mt-16"
            initialRegion={{
              latitude: 30.35927840030033,
              // latitude: myZones.points[0].latitude,
              longitude: 30.394175088567142,
              // longitude: myZones.points[0].longitude,
              latitudeDelta: 100,
              longitudeDelta: 180,
            }}
            mapType="satellite"
            // scrollEnabled={false}
            // zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          ></MapView>

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
