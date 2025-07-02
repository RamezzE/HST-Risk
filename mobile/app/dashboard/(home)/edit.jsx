import React, { useState } from "react";
import { View, Text, Alert, } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import DropDownField from "../../../components/DropDownField";
import BackButton from "../../../components/BackButton";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import FormWrapper from "../../../components/FormWrapper";

import { update_setting } from "../../../api/settings_functions";

const EditSetting = () => {
  const local = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure options is an array
  const [form, setForm] = useState({
    name: local.name || "",
    value: local.value || "",
    options: local.options ? JSON.parse(decodeURIComponent(local.options)) : [],
  });

  const validateEditSetting = () => {
    const result = {
      success: true,
      errorMsg: "",
    };

    // Check if form.value is empty
    if (form.value.trim() === "") {
      result.success = false;
      result.errorMsg = `${form.name} value cannot be empty`;
      return result;
    }

    // Check if form.options is an empty array
    if (form.options.length === 0) {
      // If options is empty, value must be a number
      if (isNaN(form.value.trim())) {
        result.success = false;
        result.errorMsg = `${form.name} value must be a number`;
        return result;
      }
    }

    // If form.options is not empty, value can be a string
    result.success = true;
    return result;
  };

  const submit = async () => {
    try {
      setIsSubmitting(true);

      const validation = validateEditSetting();

      if (validation.success == false) {
        console.log("Validation failed");
        setIsSubmitting(false);
        Alert.alert("Error", validation.errorMsg);
        return;
      }

      const result = await update_setting(form.name, form.value.trim());

      if (result.errorMsg) {
        Alert.alert("Error", result.errorMsg);
      } else {
        Alert.alert("Success", "Setting updated successfully");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not update setting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <View className="justify-center my-6 px-4 w-full min-h-[82.5vh]">
        <BackButton
          style="w-[20vw] mb-4"
          size={32}
          onPress={() => {
            router.back();
          }}
        />
        <Text className="mt-10 py-1 pt-2 font-montez text-black text-5xl text-center">
          Edit Setting
        </Text>

        <FormField
          title="Setting Name"
          value={form.name}
          otherStyles="mt-7"
          editable={false}
        />

        {Array.isArray(form.options) && form.options.length > 0 ? (
          <DropDownField
            title="Setting Value"
            value={form.value}
            placeholder="Select Value"
            items={form.options.map((option) => ({
              label: `${option}`,
              value: `${option}`,
            }))}
            handleChange={(e) => setForm({ ...form, value: e })}
            otherStyles="mt-7"
          />
        ) : (
          <FormField
            title="Setting Value"
            value={form.value}
            handleChangeText={(e) => setForm({ ...form, value: e })}
            otherStyles="mt-7"
            keyboardType="numeric"
            editable={form.options.length === 0}
          />
        )}

        <CustomButton
          title="Update Setting"
          handlePress={submit}
          containerStyles="mt-7 p-3 bg-green-700"
          textStyles="text-3xl"
          isLoading={isSubmitting}
        />
      </View>
    </FormWrapper>
  );
};

export default EditSetting;
