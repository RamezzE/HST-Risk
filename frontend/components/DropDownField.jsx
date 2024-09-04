import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const DropdownField = ({
  title,
  value,
  placeholder,
  items,
  handleChange,
  otherStyles,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(value || items[0]?.value); // Set initial value
  const pickerRef = useRef(null); // Reference to the hidden picker

  useEffect(() => {
    if (!value && items.length > 0) {
      setSelectedValue(items[0].value); // Default to the first item
    }
  }, [items, value]);

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.focus(); // Open the hidden picker
    }
  };

  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue); // Update selected value
    handleChange(itemValue); // Pass the new value to parent
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-montez text-black text-3xl">{title}</Text>

      <View
        className={`w-full h-16 bg- rounded-md flex flex-row items-center`}
        style={{ backgroundColor: "rgba(75, 50, 12, 0.5)" }} // Transparent background
      >
        <TouchableWithoutFeedback onPress={openPicker}>
          <View
            style={{ flex: 1 }}
            className="w-full h-16 px-4 rounded-md flex flex-row items-center"
          >
            <TextInput
              className="text-white font-psemibold text-[16px]"
              value={selectedValue ? selectedValue : placeholder}
              placeholder={placeholder}
              placeholderTextColor="#F2E9D0"
              editable={false} // Disable editing
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Hidden Picker */}
      <Picker
        ref={pickerRef}
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        style={{ opacity: 0, height: 0 }} // Make the picker invisible
        {...props}
      >
        {items.map((item, index) => (
          <Picker.Item label={item.label} value={item.value} key={index} />
        ))}
      </Picker>
    </View>
  );
};

export default DropdownField;
