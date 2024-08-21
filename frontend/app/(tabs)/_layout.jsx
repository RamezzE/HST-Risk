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

const StickyPopup = ({ currentAttack, currentDefence }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentAttack || (currentDefence && currentDefence.length > 0)) {
      setIsVisible(true); // Show popup when new attacks or defenses are added
    }
  }, [currentAttack, currentDefence]);

  if (!isVisible || (!currentAttack && (!currentDefence || currentDefence.length === 0))) {
    return null; // Don't render anything if no attack, defense, or popup is hidden
  }

  const timers = [];

  if (currentAttack) {
    timers.push(
      <View key={currentAttack._id} style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.navigate("/team_attacks")}>
          <Text className="font-pbold text-red-800 text-l">
            {currentAttack.attacking_team} {currentAttack.attacking_subteam} VS{" "}
            {currentAttack.defending_team} {currentAttack.defending_subteam}
          </Text>
          <Text className="font-pbold text-red-800 text-[14px]">
            {currentAttack.war}
          </Text>
          <Timer
            attack_id={currentAttack._id}
            textStyles={"font-pbold text-red-800 text-[16px]"}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (currentDefence && currentDefence.length > 0) {
    currentDefence.forEach((defence) => {
      timers.push(
        <View key={defence._id} style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.navigate("/team_attacks")}>
            <Text className="font-pbold text-blue-800 text-l">
              {defence.attacking_team} {defence.attacking_subteam} VS{" "}
              {defence.defending_team} {defence.defending_subteam}
            </Text>
            <Text className="font-pbold text-blue-800 text-[14px]">
              {defence.war}
            </Text>
            <Timer
              attack_id={defence._id}
              textStyles={"font-pbold text-blue-800 text-[16px]"}
            />
          </TouchableOpacity>
        </View>
      );
    });
  }

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
        {timers}

        </View>
      </View>
    </View>
  );
};


const TabsLayout = () => {
  const { currentAttack, currentDefence } = useContext(GlobalContext); // Access currentAttack and currentDefence from GlobalContext

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
          name="home"
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
          name="attack"
          options={{
            title: "Attack",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.sword}
                color={color}
                name="Attack"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="team_attacks"
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
          name="teams_user"
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
          name="countries_user"
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

      {/* Conditionally render the StickyPopup */}
      {(currentAttack || currentDefence.length > 0) && (
        <StickyPopup
          currentAttack={currentAttack}
          currentDefence={currentDefence}
        />
      )}

      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default TabsLayout;
