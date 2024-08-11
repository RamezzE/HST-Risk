import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";

import { get_all_teams } from "../../api/team_functions";

import { update_country } from "../../api/country_functions";

import BackButton from "../../components/BackButton";

const EditTerritory = () => {
  const local = useLocalSearchParams();

  const [form, setForm] = useState({
    countryName: local.countryName,
    teamNo: local.teamNo,
  });

  const submit = async () => {
    try {
      const result = await update_country(
        form.countryName.trim(),
        form.teamNo.trim()
      );
      if (result.success === false) {
        Alert.alert("Error", result.errorMsg);
      } else {
        Alert.alert("Success", "Country updated successfully");
        router.push("/countries");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update country");
      console.log(error);
    }
  };

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_all_teams();
        setTeams(response);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data");
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
          <BackButton style="w-[20vw] mb-4" color="white" size={32} path="/" />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Edit Country
          </Text>
          <FormField
            title="Country Name"
            value={form.countryName}
            otherStyles="mt-7"
            editable={false}
          />

          <DropDownField
            title="Owned by Team"
            value={form.teamNo}
            placeholder="Select Team"
            items={teams.map((team) => ({
              label: `Team ${team.number} - ${team.name}`,
              value: team.number.toString(),
            }))}
            // items={[]}
            handleChange={(e) => setForm({ ...form, teamNo: e })}
            otherStyles="mt-7"
          />

          {/* <FormField
            title="Team Owned"
            value={form.teamNo}
            handleChangeText={(e) => setForm({ ...form, teamName: e })}
            otherStyles="mt-7"
          /> */}

          <CustomButton
            title="Update Country"
            handlePress={submit}
            containerStyles="mt-7"
            // isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTerritory;
