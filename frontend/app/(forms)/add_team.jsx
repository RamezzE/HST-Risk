import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import FormField from "../../components/FormField";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { add_team } from "../../api/team_functions";

import { images } from "../../constants";

import BackButton from "../../components/BackButton";

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
    setIsSubmitting(true);

    var result = validateAddTeam(form.teamNo, form.teamName, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      console.log(result.errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await add_team(
        form.teamNo.trim(),
        form.teamName.trim(),
        form.password.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        console.log(response);
        return;
      }

      Alert.alert("Success", "Team added successfully");

      setForm({
        teamNo: "",
        teamName: "",
        password: "",
      });

      router.dismiss(1);
    } catch (error) {
      Alert.alert("Error", "Error adding team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
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

            <CustomButton
              title="Add Team"
              handlePress={() => {
                submit();
              }}
              containerStyles="mt-7 p-3"
              textStyles={"text-3xl"}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddTeam;
