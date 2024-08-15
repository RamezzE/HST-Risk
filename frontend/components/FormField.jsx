import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // or any other icon library

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-black text-3xl font-montez">{title}</Text>

      <View
        className="w-full h-16 px-4 rounded-md flex flex-row items-center"
        style={{ backgroundColor: 'rgba(75, 50, 12, 0.5)' }} // Transparent background
      >
        <TextInput
          className="flex-1 text-white font-montez text-3xl"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#F2E9D0"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
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
