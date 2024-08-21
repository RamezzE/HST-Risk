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
