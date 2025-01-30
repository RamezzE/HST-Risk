import { View, Text, Image, Platform } from 'react-native'

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="top-4 absolute justify-center items-center gap-y-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={Platform.OS === "ios" ? "w-6 h-6 mt-2" : "w-6 h-6"}
            />
            <Text
                className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    );
};

export default TabIcon;