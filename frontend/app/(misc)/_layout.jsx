import { useEffect, useContext } from "react";
import { Slot } from "expo-router";
import { Alert } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { deletePushToken } from "../../api/user_functions";
import PageWrapper from "../../components/PageWrapper";
import { Logout } from "../../helpers/AuthHelpers";

const MiscLayout = () => {
  const { socket, globalState, globalDispatch } = useContext(GlobalContext);

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
        Logout(globalDispatch);
        router.replace("/");
      }, 3000);
    };

    socket.on("new_game", handleNewGame);

    return () => {
      socket.off("new_game", handleNewGame);
    };
  }, [socket, globalState.expoPushToken, globalState.teamNo]);

  return (
    <PageWrapper>
      <Slot />
    </PageWrapper>
  );
};

export default MiscLayout;
