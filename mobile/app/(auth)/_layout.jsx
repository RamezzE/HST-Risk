import { Stack } from "expo-router";
import FormWrapper from "../../components/FormWrapper";

const FormsLayout = () => {
    return (
        <FormWrapper>
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
        </FormWrapper>
    );
};

export default FormsLayout;
