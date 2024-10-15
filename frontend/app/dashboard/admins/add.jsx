import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";

import { router } from "expo-router";

import { get_wars } from "../../../api/warzone_functions";
import { add_admin } from "../../../api/admin_functions";

import BackButton from "../../../components/BackButton";
import Loader from "../../../components/Loader";
import DropDownField from "../../../components/DropDownField";
import CustomButton from "../../../components/CustomButton";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";

const validateAddAdmin = (name, war, type) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!name) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  if (!war && type == "Wars") {
    result.errorMsg = "Please select a war";
    return result;
  }

  result.success = true;
  return result;
};

const AddAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    war: "",
    type: "Wars",
    // password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const [wars, setWars] = useState([]);
  const [error, setError] = useState(null);

  const submit = async () => {
    setIsSubmitting(true);

    var result = validateAddAdmin(form.name, form.war, form.type);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await add_admin(
        form.name.trim(),
        form.war.trim(),
        form.type.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Admin added successfully");
      router.replace("/dashboard/admins");
    } catch (error) {
      Alert.alert("Error", "Error adding admin");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    setError(null);

    try {
      const result = await get_wars();
      setWars(result);

      const result2 = await get_admins();
      setAdmins(result2);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  if (isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <FormWrapper>
      <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => router.navigate("/dashboard/admins")}
        />
        <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
          Add Admin
        </Text>

        <FormField
          title="Admin Name"
          value={form.name}
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles="mt-7"
        />

        <DropDownField
          title="Admin Type"
          value={form.type}
          placeholder="Select War"
          items={["Wars", "Missions"].map((type) => ({
            label: type,
            value: type,
          }))}
          handleChange={(e) => setForm({ ...form, type: e })}
          otherStyles="mt-7"
        />

        {Array.isArray(wars) && form.type == "Wars" && (
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
        )}

        <CustomButton
          title="Add Admin"
          handlePress={() => submit()}
          containerStyles="mt-7 p-3 bg-green-800"
          textStyles={"text-3xl"}
          isLoading={isSubmitting}
        />
      </View>
    </FormWrapper>
  );
};

export default AddAdmin;
