import { useSafeAreaInsets } from "react-native-safe-area-context";

const useTabScreenOptions = () => {
    const insets = useSafeAreaInsets();

    return {
        tabBarIconStyle: {
            height: "100%",
            width: "100%",
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "#BBB",
        sceneStyle: {
            backgroundColor: "transparent",
        },
        tabBarStyle: {
            backgroundColor: "#201402",
            borderTopWidth: 1,
            borderTopColor: "#000",
            height: 80,
            paddingBottom: insets.bottom / 2,
            paddingHorizontal: 15,
        },
        animation: "none",
    };
};

export default useTabScreenOptions;