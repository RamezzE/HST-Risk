import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { add_team } from "../../api/admin_functions";

const validateAddTeam = (teamNo, teamName, password) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!teamNo || !teamName || !password) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  if (isNaN(teamNo)) {
    result.errorMsg = "Team number must be a number";
    return result;
  }

  result.success = true;
  return result;
};

const AddTeam = () => {
  const [form, setForm] = useState({
    teamNo: "",
    teamName: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    var result = validateAddTeam(form.teamNo, form.teamName, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await add_team(
        form.teamNo.trim(),
        form.teamName.trim(),
        form.password.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team added successfully");

      // Reset the form state
      setForm({
        teamNo: "",
        teamName: "",
        password: "",
      });

      router.push("/teams"); // Uncomment this if you are using Expo Router
    } catch (error) {
      Alert.alert("Error", "Error adding team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[75vh] px-4 my-6">
            <Text className="text-4xl text-white font-bold text-center">
                Add Team
            </Text>
          <FormField
            title="Team Number"
            value={form.teamNo}
            handleChangeText={(e) => setForm({ ...form, teamNo: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Team Name"
            value={form.teamName}
            handleChangeText={(e) => setForm({ ...form, teamName: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <View className="w-full flex flex-row items-center justify-evenly">
            <CustomButton
              title="Cancel"
              handlePress={() => router.push("/teams")}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Add Team"
              handlePress={submit}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTeam;
