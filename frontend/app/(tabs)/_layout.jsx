import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import Timer from "../../components/Timer";
import { router } from "expo-router";
import { GlobalContext } from "../../context/GlobalProvider";
import CustomButton from "../../components/CustomButton";
import { useFocusEffect } from "@react-navigation/native";
import { get_all_attacks } from "../../api/attack_functions";
import { deletePushToken } from "../../api/user_functions";
import _ from "lodash";

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

const StickyPopup = ({ currentAttack, currentDefence, subteam }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentAttack || (currentDefence && currentDefence.length > 0)) {
      setIsVisible(true);
    }
  }, [currentAttack, currentDefence]);

  if (!isVisible) return null;

  if (
    !currentAttack &&
    (!currentDefence || currentDefence.length == 0) &&
    subteam != ""
  )
    return null;

  if (subteam == "" && currentDefence.length == 0) return null;

  const timers = [];

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

  // Show attack if subteam is not empty and an attack exists
  if (subteam !== "" && currentAttack) {
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

  if (timers.length === 0) {
    return null; // Don't render the popup if no timers are available
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
        <View className="flex flex-col">{timers}</View>
      </View>
    </View>
  );
};

const TabsLayout = () => {

  const {
    teamNo,
    subteam,
    currentAttack,
    setCurrentAttack,
    currentDefence,
    setCurrentDefence,
    socket,
    Logout,
    expoPushToken,
  } = useContext(GlobalContext);

  const fetchData = async () => {
    try {
      const attacksResult = await get_all_attacks();

      if (!attacksResult || attacksResult.length == 0 || attacksResult == []) return;

      const matchingAttack = attacksResult.find(
        (attack) =>
          attack.attacking_team === teamNo &&
          attack.attacking_subteam === subteam
      );

      const matchingDefenses = attacksResult.filter(
        (attack) => attack.defending_team.toString() === teamNo.toString()
      );

      if (!_.isEqual(matchingAttack, currentAttack) && subteam !== "")
        setCurrentAttack(matchingAttack);

      if (!_.isEqual(matchingDefenses, currentDefence))
        setCurrentDefence(matchingDefenses);
    } catch (err) {
      console.error("Failed to fetch attacks:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      
      fetchData();

      socket.on("new_attack", (newAttack) => {
        if (newAttack.defending_team.toString() === teamNo.toString())
          setCurrentDefence((prevDefences) => [...prevDefences, newAttack]);

        if (subteam !== "") {
          if (
            newAttack.attacking_team.toString() === teamNo.toString() &&
            newAttack.attacking_subteam.toString() === subteam.toString()
          )
            setCurrentAttack(newAttack);
        }
      });

      socket.on("remove_attack", (attackId) => {
        setCurrentDefence((prevDefences) =>
          prevDefences.filter((attack) => attack._id !== attackId)
        );
        setCurrentAttack((prevAttack) => {
          if (prevAttack && prevAttack._id === attackId) {
            return null;
          }
          return prevAttack;
        });
      });

      socket.on("new_game", () => {
        Alert.alert(
          "New Game",
          "A new game has started. You will be logged out automatically."
        );

        setTimeout(async () => {
          deletePushToken(expoPushToken, teamNo);
          Logout();
          router.replace("/");
        }, 3000);
      });

      return () => {
        socket.off("new_attack");
        socket.off("remove_attack");
        socket.off("new_game");
      };
    }, [teamNo, subteam])
  );

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
            href: subteam == "" ? null : "/attack",
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

      {/* {(currentAttack || currentDefence.length > 0) && ( */}
      <StickyPopup
        currentAttack={currentAttack}
        currentDefence={currentDefence}
        subteam={subteam}
      />
      {/* )} */}

      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default TabsLayout;
