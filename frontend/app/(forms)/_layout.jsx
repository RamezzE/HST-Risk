import React, { useEffect, useContext } from "react";
import { Stack } from "expo-router";
import { StatusBar, Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";

const FormsLayout = () => {
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
          name="sign_in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add_admin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add_attack"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add_warzone"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_admin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_team"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_subteam"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_country"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_setting"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_warzone"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default FormsLayout;
