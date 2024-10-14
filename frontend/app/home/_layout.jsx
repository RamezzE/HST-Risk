import React, { useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { router } from "expo-router";
import { GlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { get_all_attacks } from "../../api/attack_functions";
import { deletePushToken } from "../../api/user_functions";
import _ from "lodash";
import StickyPopup from "../../components/StickyPopup";

import PageWrapper from './../../components/PageWrapper';

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

const TabsLayout = () => {

  const { globalState, socket, globalDispatch, Logout } = useContext(GlobalContext);

  const fetchData = async () => {
    try {
      const attacksResult = await get_all_attacks();

      if (!attacksResult || attacksResult.length == 0 || attacksResult == []) return;

      const matchingAttack = attacksResult.find(
        (attack) =>
          attack.attacking_team === globalState.teamNo &&
          attack.attacking_subteam === globalState.subteam
      );

      const matchingDefenses = attacksResult.filter(
        (attack) => attack.defending_team.toString() === globalState.teamNo.toString()
      );

      if (!_.isEqual(matchingAttack, globalState.currentAttack) && globalState.subteam !== "")
        globalDispatch({ type: "SET_CURRENT_ATTACK", payload: matchingAttack });

      if (!_.isEqual(matchingDefenses, globalState.currentDefence))
        globalDispatch({ type: "SET_CURRENT_DEFENCE", payload: matchingDefenses });

    } catch (err) {
      console.error("Failed to fetch attacks:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {

      fetchData();

      socket.on("new_attack", (newAttack) => {
        if (newAttack.defending_team.toString() === globalState.teamNo.toString())
          globalDispatch({ type: "ADD_CURRENT_DEFENCE", payload: newAttack });

        if (globalState.subteam !== "") {
          if (
            newAttack.attacking_team.toString() === globalState.teamNo.toString() &&
            newAttack.attacking_subteam.toString() === globalState.subteam.toString()
          )
            globalDispatch({ type: "SET_CURRENT_ATTACK", payload: newAttack });
        }
      });

      socket.on("remove_attack", (attackId) => {
        globalDispatch({
          type: SET_CURRENT_DEFENCE,
          payload: currentDefence.filter((attack) => attack._id !== attackId),
        });

        globalDispatch({
          type: SET_CURRENT_ATTACK,
          payload: currentAttack && currentAttack._id === attackId ? null : currentAttack,
        });
      });

      socket.on("new_game", () => {
        Alert.alert(
          "New Game",
          "A new game has started. You will be logged out automatically."
        );

        setTimeout(async () => {
          deletePushToken(globalState.expoPushToken, globalState.teamNo);
          Logout();
          router.replace("/");
        }, 3000);
      });

      return () => {
        socket.off("new_attack");
        socket.off("remove_attack");
        socket.off("new_game");
      };
    }, [globalState.teamNo, globalState.subteam])
  );

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
            height: Platform.OS === "ios" ? "12%" : "10%",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Map",
            headerShown: false,
            backgroundColor: "transparent",
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
            href: globalState.subteam == "" ? null : undefined,
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
          name="wars"
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
      </Tabs>

      {/* {(globalState.currentAttack || globalState.currentDefence.length > 0) && ( */}
      <StickyPopup
        currentAttack={globalState.currentAttack}
        currentDefence={globalState.currentDefence}
        subteam={globalState.subteam}
      />
      {/* )} */}

    </PageWrapper>
  );
};

export default TabsLayout;
