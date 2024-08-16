import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ImageBackground, ActivityIndicator } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { get_team, update_team, delete_team } from "../../api/team_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

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
  const [isRefreshing, setIsRefreshing] = useState(true);

  const fetchData = async () => {
    
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
    finally {
      setIsRefreshing(false);
    }
  };

  const submit = async () => {

    setIsSubmitting(true);

    var result = validateEditTeam(form.teamName, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

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

      router.replace("/teams");
    } catch (error) {
      Alert.alert("Error", "Error updating team xx");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTeam = async () => {
    setIsSubmitting(true);

    try {
      const response = await delete_team(teamNo);

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team deleted successfully");

      router.dismiss(1);
    } catch (error) {
      Alert.alert("Error", "Error deleting team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTeamAlert = async () => {
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
          onPress: () => {deleteTeam()},
        },
      ]
    );
  };

  const insets = useSafeAreaInsets()

  if (isRefreshing) {
    return (
      <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="flex-1 bg-black">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="25" color="#000" />
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="bg-black h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
            <BackButton
              style="w-[20vw]"
              color="black"
              size={32}
              onPress={() => router.dismiss(1)}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
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

            <CustomButton
              title="Update Team"
              handlePress={() => submit()}
              containerStyles="mt-7 p-3 bg-green-800"
              textStyles={"text-3xl"}
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Delete Team"
              handlePress={()=> {deleteTeamAlert()}}
              containerStyles="mt-7 p-3 bg-red-800"
              textStyles={"text-3xl"}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default EditTeam;
