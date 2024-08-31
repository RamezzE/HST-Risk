import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
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
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || items[0]?.value); // Set initial value

  useEffect(() => {
    if (!value && items.length > 0) {
      setSelectedValue(items[0].value); // Default to the first item
    }
  }, [items, value]);

  const openPicker = () => {
    setSelectedValue(value || items[0]?.value); // Reset to current value or default to first item
    setPickerVisible(true);
  };

  const closePicker = () => {
    handleChange(selectedValue); // Set the value when closing
    setPickerVisible(false);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-montez text-black text-3xl">{title}</Text>

      <View
        className="w-full h-16 bg- rounded-md focus:border-secondary flex flex-row items-center"
        style={{ backgroundColor: "rgba(75, 50, 12, 0.5)" }} // Transparent background
      >
        <TouchableWithoutFeedback onPress={openPicker}>
          <View
            style={{ flex: 1 }}
            className="w-full h-16 px-4 rounded-md focus:border-secondary flex flex-row items-center"
          >
            <TextInput
              className="text-white font-psemibold text-[16px]"
              value={value ? value : placeholder}
              placeholder={placeholder}
              placeholderTextColor="#F2E9D0"
              editable={false} // Disable editing
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
        className="bg-black"
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => {
                setSelectedValue(itemValue);
              }}
              style={{ backgroundColor: "#F5F5F5" }} // Background color for the picker
              {...props}
            >
              {items.map((item, index) => (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={index}
                />
              ))}
            </Picker>
            <TouchableWithoutFeedback onPress={closePicker}>
              <View style={styles.doneButton}>
                <Text style={styles.doneText}>Done</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  textInput: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "montez",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  doneText: {
    fontSize: 18,
    color: "#007AFF",
    fontFamily: "Poppins-SemiBold",
  },
});

export default DropdownField;
