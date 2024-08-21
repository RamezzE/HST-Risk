import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router"; // Importing router directly since we're not using local parameters
import BackButton from "../../components/BackButton";
import { images } from "../../constants";
import { create_warzone } from "../../api/warzone_functions"; // Import create_warzone function
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

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

    // Trim each war's name
    const wars = form.wars.map((war) => ({
      ...war,
      name: war.name.trim(),
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
      result.errorMsg = "Empty wars are not allowed";
      return result;
    }

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

      // Ensure each war has a name and an available property set to 'true'
      const updatedWars = form.wars.map((war) => ({
        ...war,
        available: true,
      }));

      // Update the form with the new wars array
      const updatedForm = { ...form, wars: updatedWars };

      const response = await create_warzone(updatedForm);

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Warzone created successfully");
      router.navigate("/warzones");
    } catch (error) {
      Alert.alert("Error", "Failed to create warzone");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWarChange = (index, newValue) => {
    const newWars = [...form.wars];
    newWars[index].name = newValue;
    setForm({ ...form, wars: newWars });
  };

  const removeWar = (index) => {
    const newWars = form.wars.filter((_, i) => i !== index);
    setForm({ ...form, wars: newWars });
  };

  const addWar = () => {
    setForm({ ...form, wars: [...form.wars, { name: "" }] });
  };

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
      className="bg-black h-full"
    >
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => router.navigate("/warzones")}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Add Warzone
            </Text>
            <FormField
              title="Warzone Name"
              value={form.name}
              otherStyles="mt-7"
              handleChangeText={(e) => setForm({ ...form, name: e })}
            />

            {form.wars.map((war, index) => (
              <View key={index} className="flex-row items-end mt-4">
                <FormField
                  title={`War ${index + 1}`}
                  value={war.name}
                  handleChangeText={(e) => handleWarChange(index, e)}
                  otherStyles="flex-1"
                />
                <TouchableOpacity
                  onPress={() => removeWar(index)}
                  className="bg-red-700 p-2 rounded-md ml-2"
                >
                  <Icon name="trash" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            <CustomButton
              handlePress={addWar}
              title={"Add War"}
              containerStyles={"mt-7 p-3 bg-blue-800"}
              textStyles={"text-xl font-pregular"}
            />

            <CustomButton
              title="Create Warzone"
              handlePress={() => submit()}
              containerStyles="mt-7 p-3 bg-green-800"
              textStyles={"text-3xl"}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AddWarzone;
