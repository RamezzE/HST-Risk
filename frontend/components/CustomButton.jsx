import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary opacity-90 rounded-xl min-h-[40px] flex flex-row justify-center items-center ${containerStyles}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-montez text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional: darkens the button when loading
            borderRadius: 10, // Adjust according to your button's rounded corners
          }}
        >
          <ActivityIndicator animating={isLoading} color="#fff" size="small" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
