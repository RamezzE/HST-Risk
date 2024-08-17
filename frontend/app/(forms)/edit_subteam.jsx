import React, { useState } from "react";
import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { update_subteam } from "../../api/team_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

const validateEditTeam = (password) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!password) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  result.success = true;
  return result;
};

const EditTeam = () => {
  const local = useLocalSearchParams();

  const [form, setForm] = useState({
    username: local.username || "",
    password: local.password || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);

    var result = validateEditTeam(form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    try {
      const response = await update_subteam(
        local.username.trim(),
        form.password.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Subteam updated successfully");

      router.navigate("/subteams");
    } catch (error) {
      Alert.alert("Error", "Error updating team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
      className="bg-black h-full"
    >
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
              onPress={() => router.navigate('/subteams')}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Edit Subteam
            </Text>

            <FormField
              title="Subteam"
              value={form.username}
              otherStyles="mt-7"
              editable={false}
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              textStyles="font-plight"
            />

            <CustomButton
              title="Update Subteam"
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
