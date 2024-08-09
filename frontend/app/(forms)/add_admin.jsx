import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { get_wars } from "../../api/country_functions";
import { add_admin } from "../../api/admin_functions";

const validateAddAdmin = (name, war) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!war || !name) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  result.success = true;
  return result;
};

const AddAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    war: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wars, setWars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const result = await get_wars();
        setWars(result);

        const result2 = await get_admins();
        setAdmins(result2);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const submit = async () => {
    var result = validateAddAdmin(form.name, form.password, form.war);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await add_admin(form.name, form.password, form.war);
      Alert.alert("Success", "Admin added successfully");
      router.push("/admins");
      
    } catch (error) {
      Alert.alert("Error", "Error adding admin");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[75vh] px-4 my-6">
          <Text className="text-4xl text-white font-bold text-center">
            Add Admin
          </Text>
          <FormField
            title="Admin Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Password"
            value={form.description}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <DropDownField
            title="Assigned War"
            value={form.war}
            placeholder="Select War"
            items={wars.map((war) => ({
              label: `${war.name}`,
              value: war.name,
            }))}
            handleChange={(e) => setForm({ ...form, war: e })}
            otherStyles="mt-7"
          />

          <View className="w-full flex flex-row items-center justify-evenly">
            <CustomButton
              title="Cancel"
              handlePress={() => router.push("/admins")}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Add Admin"
              handlePress={submit}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAdmin;
