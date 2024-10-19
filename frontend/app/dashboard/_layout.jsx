import { useContext } from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { GlobalContext } from "../../context/GlobalProvider"; 
import { icons } from "../../constants";
import PageWrapper from "../../components/PageWrapper";
import TabIcon from "../../components/TabIcon";

const TabsLayout = () => {
  const { globalState } = useContext(GlobalContext); 

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
