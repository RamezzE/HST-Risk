import { Stack } from "expo-router";

const MiscLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
          animation: "none",
        },
      }}
    >
      <Stack.Screen name="admin_home" />
      <Stack.Screen name="guest_choose_team" />
    </Stack>
  );
};

export default MiscLayout;
