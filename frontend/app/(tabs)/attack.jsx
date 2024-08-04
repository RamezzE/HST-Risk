import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";

import { useState } from "react";
import MapView from "react-native-maps";

const Attack = () => {
  const [form, setForm] = useState({ teamNo: "" });

  zones = [
    {
      number: 1,
      name: "Zone 1",
    },
    {
      number: 2,
      name: "Zone 2",
    },
    {
      number: 3,
      name: "Zone 3",
    },
    {
      number: 4,
      name: "Zone 4",
    },
    {
      number: 5,
      name: "Zone 5",
    },
  ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[80vh] px-4 my-6 flex flex-col justify-between">
          <View className="flex flex-col ">
            <Text className="text-white text-center text-xl p-5">
              Welcome, Team 1
            </Text>
            <DropDownField
              title="Select Zone"
              value={form.teamNo}
              placeholder="Select Zone"
              items={zones.map((zone) => ({
                label: `Zone ${zone.number} - ${zone.name}`,
                value: zone.name,
              }))}
              handleChange={(e) => setForm({ ...form, teamNo: e })}
              otherStyles=""
            />

            <View className="mt-3">
              <Text className="text-white mt-2">Name: {form.teamNo}</Text>
              <Text className="text-white mt-2">
                Owned by Team {form.teamNo}
              </Text>
              <Text className="text-white mt-2">
                Description: {form.teamNo}
              </Text>
            </View>
          </View>

          <MapView
            className="flex-1 mt-16"
            initialRegion={{
              latitude: 30.35927840030033,
              longitude: 30.394175088567142,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            mapType="satellite"
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          ></MapView>

          <CustomButton
            title={`Attack Zone ${form.teamNo}`}
            // handlePress={() => console.log("Attacking Zone")}
            containerStyles="mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attack;
