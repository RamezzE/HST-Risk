import React, { useEffect, useContext } from "react";
import { Stack } from "expo-router";
import { StatusBar, Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";

const MiscLayout = () => {
  const { socket, Logout, expoPushToken, teamNo } = useContext(GlobalContext);

  useEffect(() => {
    const handleNewGame = () => {
      Alert.alert(
        "New Game",
        "A new game has started. You will be logged out automatically."
      );

      setTimeout(async () => {
        if (expoPushToken && teamNo) {
          await deletePushToken(expoPushToken, teamNo);
        }
        Logout();
        router.replace("/");
      }, 3000);
    };

    socket.on("new_game", handleNewGame);

    return () => {
      socket.off("new_game", handleNewGame);
    };
  }, [socket, expoPushToken, teamNo]);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="warzone"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="warzones"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin_home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin_home2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="guest_choose_team"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="subteams"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default MiscLayout;
