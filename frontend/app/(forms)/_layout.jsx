import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const FormsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="add_team"
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
          name="edit_territory"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add_territory"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default FormsLayout;
