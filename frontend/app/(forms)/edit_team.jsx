import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { get_team, update_team, delete_team } from "../../api/team_functions";

const validateEditTeam = (teamName, password) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!teamName || !password) {
    result.errorMsg = "Please fill in all the fields";
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
    var result = validateEditTeam(form.teamName, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await update_team(
        local.teamNo.trim(),
        form.teamName.trim(),
        form.password.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team updated successfully");

      router.push("/teams");
    } catch (error) {
      Alert.alert("Error", "Error updating team xx");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTeam = async () => {
    Alert.alert(
      "Delete Team",
      `Are you sure you want to delete team ${teamNo}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setIsSubmitting(true);

            try {
              const response = await delete_team(teamNo);

              if (!response.success) {
                Alert.alert("Error", response.errorMsg);
                return;
              }

              Alert.alert("Success", "Team deleted successfully");

              router.push("/teams");
              
            } catch (error) {
              Alert.alert("Error", "Error deleting team");
              console.log(error);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
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
          <CustomButton
            title="Delete Team"
            handlePress={deleteTeam}
            containerStyles="mt-7 bg-red-800"
            textStyles={"text-white"}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTeam;
