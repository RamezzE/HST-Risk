import { Stack } from "expo-router";

const FormsLayout = () => {
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
            <Stack.Screen name="sign_in" />
        </Stack>
    );
};

export default FormsLayout;
