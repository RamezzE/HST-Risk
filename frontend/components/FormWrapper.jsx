import { View, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const FormWrapper = ({ children }) => {

    const insets = useSafeAreaInsets();

    return (
        <KeyboardAwareScrollView
            bottomOffset={175}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
            overScrollMode="never"
        >
            <View
                style={{
                    paddingTop: insets.top,
                    paddingRight: insets.right,
                    paddingLeft: insets.left,
                }}
                className="bg-black h-full"
            >
                <ImageBackground
                    source={images.background}
                    style={{ resizeMode: "cover" }}
                    className="min-h-[100vh]"
                >
                    {children}
                </ImageBackground>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default FormWrapper;
