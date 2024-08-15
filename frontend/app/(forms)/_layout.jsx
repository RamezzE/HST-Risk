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
          name="add_admin"
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
          name="edit_country"
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
