import React, { useState, useContext } from "react";
import { View, Text, Alert } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";

import { update_team, update_team_balance } from "../../api/team_functions";

import BackButton from "../../components/BackButton";

import { GlobalContext } from "../../context/GlobalProvider";


const EditTeam = () => {
  const local = useLocalSearchParams();
  const teamNo = local.teamNo;

  const { globalState } = useContext(GlobalContext);

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

    if (amount > form.balance && type == "remove") {
      Alert.alert("Error", "Insufficient balance to remove ");
    }

    setIsModifyingBalance(true);
    try {
      if (type === "add") {
        const response = await update_team_balance(
          local.teamNo.trim(),
          amount,
          "add"
        );
        if (!response.success) {
          Alert.alert("Error", response.errorMsg);
          return;
        }
        setForm((prevForm) => ({
          ...prevForm,
          balance: prevForm.balance + amount,
        }));
      } else if (type === "remove") {
        const response = await update_team_balance(
          local.teamNo.trim(),
          amount,
          "remove"
        );
        if (!response.success) {
          Alert.alert("Error", response.errorMsg);
          return;
        }
        setForm((prevForm) => ({
          ...prevForm,
          balance: prevForm.balance - amount,
        }));
      }

      Alert.alert("Success", "Team balance updated successfully");
      if (globalState.userMode == "super_admin") {
        router.navigate("/teams");
      } else if (globalState.userMode == "admin") {
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
        form.teamName.trim()
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      Alert.alert("Success", "Team updated successfully");

      // router.dismiss(1);
      if (globalState.userMode == "super_admin") {
        router.navigate("/teams");
      } else if (globalState.userMode == "admin") {
        router.navigate("/admin_home2");
      }
    } catch (error) {
      Alert.alert("Error", "Error updating team");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
      <BackButton
        style="w-[20vw]"
        size={32}
        onPress={() => {
          if (globalState.userMode == "super_admin") {
            router.navigate("/teams");
          } else if (globalState.userMode == "admin") {
            router.navigate("/admin_home2");
          }
          ``;
        }}
      />
      <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
        Edit Team
      </Text>
      <FormField
        title="Team Number"
        value={teamNo}
        otherStyles="mt-7"
        editable={false}
      />

      {globalState.userMode == "super_admin" && (
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
        handleChangeText={(e) =>
          setForm({ ...form, modifyAmount: e })
        }
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

      {globalState.userMode == "super_admin" && (
        <CustomButton
          title="Update Team"
          handlePress={() => submit()}
          containerStyles="mt-7 p-3 bg-green-800"
          textStyles="text-3xl"
          isLoading={isSubmitting}
        />
      )}
    </View>

  );
};

export default EditTeam;
