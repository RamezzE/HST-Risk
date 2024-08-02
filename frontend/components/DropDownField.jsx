import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const DropdownField = ({
  title,
  value,
  placeholder,
  items,
  handleChange,
  otherStyles,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          // onChangeText={handleChange}
          editable={false}
          {...props}
        />

        <RNPickerSelect
          onValueChange={handleChange}
          items={items}
          value={value}
          style={pickerSelectStyles}
          placeholder={{ label: placeholder, value: null }}
          {...props}
        />

      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    flex: 1,
    fontFamily: "Poppins-SemiBold",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    flex: 1,
    fontFamily: "Poppins-SemiBold",
  },
  placeholder: {
    // color: '#7B7B8B',
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default DropdownField;
