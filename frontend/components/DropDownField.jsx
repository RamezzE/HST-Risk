import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Button,
  Platform,
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
  const [selectedValue, setSelectedValue] = useState(value || ""); // Initial value can be empty
  const [isPickerVisible, setPickerVisible] = useState(false); // For showing modal on iOS
  const pickerRef = useRef(null); // Reference to hidden picker for Android

  useEffect(() => {
    if (value === "") {
      setSelectedValue(""); // Keep it blank for placeholder
    }
  }, [value]);

  const openPicker = () => {
    if (Platform.OS === "ios") {
      setPickerVisible(true); // Open modal for iOS
    } else if (pickerRef.current) {
      pickerRef.current.focus(); // Open hidden picker on Android
    }
  };

  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue); // Update selected value
    handleChange(itemValue); // Pass new value to parent
  };

  const closePicker = () => {
    if (!selectedValue || selectedValue === "") {
      setSelectedValue(items[0]?.value); // Choose first item if no change was made
    }
    handleChange(selectedValue || items[0]?.value); // Pass new value or first item to parent
    setPickerVisible(false); // Close modal for iOS
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-montez text-black text-3xl">{title}</Text>

      <View
        className={`w-full h-16 bg- rounded-md flex flex-row items-center`}
        style={{ backgroundColor: "rgba(75, 50, 12, 0.5)" }}
      >
        <TouchableWithoutFeedback onPress={openPicker}>
          <View
            style={{ flex: 1 }}
            className="w-full h-16 px-4 rounded-md flex flex-row items-center"
          >
            <TextInput
              className="text-white font-psemibold text-[16px]"
              value={
                selectedValue === "" ? placeholder : selectedValue // Display placeholder if empty
              }
              placeholder={placeholder}
              placeholderTextColor="#F2E9D0"
              editable={false} // Disable direct editing
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {Platform.OS === "ios" ? (
        <Modal
          visible={isPickerVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <Picker
                selectedValue={selectedValue}
                onValueChange={handleValueChange}
              >
                {items.map((item, index) => (
                  <Picker.Item
                    label={item.label}
                    value={item.value}
                    key={index}
                  />
                ))}
              </Picker>
              <Button title="Done" onPress={closePicker} />
            </View>
          </View>
        </Modal>
      ) : (
        // Hidden Picker for Android
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
      )}
    </View>
  );
};

export default DropdownField;
