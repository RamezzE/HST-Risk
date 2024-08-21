import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // or any other icon library

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  textStyles,
  editable = true, // Default to true if not provided
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine the background color based on the editable prop
  const backgroundColor = editable
    ? 'rgba(75, 50, 12, 0.5)'  // Regular background color
    : 'rgba(50, 30, 10, 0.5)'; // Darker background color for non-editable

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-black text-3xl font-montez">{title}</Text>

      <View
        className="w-full h-16 px-4 rounded-md flex flex-row items-center"
        style={{ backgroundColor }} // Apply the dynamic background color
      >
        <TextInput
          className={`flex-1 ${editable ? 'text-white' : 'text-gray-400'} font-psemibold text-[16px] ${textStyles}`} // Adjust text color based on editable
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#F2E9D0"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          editable={editable}  // Ensure TextInput is set to editable or not
          {...props}
        />

        {title === "Password" && editable && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={24}
              color="#F2E9D0"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
