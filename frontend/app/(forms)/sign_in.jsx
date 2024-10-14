import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { addPushToken, login } from "../../api/user_functions";

import { useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import BackButton from "../../components/BackButton";

const validateSignIn = (username, password) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!username || !password) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  result.success = true;
  return result;
};

const SignIn = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!isSubmitting) return;

      try {
        const response = await login(
          form.username.trim(),
          form.password.trim()
        );

        if (!response.success) {
          Alert.alert("Error", response.errorMsg);
          return;
        }

        if (response.subteam != "") {

          globalDispatch({ type: "SET_TEAM_NO", payload: response.subteam.number });
          globalDispatch({ type: "SET_SUBTEAM", payload: response.subteam.letter });
          globalDispatch({ type: "SET_NAME", payload: response.subteam.name });
          globalDispatch({ type: "SET_USER_MODE", payload: "subteam" });

          await addPushToken(globalState.expoPushToken, response.subteam.number);
          globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
          router.replace("/home");
          return;
        }

        if (response.admin != "") {
          globalDispatch({ type: "SET_NAME", payload: form.username });
          globalDispatch({ type: "SET_USER_MODE", payload: "admin" });
          globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });

          if (response.admin.type == "Wars") {
            router.replace("/admin_home");
            return;
          }

          router.replace("/(teams)");
          return;
        }

        if (response.superAdmin != "") {
          globalDispatch({ type: "SET_USER_MODE", payload: "super_admin" });
          globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });

          router.replace("/dashboard");
          return;
        }

        Alert.alert("Error", response.errorMsg);
      } catch (error) {
        Alert.alert("Error", "Cannot sign in");
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };

    checkLoginStatus();
  }, [isSubmitting]);

  const submit = async () => {
    var result = validateSignIn(form.username, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);
  };

  return (

    <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-center">
      <BackButton
        style="w-[20vw] mb-4"
        size={32}
        onPress={() => router.dismiss(1)}
      />
      <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
        Sign In
      </Text>

      <FormField
        title="Username"
        value={form.username}
        handleChangeText={(e) => setForm({ ...form, username: e })}
        otherStyles="mt-7"
        placeholder={"Username"}
      />

      <FormField
        title="Password"
        value={form.password}
        handleChangeText={(e) => setForm({ ...form, password: e })}
        otherStyles="mt-7"
        placeholder={"Password"}
      />

      <CustomButton
        title="Sign In"
        handlePress={submit}
        containerStyles="mt-7 p-3"
        textStyles={"text-3xl"}
        isLoading={isSubmitting}
      />
    </View>

  );
};

export default SignIn;
