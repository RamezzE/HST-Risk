import { Stack } from "expo-router";

const Layout = () => {

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "transparent",
                },
                animation: "none",
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="edit" />
        </Stack>
    );
};

export default Layout;
