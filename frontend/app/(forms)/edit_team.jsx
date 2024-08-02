import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import { update_team, get_team } from "../../api";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const validateEditTeam = (teamNo, teamName, password) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!teamNo || !teamName) {
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

const EditTeam = () => {
  const local = useLocalSearchParams();
  const teamNo = local.teamNo;

  const [form, setForm] = useState({
    teamNo: teamNo,
    teamName: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await get_team(teamNo);

        console.log("Team Data:", response); // Log the team data

        if (response.team) {
          setForm({
            teamName: response.team.name,
            password: response.team.password,
          });
        } else {
          Alert.alert("Error", response.errorMsg);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch team data");
      }
    };

    fetchTeam();
  }, [teamNo]);

  const submit = async () => {
    var result = validateEditTeam(form.teamNo, form.teamName, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await update_team(
        form.teamNo,
        form.teamName,
        form.password
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team updated successfully");

      router.push("/teams");
    } catch (error) {
      Alert.alert("Error", "Error updating team");
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
            Edit Team
          </Text>
          <FormField
            title="Team Number"
            value={teamNo}
            otherStyles="mt-7"
            editable={false}
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
              title="Update Team"
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

export default EditTeam;
