import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import Timer from "../../components/Timer";
import { router } from "expo-router";
import { GlobalContext } from "../../context/GlobalProvider"; // Import GlobalContext
import CustomButton from "../../components/CustomButton";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
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

const StickyPopup = ({ currentDefence }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentDefence.length > 0) {
      setIsVisible(true); // Show popup when new defenses are added
    }
  }, [currentDefence]);

  if (!isVisible || !currentDefence || currentDefence.length === 0) return null; // Don't render anything if no defenses or popup is hidden

  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        top: Platform.OS === "ios" ? 160 : 160,
        backgroundColor: "rgba(255,255,255,0.75)",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        zIndex: 10,
      }}
    >
      <View className="flex flex-row-reverse justify-start items-start">
        <CustomButton 
          title="X" 
          textStyles="text-white font-pbold text-sm"
          containerStyles={"p-0 m-0 min-w-[20px] min-h-[20px] bg-red-800"}
          handlePress={() => setIsVisible(false)} 
        />
        <View className="flex flex-col">
          {currentDefence.map((defence) => (
            <View key={defence._id} style={{ marginBottom: 10}}>
              <TouchableOpacity
                onPress={() => router.navigate("/guest_team_attacks")}
              >
                <Text className="font-pbold text-red-700 text-l">
                  {defence.attacking_team} {defence.attacking_subteam} VS{" "}
                  {defence.defending_team} {defence.defending_subteam}
                </Text>
                <Text className="font-pbold text-red-700 text-[14px]">
                  {defence.war}
                </Text>
                <Timer
                  attack_id={defence._id}
                  textStyles={"font-pbold text-red-700 text-[16px]"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const TabsLayout = () => {
  const { currentDefence } = useContext(GlobalContext); // Access currentDefence from GlobalContext

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#BBB",
          tabBarStyle: {
            backgroundColor: "#201402",
            borderTopWidth: 1,
            borderTopColor: "#000",
            height: Platform.OS === "ios" ? "12%" : "10%",
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
          name="guest_teams"
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
          name="guest_countries"
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
      </Tabs>

      {/* Conditionally render the StickyPopup for defenses */}
      <StickyPopup currentDefence={currentDefence} />

      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default TabsLayout;
