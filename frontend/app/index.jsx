import { Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import CustomButton from '../components/CustomButton'

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className = 'text-3xl font-psemibold'>App is up</Text>
      <CustomButton
            title = "Continue with Email"
            handlePress = { () => router.push('/sign_in')}
            containerStyles = 'w-full mt-7'
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
