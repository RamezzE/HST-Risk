import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";

import { get_all_teams } from "../../api/team_functions";

import { update_country } from '../../api/country_functions';

const EditTerritory = () => {
  const local = useLocalSearchParams();

  const [form, setForm] = useState({
    countryName: local.countryName,
    teamNo: local.teamNo,
  });

  const submit = async () => {
    try {
        const result = await update_country(form.countryName.trim(), form.teamNo.trim());
        if (result.success === false) {
          Alert.alert("Error", result.errorMsg);
        } else {
          Alert.alert("Success", "Country updated successfully");
          router.push("/countries");
        }
    }
    catch(error) {
        Alert.alert("Error", "Failed to update country");
        console.log(error);
    }
  }

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_all_teams();
        setTeams(response)
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
        <View className="w-full justify-center min-h-[75vh] px-4 my-6">
          <Text className="text-4xl text-white font-bold text-center">
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
              value: (team.number).toString(),
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

          <View className="w-full flex flex-row items-center justify-evenly">
            <CustomButton
              title="Cancel"
              handlePress={() => router.push("/countries")}
              containerStyles="w-[45%] mt-7"
              //   isLoading={isSubmitting}
            />
            <CustomButton
              title="Update Country"
                handlePress={submit}
              containerStyles="w-[45%] mt-7"
              //   isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTerritory;
