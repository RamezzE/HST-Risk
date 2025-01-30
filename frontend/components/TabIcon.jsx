import { View, Text, Image, Platform } from 'react-native';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="flex flex-col justify-center items-center gap-y-2 pb-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={Platform.OS === "ios" ? "w-6 h-6 mt-2" : "w-6 h-6"}
            />
            <Text
                className={`w-20 text-center ${focused ? "font-psemibold" : "font-pregular"} text-xs`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    );
};

export default TabIcon;
