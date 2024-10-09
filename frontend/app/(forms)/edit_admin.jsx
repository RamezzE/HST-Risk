import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
} from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";

import { get_wars } from "../../api/warzone_functions";

import { update_admin, delete_admin } from "../../api/admin_functions";

import BackButton from "../../components/BackButton";

import Loader from "../../components/Loader";

const validateEditAdmin = (name, password, war, type) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!name || !password) {
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

const EditAdmin = () => {
  const local = useLocalSearchParams();

  const [form, setForm] = useState({
    name: local.name,
    password: local.password,
    war: local.war,
    type: local.type,
  });

  const [wars, setWars] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const submit = async () => {
    setIsSubmitting(true);

    var result = validateEditAdmin(
      form.name,
      form.password,
      form.war,
      form.type
    );

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await update_admin(
        local.name.trim(),
        form.name.trim(),
        form.password.trim(),
        form.war.trim(),
        form.type.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Admin updated successfully");

      router.navigate("/admins");
    } catch (error) {
      Alert.alert("Error", "Failed to update admin");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAdmin = async () => {
    setIsSubmitting(true);

    try {
      const response = await delete_admin(local.name);

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Admin deleted successfully");

      router.navigate("/admins");
    } catch (error) {
      Alert.alert("Error", "Error deleting admin");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await get_wars();
      if (response) {
        setWars(response);
      } else {
        Alert.alert("Error", response.errorMsg);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteAdminAlert = async () => {
    Alert.alert(
      "Delete Admin",
      `Are you sure you want to delete admin ${local.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteAdmin();
          },
        },
      ]
    );
  };


  if (isRefreshing) {
    return (
          <Loader />
    );
  }

  return (

    <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
      <BackButton
        style="w-[20vw]"
        size={32}
        onPress={() => router.navigate("/admins")}
      />
      <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
        Edit Admin
      </Text>
      <FormField
        title="Admin Name"
        value={form.name}
        otherStyles="mt-7"
        handleChangeText={(e) => setForm({ ...form, name: e })}
      // editable={false}
      />

      <FormField
        title="Password"
        value={form.password}
        handleChangeText={(e) => setForm({ ...form, password: e })}
        otherStyles="mt-7"
        textStyles=""
      />

      <DropDownField
        title="Admin Type"
        value={form.type}
        placeholder="Select Type"
        items={[
          { label: "Wars", value: "Wars" },
          { label: "Missions", value: "Missions" },
        ]}
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
        title="Update Admin"
        handlePress={() => submit()}
        containerStyles="mt-7 p-3 bg-green-800"
        textStyles={"text-3xl"}
        isLoading={isSubmitting}
      />
      <CustomButton
        title="Delete Admin"
        handlePress={() => deleteAdminAlert()}
        containerStyles="mt-7 p-3 bg-red-800"
        textStyles={"text-3xl"}
        isLoading={isSubmitting}
      />
    </View>
  );
};

export default EditAdmin;
