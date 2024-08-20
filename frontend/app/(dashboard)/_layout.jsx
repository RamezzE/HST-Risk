import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from 'react-native';

import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className = 'items-center justify-center'>
        <Image
          source = { icon }
          resizeMode = "contain"
          tintColor = {color}
          className = {Platform.OS === 'ios' ? 'w-6 h-6 mt-2' : 'w-6 h-6 '}
        />
        <Text
          className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style = {{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions = {{
          tabBarShowLabel : false,
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#BBB",
          tabBarStyle: {
            backgroundColor: "#201402",
            borderTopWidth: 1,
            borderTopColor: "#000",
            height: Platform.OS === 'ios' ? '12%' : '10%',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Home",
            headerShown: false,
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
    </>
  );
};

export default TabsLayout;
