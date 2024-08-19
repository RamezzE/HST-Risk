import { Text, View, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import CustomButton from "../components/CustomButton";

import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { is_logged_in } from "../api/user_functions";

import { images } from "../constants";

export default function App() {
  const {
    setName,
    setTeamNo,
    setIsLoggedIn,
    isLoggedIn,
    userMode,
    setUserMode,
    setSubteam,
    setExpoPushToken
  } = useContext(GlobalContext);

  const registerForPushNotificationsAsync = async () => {
    let token;

    // Check and request for permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Get the token that can be used to send notifications to this device
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    } catch (err) {
      console.log("Error getting token: ", err);
    }

    console.log("Token: ", token);

    // If using a physical device, configure for push notifications
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const checkLoginStatus = async () => {
    if (!isSubmitting) {
      return;
    }
    try {
      if (isLoggedIn) {
        console.log("isLoggedIn");
        if (userMode === "subteam") {
          router.navigate("/home");
          console.log("Team");
          return;
        }

        if (userMode === "admin") {
          router.navigate("/admin_home");
          console.log("Admin");
          return;
        }

        if (userMode === "super_admin") {
          router.navigate("/dashboard");
          console.log("Super Admin");
          return;
        }
      }

      const response = await is_logged_in();

      if (!response.success) {
        console.log("Not success");
        router.navigate("/sign_in");
        return;
      }

      if (response.subteam !== "") {
        setIsLoggedIn(true);
        setTeamNo(response.subteam.number);
        setSubteam(response.subteam.letter);
        setName(response.subteam.name);
        setUserMode("subteam");
        router.navigate("/home");
        return;
      }

      if (response.admin !== "") {
        setIsLoggedIn(true);
        setName(response.admin.name);
        setUserMode("admin");
        router.navigate("/admin_home");
        return;
      }

      if (response.superAdmin !== "") {
        setIsLoggedIn(true);
        setName(response.superAdmin.name);
        setUserMode("super_admin");
        router.navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      checkLoginStatus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const checkLoggedIn = () => {
    setIsSubmitting(true);
  };

  const guestLogin = () => {
    setName("Guest");
    router.navigate("/guest_choose_team");
  };

  return (
    <View
      className=" h-full bg-black"
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <View className="h-full justify-center mt-8">
          <View className="w-full justify-around items-center min-h-[82.5vh] px-4">
            <View className="w-full flex justify-center">
              <View className="mt-5">
                <Text className="text-8xl text-black font-montez text-center p-5">
                  Risk
                </Text>
                <Text className="text-5xl text-black font-montez p-2 text-center">
                  Camp Domination
                </Text>
              </View>

              <View className="w-full flex flex-row justify-evenly text- items-center">
                <CustomButton
                  title="Guest"
                  handlePress={() => guestLogin()}
                  textStyles={"font-montez text-3xl"}
                  containerStyles={"mt-6 p-4"}
                />

                <CustomButton
                  title="Sign in"
                  handlePress={() => checkLoggedIn()}
                  isLoading={isSubmitting}
                  textStyles={"font-montez text-3xl"}
                  containerStyles={"mt-6 p-4"}
                />
              </View>
            </View>

            <View>
              <Image
                source={images.papyrus_globe}
                className="h-48"
                resizeMode="contain"
              />
            </View>
            <Text className="text-black text-2xl text-center font-montez mt-3 ">
              by Helio Sports Team
            </Text>
          </View>
        </View>
        <StatusBar backgroundColor="#000" style="light" />
      </ImageBackground>
    </View>
  );
}
