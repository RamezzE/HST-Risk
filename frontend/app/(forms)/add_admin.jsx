import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import FormField from "../../components/FormField";
import DropDownField from "../../components/DropDownField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { get_wars } from "../../api/warzone_functions";
import { add_admin } from "../../api/admin_functions";

import { images } from "../../constants";

import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";

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
  const [isRefreshing, setIsRefreshing] = useState(true);

  const [wars, setWars] = useState([]);
  const [error, setError] = useState(null);

  const submit = async () => {
    setIsSubmitting(true);

    var result = validateAddAdmin(form.name, form.password, form.war);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    try {
      const response = await add_admin(
        form.name.trim(),
        form.password.trim(),
        form.war.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Admin added successfully");
      router.replace("/admins");
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

  const insets = useSafeAreaInsets()

  if (isRefreshing) {
    return (
      <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="flex-1 bg-black">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Loader />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="bg-black h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
            <BackButton
              style="w-[20vw]"
              color="black"
              size={32}
              onPress={() => router.dismiss(1)}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
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

export default AddAdmin;
