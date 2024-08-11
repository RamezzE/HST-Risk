import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";

import { get_wars } from "../../api/warzone_functions";

import { update_admin, delete_admin } from "../../api/admin_functions";

const validateEditAdmin = (name, password, war) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!name || !password || !war) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  result.success = true;
  return result;
};

const EditTeam = () => {
  const local = useLocalSearchParams();

  const [form, setForm] = useState({
    name: local.name,
    password: local.password,
    war: local.war,
  });

  const [wars, setWars] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
      }
    };

    fetchData();
  }, []);

  const deleteAdmin = async () => {
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
          onPress: async () => {
            setIsSubmitting(true);

            try {
              const response = await delete_admin(local.name);

              if (!response.success) {
                Alert.alert("Error", response.errorMsg);
                return;
              }

              Alert.alert("Success", "Admin deleted successfully");

              router.push("/admins");
              
            } catch (error) {
              Alert.alert("Error", "Error deleting admin");
              console.log(error);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const submit = async () => {
    var result = validateEditAdmin(form.name, form.password, form.war);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await update_admin(
        local.name.trim(),
        form.name.trim(),
        form.password.trim(),
        form.war.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Admin updated successfully");

      router.push("/admins");
    } catch (error) {
      Alert.alert("Error", "Failed to update admin");
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
              title="Update Admin"
              handlePress={submit}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
          </View>
          <CustomButton
            title="Delete Admin"
            handlePress={() => deleteAdmin()}
            containerStyles="mt-7 bg-red-800"
            textStyles={"text-white"}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTeam;
