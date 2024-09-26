import { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, Image, ImageBackground, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import { router } from "expo-router";
import Constants from 'expo-constants';
import CustomButton from "../components/CustomButton";
import { GlobalContext } from "../context/GlobalProvider";
import { is_logged_in } from "../api/user_functions";
import { images } from "../constants";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const {
    adminType,
    setName,
    setTeamNo,
    setIsLoggedIn,
    isLoggedIn,
    userMode,
    setUserMode,
    setSubteam,
    setExpoPushToken
  } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const insets = useSafeAreaInsets();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        console.log('Project ID not found');
        return;
      }

      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("Expo Push Token: ", pushTokenString);
        setExpoPushToken(pushTokenString);
        return pushTokenString;
      } catch (error) {
        console.log(`Error getting token: ${error}`);
      }
    } else {
      // alert('Must use physical device for push notifications');
    }
  };

  const checkLoginStatus = async () => {
    if (!isSubmitting) {
      return;
    }
    try {
      if (isLoggedIn) {
        if (userMode === "subteam") {
          router.navigate("/home");
          return;
        }

        if (userMode === "admin") {
          if (adminType === "Wars") {
            router.navigate("/admin_home");
            return;
          }
          router.navigate("/admin_home2");
          return;
        }

        if (userMode === "super_admin") {
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
        if (response.admin.type === "Wars") {
          router.navigate("/admin_home");
          return;
        }
        router.navigate("/admin_home2");
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
    const keepSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    };

    keepSplash();

    // Register for push notifications and save the token
    registerForPushNotificationsAsync();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user interacts with a notification (taps on it)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
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
      className="flex-1 bg-black"
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
                  handlePress={() => guestLogin()}
                  textStyles={"font-montez text-3xl"}
                  containerStyles={"p-4"}
                />

                <CustomButton
                  title="Sign in"
                  handlePress={() => checkLoggedIn()}
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
        <StatusBar backgroundColor="#000" style="light" />
      </ImageBackground>
    </View>
  );
}
