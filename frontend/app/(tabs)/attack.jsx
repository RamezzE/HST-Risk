import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import MapView from "react-native-maps";
import { Link, router } from 'expo-router';

import { get_zones_by_team } from "../../api/zone_functions";
import { attack } from "../../api/team_functions";

import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

const Attack = () => {
  const { name, teamNo } = useContext(GlobalContext);

  const [form, setForm] = useState({ teamNo: teamNo, your_zone: "" });
  const [myZones, setMyZones] = useState([]);
  const [otherZones, setOtherZones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          if (Array.isArray(result1)) 
            setMyZones(result1);

          if (Array.isArray(result2)) 
            setOtherZones(result2);
          
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

  const attack_func = async (zone_1, team_1, zone_2, team_2) => {
    var result = validateAttack(form.your_zone, form.other_zone);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }
 
    try {

      const response = await attack(zone_1, team_1, zone_2, team_2);
      if (response.errorMsg == "") {
        Alert.alert("Attack", `Attack successful from ${zone_1} on ${zone_2}`);
        router.push('/warzone');
      }
      else {
        Alert.alert("Attack", response.errorMsg);
      }
    } catch (error) {
      return {
        errorMsg: error.response?.data || "API: Error making attack request",
      };
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

            {/* <View className="mt-3">
              <Text className="text-white mt-2">Name: {form.teamNo}</Text>
              <Text className="text-white mt-2">
                Owned by Team {form.teamNo}
              </Text>
              <Text className="text-white mt-2">
                Description: {form.teamNo}
              </Text>
            </View> */}
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
            title={`Attack ${form.other_zone}`}
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
