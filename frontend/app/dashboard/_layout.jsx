import React, { useContext, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { Tabs } from "expo-router";
import { GlobalContext } from "../../context/GlobalProvider"; 
import { router } from "expo-router"; 

import { icons } from "../../constants";
import PageWrapper from "../../components/PageWrapper";
import TabIcon from "../../components/TabIcon";

import { Logout } from "../../helpers/AuthHelpers"

const TabsLayout = () => {
  const { globalState, globalDispatch, socket } = useContext(GlobalContext); 

  useEffect(() => {
    const handleNewGame = () => {
      Alert.alert(
        "New Game",
        "A new game has started. You will be logged out automatically."
      );

      setTimeout(async () => {
        Logout(globalDispatch, globalState.expoPushToken, globalState.teamNo);
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
          name="(home)"
          options={{
            title: "Home",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : undefined,
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
          name="wars"
          options={{
            title: "Wars",
            headerShown: false,
            href: globalState.userMode == "admin" ? null : undefined,
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
            href: globalState.userMode == "admin" ? null : undefined,
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
            href: globalState.userMode == "admin" ? null : undefined,
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
            href: globalState.userMode == "admin" ? null : undefined,
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
    </PageWrapper>
  );
};

export default TabsLayout;
