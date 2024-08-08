import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import { useState } from "react";
import MapView from "react-native-maps";

import { useEffect } from "react";

import { get_zones_by_team } from "../../api/zone_functions";
import { attack } from "../../api/team_functions";

const Attack = () => {
  const [form, setForm] = useState({ teamNo: "", your_zone: "" });
  const [myZones, setMyZones] = useState([]);
  const [otherZones, setOtherZones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      setError(null);

      try {
        const result1 = await get_zones_by_team(1);
        const result2 = await get_zones_by_team(2);

        if (result1.errorMsg) {
          setError(result1.errorMsg);
        } else if (result2.errorMsg) {
          setError(result2.errorMsg);
        } else if (Array.isArray(result1) && Array.isArray(result2)) {
          setMyZones(result1);
          setOtherZones(result2);

          // Log points for team 1 zones
          myZones.forEach((zone) => {
            console.log(`${zone.label} Points:`, zone.points[0].latitude);
          });
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
      Alert.alert('Error', result.errorMsg);
      return;
    }

    try {
      const response = await attack(zone_1, team_1, zone_2, team_2);
      Alert.alert("Attack", response.errorMsg);
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
              Welcome, Team 1
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
              attack_func(form.your_zone, 1, form.other_zone, 2)
            }
            containerStyles="mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attack;
