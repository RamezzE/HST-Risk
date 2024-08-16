import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { icons } from "../../constants";

import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
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
  const { teamNo } = useContext(GlobalContext);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          // tabBarActiveTintColor: "#F2E9D0",
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#BBB",
          tabBarStyle: {
            // backgroundColor: "#4b320c",
            backgroundColor: "#201402",
            borderTopWidth: 1,
            borderTopColor: "#000",
            height: '12%',
          },
        }}
      >
        <Tabs.Screen
          name="guest_home"
          options={{
            title: "Map",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.globe}
                color={color}
                name="Map"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="guest_team_attacks"
          options={{
            title: "Team Attacks",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.swords}
                color={color}
                name="Team Attacks"
                focused={focused}
              />
            ),
          }}
        />
        
      </Tabs>
      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default TabsLayout;
