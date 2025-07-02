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
            className="flex-1 bg-black"
        >

            <ImageBackground
                source={images.background}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="cover"
            >
                {children}
            </ImageBackground>

            <StatusBar backgroundColor="#000" style="light" />
        </View>
    );
};

export default PageWrapper;
