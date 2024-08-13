import { ScrollView, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";

import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { is_logged_in } from "../api/user_functions";

export default function App() {
  const {
    setName,
    setTeamNo,
    setIsLoggedIn,
    isLoggedIn,
    userMode,
    setUserMode,
  } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkLoggedIn = async () => {
    setIsSubmitting(true);

    try {
      if (isLoggedIn) {
        if (userMode === "team") {
          router.push("/home");
          return;
        }

        if (userMode === "admin") {
          router.push("/admin_home");
          return;
        }

        if (userMode === "super_admin") {
          router.push("/dashboard");
          return;
        }
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }

    try {
      const response = await is_logged_in();

      if (!response.success) {
        router.push("/sign_in");
        return;
      }

      if (response.team != "") {
        setIsLoggedIn(true);
        setTeamNo(response.team.number);
        setUserMode("team");
        router.push("/home");
        return;
      }

      if (response.admin != "") {
        setIsLoggedIn(true);
        setName(response.admin.name);
        setUserMode("admin");
        router.push("/admin_home");
        return;
      }

      if (response.superAdmin != "") {
        setIsLoggedIn(true);
        setName(response.superAdmin.name);
        setUserMode("super_admin");
        router.push("/dashboard");
        return;
      }
    } catch (error) {}
    finally {
      setIsSubmitting(false)
    }
  };

  const guestLogin = () => {
    setTeamNo("");
    setName("Guest");
    router.push("/home");
  };

  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView
        contentContainerStyle={{ height: "100vh" }}
        alwaysBounceVertical={true}
      >
        <View className="w-full justify-center items-center min-h-[82.5vh] px-4">
          <View className="relative mt-5">
            <Text className="text-4xl text-white font-bold text-center">
              Risk
            </Text>
            <Text className="text-2xl text-white font-bold text-center">
              Global Domination
            </Text>
            <Text className="text-gray-200 text-center mt-3 text-sm">
              by Helio Sports Team
            </Text>
          </View>

          <View className="w-full flex flex-row justify-evenly items-center">
            <CustomButton
              title="Guest"
              handlePress={() => guestLogin()}
              containerStyles="p-5 mt-5"
            />

            <CustomButton
              title="Sign in"
              handlePress={() => checkLoggedIn()}
              containerStyles="p-5 mt-5"
              isLoading= {isSubmitting}
            />
            
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
