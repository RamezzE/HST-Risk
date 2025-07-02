import '../global.css';
import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GlobalProvider } from "../context/GlobalProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import NotificationHandler from "../components/NotificationHandler";
import SocketListener from "../components/SocketListener";
import GlobalInitializer from "../components/GlobalInitializer";
import PageWrapper from '../components/PageWrapper';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Montez-Regular": require("../assets/fonts/Montez-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    SplashScreen.preventAutoHideAsync();

    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <GlobalProvider>
          <PageWrapper>
            <GlobalInitializer />
            <NotificationHandler />
            <SocketListener />
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: "transparent" },
                headerShown: false,
                animation: "none",
              }}
            >
              <Stack.Screen name="index" />
            </Stack>
          </PageWrapper>
        </GlobalProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
