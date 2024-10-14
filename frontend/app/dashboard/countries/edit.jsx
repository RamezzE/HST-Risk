import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { get_all_teams } from "../../../api/team_functions";

import { update_country } from "../../../api/country_functions";

import BackButton from "../../../components/BackButton";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import DropDownField from "../../../components/DropDownField";
import FormWrapper from "../../../components/FormWrapper";

const EditCountry = () => {
  const local = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    countryName: local.countryName,
    teamNo: local.teamNo,
  });

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const result = await update_country(
        form.countryName.trim(),
        form.teamNo.trim()
      );
      if (result.success === false) {
        Alert.alert("Error", result.errorMsg);
      } else {
        Alert.alert("Success", "Country updated successfully");
        router.navigate("/dashboard/countries");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update country");
      console.log(error);
    } finally {
      setIsSubmitting(false);
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
    <FormWraper>
      <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
        <BackButton
          style="w-[20vw] mb-4"
          size={32}
          onPress={() => {
            router.navigate("/dashboard/countries");
          }}
        />
        <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
          Edit Country
        </Text>
        <FormField
          title="Country Name"
          value={form.countryName}
          otherStyles="mt-7"
          editable={false}
        />

        {Array.isArray(teams) && (
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
        )}

        <CustomButton
          title="Update Country"
          handlePress={submit}
          containerStyles="mt-7 p-3 bg-green-800"
          textStyles={"text-3xl"}
          isLoading={isSubmitting}
        />
      </View>
    </FormWraper>
  );
};

export default EditCountry;
