import { StatusBar } from "expo-status-bar";
import { View, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../constants';

const PageWrapper = ({ children }) => {
    const insets = useSafeAreaInsets();

    return (
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
            <StatusBar backgroundColor="#000" style="light" />
        </View>
    );
};

export default PageWrapper;
