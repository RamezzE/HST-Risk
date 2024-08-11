import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { get_wars } from "../../api/warzone_functions";
import { add_admin } from "../../api/admin_functions";

import BackButton from "../../components/BackButton";

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
      const response = await add_admin(form.name.trim(), form.password.trim(), form.war.trim());
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
      <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">

      <BackButton style="w-[20vw]" color="white" size={32} path="/admins" />
        <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
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

            <CustomButton
              title="Add Admin"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAdmin;
