import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";
import BackButton from "../../components/BackButton";
import { images } from "../../constants";

import { update_setting } from "../../api/settings_functions";

const EditSetting = () => {
  const insets = useSafeAreaInsets();
  const local = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);



  console.log(local);

  // Ensure options is an array
  const [form, setForm] = useState({
    name: local.name || '',
    value: local.value || '',
    options: local.options ? JSON.parse(decodeURIComponent(local.options)) : [],
  });

  const validateEditSetting = () => {
    if (form.name === '') {
      Alert.alert('Error', 'Setting name is required');
      return false;
    }

    if (form.value === '') {
      Alert.alert('Error', 'Setting value is required');
      return false;
    }

    // Check if value is a number and options is not empty

    if (form.options != [] && isNaN(form.value.trim())) {
      Alert.alert('Error', `${form.name} value must be a number`);
      return false;
    }
  }

  const submit = async () => {
    try {
      setIsSubmitting(true);

      if (!validateEditSetting()) {
        setIsSubmitting(false);
        return;
      }

      const result = await update_setting(form.name, form.value.trim());

      if (result.errorMsg) {
        Alert.alert('Error', result.errorMsg);
      } else {
        Alert.alert('Success', 'Setting updated successfully');
        router.navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not update setting');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // fetchData();
  }, []);

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
              style="w-[20vw] mb-4"
              size={32}
              onPress={() => {
                router.navigate('/dashboard');
              }}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Edit Setting
            </Text>

            <FormField
              title="Setting Name"
              value={form.name}
              otherStyles="mt-7"
              editable={false}
            />

            <FormField
              title="Setting Value"
              value={form.value}
              handleChangeText={(e) => setForm({ ...form, value: e })}
              otherStyles="mt-7"
              editable={form.options.length === 0}
            />

            {form.options.length > 0 && (
              <DropDownField
                title="Value Options"
                value={form.value}
                placeholder="Select Value"
                items={form.options.map((option) => ({
                  label: `${option}`,
                  value: `${option}`,
                }))}
                handleChange={(e) => setForm({ ...form, value: e })}
                otherStyles="mt-7"
              />
            )}

            <CustomButton
              title="Update Setting"
              handlePress={submit}
              containerStyles="mt-7 p-3 bg-green-800"
              textStyles="text-3xl"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default EditSetting;
