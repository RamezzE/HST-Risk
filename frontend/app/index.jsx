import { ScrollView, Text, View, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
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
  } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        if (isLoggedIn) {
          console.log("isLoggedIn");
          if (userMode === "team") {
            router.push("/home");
            console.log("Team");
            return;
          }
  
          if (userMode === "admin") {
            router.push("/admin_home");
            console.log("Admin");
            return;
          }
  
          if (userMode === "super_admin") {
            router.push("/dashboard");
            console.log("Super Admin");
            return;
          }
        }
  
        const response = await is_logged_in();
  
        if (!response.success) {
          console.log("Not success");
          router.push("/sign_in");
          return;
        }
  
        if (response.team !== "") {
          setIsLoggedIn(true);
          setTeamNo(response.team.number);
          setName(response.team.name);
          setUserMode("team");
          router.push("/home");
          return;
        }
  
        if (response.admin !== "") {
          setIsLoggedIn(true);
          setName(response.admin.name);
          setUserMode("admin");
          router.push("/admin_home");
          return;
        }
  
        if (response.superAdmin !== "") {
          setIsLoggedIn(true);
          setName(response.superAdmin.name);
          setUserMode("super_admin");
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    if (isSubmitting) {
      checkLoginStatus();
    }
  }, [isSubmitting]);
  
  const checkLoggedIn = () => {
    setIsSubmitting(true);
  };

  const guestLogin = () => {
    setTeamNo("");
    setName("Guest");
    router.push("/guest_choose_team");
  };

  return (
    <SafeAreaView className=" h-full ">
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
                <Text className="text-black text-2xl text-center font-montez mt-3 ">
                  by Helio Sports Team
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
              <Image source={images.wood_home} className= "h-48" resizeMode="contain"/>
            </View>
          </View>
        </View>
        <StatusBar backgroundColor="#000" style="light" />
      </ImageBackground>
    </SafeAreaView>
  );
}
