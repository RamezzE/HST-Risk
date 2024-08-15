import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon set you prefer

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
      <Text className="font-montez text-black text-3xl">{title}</Text>

      <View 
      className="w-full h-16 px-4 bg- rounded-md focus:border-secondary flex flex-row items-center"
      style={{ backgroundColor: 'rgba(75, 50, 12, 0.5)' }} // Transparent background

      >
        <TextInput
          className="flex-1 text-white font-montez text-2xl"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#F2E9D0"
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
          placeholderTextColor="#F2E9D0"
          // Icon={() => {
          //   return <Icon name="arrow-drop-down" size={24} color="white" />;
          // }}
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
