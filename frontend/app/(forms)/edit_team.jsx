import React, { useState, useContext } from "react";
import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { update_team, update_team_balance } from "../../api/team_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

import { GlobalContext } from "../../context/GlobalProvider";

const EditTeam = () => {
  const local = useLocalSearchParams();
  const teamNo = local.teamNo;

  const { userMode, Logout } = useContext(GlobalContext);

  const logoutFunc = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?\nYou won't be able to log back in without your username and password.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            Logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const [form, setForm] = useState({
    teamNo: teamNo,
    teamName: local.teamName,
    balance: parseFloat(local.teamBalance),
    modifyAmount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModifyingBalance, setIsModifyingBalance] = useState(false);

  const validateEditTeam = (teamName) => {
    var result = {
      success: false,
      errorMsg: "",
    };

    try {
      if (!teamName) {
        result.errorMsg = "Please fill in all the fields";
        return result;
      }

      result.success = true;
      return result;
    } catch (error) {
      console.log(error);
      result.errorMsg = "Error validating team";
      return result;
    }
  };

  const modifyBalance = async (type) => {
    const amount = parseFloat(form.modifyAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid positive number");
      return;
    }

    setIsModifyingBalance(true);
    try {
      if (type === "add") {
        await update_team_balance(local.teamNo.trim(), amount, "add");
        setForm((prevForm) => ({
          ...prevForm,
          balance: prevForm.balance + amount,
        }));
      } else if (type === "remove") {
        await update_team_balance(local.teamNo.trim(), amount, "remove");
        setForm((prevForm) => ({
          ...prevForm,
          balance: prevForm.balance - amount,
        }));
      }

      Alert.alert("Success", "Team balance updated successfully");
      if (userMode == "super_admin") {
        router.navigate("/teams");
      }
      else if (userMode == "admin") {
        router.navigate("/admin_home2");
      }
    } catch (error) {
      Alert.alert("Error", "Error updating team balance");
      console.log(error);
    } finally {
      setIsModifyingBalance(false);
    }
  };

  const submit = async () => {
    setIsSubmitting(true);

    var result = validateEditTeam(form.teamName);

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await update_team(
        local.teamNo.trim(),
        form.teamName.trim(),
        form.balance.toString()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team updated successfully");

      // router.dismiss(1);
      if (userMode == "super_admin") {
        router.navigate("/teams");
      }
      else if (userMode == "admin") {
        router.navigate("/admin_home2");
      }
    } catch (error) {
      Alert.alert("Error", "Error updating team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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
              onPress={() => {
                if (userMode == "super_admin") {
                  router.navigate("/teams");
                }
                else if (userMode == "admin") {
                  router.navigate("/admin_home2");
                }
``             }}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Edit Team
            </Text>
            <FormField
              title="Team Number"
              value={teamNo}
              otherStyles="mt-7"
              editable={false}
            />

            {userMode == "super_admin" && (
              <FormField
                title="Team Name"
                value={form.teamName}
                handleChangeText={(e) => setForm({ ...form, teamName: e })}
                otherStyles="mt-7"
              />
            )}

            <FormField
              title="Running Money"
              value={form.balance.toString()}
              otherStyles="mt-7"
              editable={false}
            />

            <FormField
              title="Modify Amount"
              value={form.modifyAmount}
              handleChangeText={(e) => setForm({ ...form, modifyAmount: e })}
              otherStyles="mt-7"
              keyboardType="numeric"
              placeholder="Enter amount to add/remove"
            />

            <View className="flex flex-row justify-between mt-4">
              <CustomButton
                title="Add"
                handlePress={() => modifyBalance("add")}
                containerStyles="w-[45%] p-3 bg-green-800"
                textStyles="text-2xl"
                isLoading={isModifyingBalance}
              />
              <CustomButton
                title="Remove"
                handlePress={() => modifyBalance("remove")}
                containerStyles="w-[45%] p-3 bg-red-800"
                textStyles="text-2xl"
                isLoading={isModifyingBalance}
              />
            </View>

            {userMode == "super_admin" && (
              <CustomButton
                title="Update Team"
                handlePress={() => submit()}
                containerStyles="mt-7 p-3 bg-green-800"
                textStyles="text-3xl"
                isLoading={isSubmitting}
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default EditTeam;
