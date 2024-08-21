import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { addPushToken, login } from "../../api/user_functions";

import { useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import { images } from "../../constants";

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

  const { setName, setTeamNo, setSubteam, expoPushToken, setUserMode, setIsLoggedIn } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!isSubmitting)
        return;
      
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
          setTeamNo(response.subteam.number);
          setName(response.subteam.name);
          setSubteam(response.subteam.letter);
          setUserMode("subteam");

          await addPushToken(expoPushToken, response.subteam.number);
          setIsLoggedIn(true)
          router.replace("/home");
          return;
        }

        if (response.admin != "") {
          setName(form.username);
          setUserMode("admin");
          if (response.admin.type == "Wars") {
            router.replace("/admin_home");
            return;
          }
          setIsLoggedIn(true)

          router.replace("/admin_home2");
          return;
        }

        if (response.superAdmin != "") {
          setUserMode("super_admin");
          setIsLoggedIn(true)

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

  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="bg-black h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-center">
            <BackButton
              style="w-[20vw] mb-4"
              size={32}
              onPress={() => router.replace("/")}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Sign In
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7 p-3"
              textStyles={"text-3xl"}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default SignIn;
