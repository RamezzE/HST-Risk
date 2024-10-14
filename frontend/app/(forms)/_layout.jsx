import React, { useEffect, useContext } from "react";
import { Slot } from "expo-router";
import { StatusBar, Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";
import { KeyboardProvider, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import PageWrapper from "../../components/PageWrapper";

const FormsLayout = () => {
  const { globalState, socket, Logout } = useContext(GlobalContext);

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

    socket.on("new_game", handleNewGame);

    return () => {
      socket.off("new_game", handleNewGame);
    };
  }, [globalState]);

  return (
    <KeyboardProvider>
      <KeyboardAwareScrollView
        bottomOffset={175}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        overScrollMode="never"
      >
        <PageWrapper>
          <Slot />
        </PageWrapper>
      </KeyboardAwareScrollView>
      <StatusBar backgroundColor="#000" style="light" />
    </KeyboardProvider>
  );
};

export default FormsLayout;
