import { Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className = 'text-3xl font-psemibold'>App is up</Text>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
