import React, { useState, useContext } from "react";
import { View, Text, Alert } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { update_country } from "../../../api/country_functions";

import BackButton from "../../../components/BackButton";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import DropDownField from "../../../components/DropDownField";
import FormWrapper from "../../../components/FormWrapper";
import { GlobalContext } from "../../../context/GlobalProvider";

const EditCountry = () => {
  const local = useLocalSearchParams();

  const { globalState } = useContext(GlobalContext);
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
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update country");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <View className="justify-center my-6 px-4 w-full min-h-[82.5vh]">
        <BackButton
          style="w-[20vw] mb-4"
          size={32}
          onPress={() => {
            router.back();
          }}
        />
        <Text className="mt-10 py-1 pt-2 font-montez text-black text-5xl text-center">
          Edit Country
        </Text>
        <FormField
          title="Country Name"
          value={form.countryName}
          otherStyles="mt-7"
          editable={false}
        />

        {Array.isArray(globalState.teams) && (
          <DropDownField
            title="Owned by Team"
            value={form.teamNo}
            placeholder="Select Team"
            items={globalState.teams.map((team) => ({
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
          containerStyles="mt-7 p-3 bg-green-700"
          textStyles={"text-3xl"}
          isLoading={isSubmitting}
        />
      </View>
    </FormWrapper>
  );
};

export default EditCountry;
