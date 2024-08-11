import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../../components/BackButton";

const DashboardHome = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <BackButton style="w-[20vw]" color="white" size={32} path="/" />
      <Text className="text-white">Dashboard Home</Text>
    </SafeAreaView>
  );
};

export default DashboardHome;
