import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const MiscLayout = () => {
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
          name="admin_home"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default MiscLayout;
