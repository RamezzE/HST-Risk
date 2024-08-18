import React, { useState } from "react";
import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { update_team } from "../../api/team_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";



const EditTeam = () => {
  const local = useLocalSearchParams();
  const teamNo = local.teamNo;

  const [form, setForm] = useState({
    teamNo: teamNo,
    teamName: local.teamName,
    balance: local.teamBalance,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEditTeam = (teamName) => {
    var result = {
      success: false,
      errorMsg: "",
    };

    try {
      if (!teamName) {
        result.errorMsg = "Please fill in all the fields";
        return result;
      }

      if (isNaN(form.balance) || form.balance === "") {
        result.errorMsg = "Please enter a number for the balance";
        return result;
      }

      result.success = true;
      return result;
    } catch (error) {
      console.log(error);
      result.errorMsg = "Error validating team";
      return result;
    }
    finally {
      setIsSubmitting(false);
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
        form.balance.trim(),
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team updated successfully");

      router.navigate("/teams");
    } catch (error) {
      Alert.alert("Error", "Error updating team xx");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets()

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
              size={32}
              onPress={() => router.navigate('/teams')}
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
              title="Running Money"
              value={form.balance}
              handleChangeText={(e) => setForm({ ...form, balance: e })}
              otherStyles="mt-7"
            />

            

            <CustomButton
              title="Update Team"
              handlePress={() => submit()}
              containerStyles="mt-7 p-3 bg-green-800"
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
