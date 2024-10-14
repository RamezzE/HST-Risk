import React, { useContext, useEffect } from "react";
import { View, Text, Image, Alert, Platform } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GlobalContext } from "../../context/GlobalProvider"; 
import { router } from "expo-router"; 
import { deletePushToken } from "../../api/user_functions"; 

import { icons } from "../../constants";
import PageWrapper from "../../components/PageWrapper";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={Platform.OS === "ios" ? "w-6 h-6 mt-2" : "w-6 h-6"}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { globalState, socket, Logout } = useContext(GlobalContext); 

  useEffect(() => {
    const handleNewGame = () => {
      Alert.alert(
        "New Game",
        "A new game has started. You will be logged out automatically."
      );

      setTimeout(async () => {
        // If you want to delete the push token before logout
        if (globalState.expoPushToken && globalState.teamNo) {
          await deletePushToken(globalState.expoPushToken, globalState.teamNo);
        }
        Logout();
        router.replace("/");
      }, 3000);
    };

    socket.on("new_game", handleNewGame);

    // Cleanup listener on component unmount
    return () => {
      socket.off("new_game", handleNewGame);
    };
  }, [socket, globalState.expoPushToken, globalState.teamNo]);

  return (
    <PageWrapper>
      <Tabs
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#BBB",
          tabBarStyle: {
            backgroundColor: "#201402",
            borderTopWidth: 1,
            borderTopColor: "#000",
            height:
              globalState.userMode === "admin"
                ? null
                : Platform.OS === "ios"
                  ? "12%"
                  : "10%",

          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Home",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : "/dashboard",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.dashboard}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard_attacks"
          options={{
            title: "Wars",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : "/dashboard_attacks",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.swords}
                color={color}
                name="Wars"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: "Teams",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : "/teams",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.teams}
                color={color}
                name="Teams"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="countries"
          options={{
            title: "Countries",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : "/countries",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.countries}
                color={color}
                name="Countries"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="admins"
          options={{
            title: "Admins",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : "/admins",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.whistle}
                color={color}
                name="Admins"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#000" style="light" />
    </PageWrapper>
  );
};

export default TabsLayout;
