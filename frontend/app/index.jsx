import { useState, useContext } from 'react';
import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { GlobalContext } from "../context/GlobalProvider";
import { is_logged_in } from "../api/user_functions";
import { images } from "../constants";
import PageWrapper from "../components/PageWrapper";

const App = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkLoginStatus = async () => {

    try {
      if (globalState.isLoggedIn) {
        if (globalState.userMode === "subteam") {
          router.navigate("/home");
          return;
        }
        if (globalState.userMode === "admin") {
          if (globalState.adminType === "Wars") {
            router.navigate("/admin_home");
            return;
          }
          router.navigate("/dashboard/teams");
          return;
        }
        if (globalState.userMode === "super_admin") {
          router.navigate("/dashboard");
          return;
        }
      }

      const response = await is_logged_in();

      if (!response.success) {
        router.navigate("/sign_in");
        return;
      }

      if (response.subteam !== "") {
        globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
        globalDispatch({ type: "SET_NAME", payload: response.subteam.name });
        globalDispatch({ type: "SET_USER_MODE", payload: "subteam" });
        globalDispatch({ type: "SET_TEAM_NO", payload: response.subteam.number });
        globalDispatch({ type: "SET_SUBTEAM", payload: response.subteam.letter });

        router.navigate("/home");
        return;
      }

      if (response.admin !== "") {
        globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
        globalDispatch({ type: "SET_NAME", payload: response.admin.name });
        globalDispatch({ type: "SET_USER_MODE", payload: "admin" });

        if (response.admin.type === "Wars") {
          router.navigate("/admin_home");
          return;
        }
        router.navigate("/dashboard/teams");
        return;
      }

      if (response.superAdmin !== "") {
        globalDispatch({ type: "SET_IS_LOGGED_IN", payload: true });
        globalDispatch({ type: "SET_NAME", payload: response.superAdmin.name });
        globalDispatch({ type: "SET_USER_MODE", payload: "super_admin" });

        router.navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <View className="flex-1 justify-center pt-8">
        <View className="w-full justify-center space-y-8 items-center px-4 py-8">
          <View className="w-full flex flex-col space-y-8">
            <View>
              <Text className="text-8xl text-black font-montez text-center p-5">
                Risk
              </Text>
              <Text className="text-5xl text-black font-montez p-2 text-center">
                Camp Domination
              </Text>
            </View>

            <View className="w-full flex flex-row justify-evenly items-center">
              <CustomButton
                title="Guest"
                handlePress={() => {
                  globalDispatch({ type: "SET_NAME", payload: "Guest" });
                  router.navigate("/guest_choose_team");
                }}
                textStyles={"font-montez text-3xl"}
                containerStyles={"p-4"}
              />

              <CustomButton
                title="Sign in"
                handlePress={() => {
                  setIsSubmitting(true);
                  checkLoginStatus();
                }}
                isLoading={isSubmitting}
                textStyles={"font-montez text-3xl"}
                containerStyles={"p-4"}
              />
            </View>
          </View>

          <View className="">
            <Image
              source={images.papyrus_globe}
              className="h-48"
              resizeMode="contain"
            />
          </View>
          <Text className="text-black text-2xl text-center font-montez">
            by Helio Sports Team
          </Text>
        </View>
      </View>
    </PageWrapper>
  );
}

export default App;