import { useState, useContext } from "react";
import { View, Text, Alert } from "react-native";

import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

import BackButton from "../../components/BackButton";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { Login } from "../../helpers/AuthHelpers";

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
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    var result = validateSignIn(form.username, form.password);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      
      const response = await Login(form.username.trim(), form.password.trim(), globalState, globalDispatch);
      
      if (response.path) {
        router.replace(response.path);
        return;
      }
      
      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

    } catch (error) {
      Alert.alert("Error", "Cannot sign in");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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
