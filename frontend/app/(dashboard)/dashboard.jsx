import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../../components/BackButton";

import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalProvider";

import { router } from "expo-router";

const DashboardHome = () => {

  const { Logout } = useContext(GlobalContext);

  const logoutFunc = () => {
    Logout();
    router.replace("/")
  }

  return (
    <SafeAreaView className="bg-primary h-full">
        <BackButton style="w-[20vw] mb-4" color="white" size={32} onPress={() => logoutFunc()} />
      <Text className="text-white">Dashboard Home</Text>
    </SafeAreaView>
  );
};

export default DashboardHome;
