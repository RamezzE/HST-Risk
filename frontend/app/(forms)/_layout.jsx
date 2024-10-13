import React, { useEffect, useContext } from "react";
import { Slot } from "expo-router";
import { StatusBar, Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";
import FormWrapper from "../../components/FormWrapper";

const FormsLayout = () => {
  const { globalState, Logout } = useContext(GlobalContext);

  useEffect(() => {
    const handleNewGame = () => {
      Alert.alert(
        "New Game",
        "A new game has started. You will be logged out automatically."
      );

      setTimeout(async () => {
        if (globalState.expoPushToken && globalState.teamNo) {
          await deletePushToken(globalState.expoPushToken, globalState.teamNo);
        }
        Logout();
        router.replace("/");
      }, 3000);
    };

    globalState.socket.on("new_game", handleNewGame);

    return () => {
      globalState.socket.off("new_game", handleNewGame);
    };
  }, [globalState.socket, globalState.expoPushToken, globalState.teamNo]);

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
