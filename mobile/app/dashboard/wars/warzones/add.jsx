import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { router } from "expo-router"; // Importing router directly
import { create_warzone } from "../../../../api/warzone_functions"; // Import create_warzone function
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

import BackButton from "../../../../components/BackButton";
import FormField from "../../../../components/FormField";
import CustomButton from "../../../../components/CustomButton";
import FormWrapper from "../../../../components/FormWrapper";

const AddWarzone = () => {
  const [form, setForm] = useState({
    name: "",
    wars: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateWarzone = () => {
    const result = {
      success: false,
      errorMsg: "",
    };

    if (!form.name) {
      result.errorMsg = "Warzone name is required";
      return result;
    }

    if (!form.wars.length) {
      result.errorMsg = "At least one war is required";
      return result;
    }

    // Trim each war's name and location
    const wars = form.wars.map((war) => ({
      ...war,
      name: war.name.trim(),
      location: war.location.trim(),
    }));
    setForm({ ...form, wars });

    // Check for duplicate wars
    const warNames = wars.map((war) => war.name);
    const uniqueWars = new Set(warNames);
    if (uniqueWars.size !== warNames.length) {
      result.errorMsg = "Duplicate wars are not allowed";
      return result;
    }

    if (warNames.some((name) => !name)) {
      result.errorMsg = "Empty war names are not allowed";
      return result;
    }

    const warLocations = wars.map((war) => war.location);

    return { success: true };
  };

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const validationResult = validateWarzone();
      if (!validationResult.success) {
        Alert.alert("Error", validationResult.errorMsg);
        return;
      }

      // Ensure each war has a name, location, and an available property set to 'true'
      const updatedWars = form.wars.map((war) => ({
        ...war,
        available: true,
        location: war.location.trim(),
      }));

      // Update the form with the new wars array
      const updatedForm = { ...form, wars: updatedWars };

      const response = await create_warzone(updatedForm);

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Warzone created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create warzone");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWarChange = (index, field, newValue) => {
    const newWars = [...form.wars];
    newWars[index][field] = newValue;
    setForm({ ...form, wars: newWars });
  };

  const removeWar = (index) => {
    const newWars = form.wars.filter((_, i) => i !== index);
    setForm({ ...form, wars: newWars });
  };

  const addWar = () => {
    setForm({ ...form, wars: [...form.wars, { name: "", location: "" }] });
  };


  return (

    <FormWrapper>
      <View className="justify-center my-6 px-4 w-full min-h-[82.5vh]">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => router.back()}
        />
        <Text className="mt-10 py-1 pt-2 font-montez text-black text-5xl text-center">
          Add Warzone
        </Text>
        <FormField
          title="Warzone Name"
          value={form.name}
          otherStyles="mt-7"
          handleChangeText={(e) => setForm({ ...form, name: e })}
        />

        {form.wars.map((war, index) => (
          <View key={index} className="flex flex-row mt-4">
            <FormField
              title={`War ${index + 1} Name`}
              value={war.name}
              handleChangeText={(e) => handleWarChange(index, "name", e)}
              otherStyles="flex-1 mr-3"
            />
            <FormField
              title={`Location`}
              value={war.location}
              handleChangeText={(e) =>
                handleWarChange(index, "location", e)
              }
              otherStyles="flex-1 mr-3"
            />
            <TouchableOpacity
              onPress={() => removeWar(index)}
              className="self-end bg-red-700 mt-2 p-2 rounded-md"
            >
              <Icon name="trash" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        <CustomButton
          handlePress={addWar}
          title={"Add War"}
          containerStyles={"mt-7 p-3 bg-blue-700"}
          textStyles={"text-xl font-pregular"}
        />

        <CustomButton
          title="Create Warzone"
          handlePress={() => submit()}
          containerStyles="mt-7 p-3 bg-green-700"
          textStyles={"text-3xl"}
          isLoading={isSubmitting}
        />
      </View>
    </FormWrapper>
  );
};

export default AddWarzone;
