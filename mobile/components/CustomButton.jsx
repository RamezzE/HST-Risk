import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.7}
      className={`bg-primary opacity-90 rounded-xl min-h-[40px] flex flex-row justify-center items-center ${
        isPressed ? "border-[0.5px] border-secondary" : ""
      } ${containerStyles}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-montez text-2xl ${textStyles}`}>
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
