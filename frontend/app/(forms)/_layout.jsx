import React, { useEffect, useContext } from "react";
import { Slot } from "expo-router";
import { StatusBar, Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";
import FormWrapper from "../../components/FormWrapper";

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
      <FormWrapper >
        <Slot />
      </FormWrapper>
      <StatusBar backgroundColor="#000" style="light" />
    </>
  );
};

export default FormsLayout;
