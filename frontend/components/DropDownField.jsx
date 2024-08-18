import React, { createRef, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
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
  const pickerRef = useRef(null);

  const openPicker = () => {
    console.log("Opening picker");
    console.log(pickerRef.current);
    pickerRef.current.togglePicker(false); // This will open the picker programmatically
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-montez text-black text-3xl">{title}</Text>

      <View
        className="w-full h-16 px-4 bg- rounded-md focus:border-secondary flex flex-row items-center"
        style={{ backgroundColor: "rgba(75, 50, 12, 0.5)" }} // Transparent background
      >
        <TouchableWithoutFeedback onPress={openPicker}>
          <View style={{ flex: 1 }}>
            <TextInput
              className="text-white font-montez text-2xl"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#F2E9D0"
              editable={false} // Disable editing
              pointerEvents="none" // Disable any touch events on the TextInput
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>

        <RNPickerSelect
          ref={pickerRef} // Attach ref to the RNPickerSelect
          onValueChange={handleChange}
          items={items}
          // value={value}
          style={pickerSelectStyles}
          placeholder={{ label: placeholder, value: "" }} // Pass the placeholder as an object
          placeholderTextColor="#F2E9D0"
          {...props}
        />
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 1,
    paddingVertical: 12,
    // paddingHorizontal: 10,
    color: "rgba(0,0,0,0.1)",
    // paddingRight: 30,
    flex: 1,
    fontFamily: "Poppins-SemiBold",
  },
  inputAndroid: {
    fontSize: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "rgba(0,0,0,0.1)",
    // paddingRight: 30,
    flex: 1,
    fontFamily: "Poppins-SemiBold",
  },
  placeholder: {
    color: "rgba(0,0,0,0)",
    fontSize: 2,
    fontFamily: "Poppins-SemiBold",
    paddingLeft:  25,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default DropdownField;
