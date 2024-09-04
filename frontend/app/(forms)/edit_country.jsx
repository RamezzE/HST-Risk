import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import DropDownField from "../../components/DropDownField";

import { get_all_teams } from "../../api/team_functions";

import { update_country } from "../../api/country_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const EditCountry = () => {
  const local = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    countryName: local.countryName,
    teamNo: local.teamNo,
  });

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const result = await update_country(
        form.countryName.trim(),
        form.teamNo.trim()
      );
      if (result.success === false) {
        Alert.alert("Error", result.errorMsg);
      } else {
        Alert.alert("Success", "Country updated successfully");
        router.navigate("/countries");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update country");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_all_teams();
        setTeams(response);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data");
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={175}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
      >
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
              <View className="w-full justify-center min-h-[82.5vh] px-4 my-6">
                <BackButton
                  style="w-[20vw] mb-4"
                  size={32}
                  onPress={() => {
                    router.navigate("/countries");
                  }}
                />
                <Text className="text-5xl mt-10 py-1 pt-2 text-center font-montez text-black">
                  Edit Country
                </Text>
                <FormField
                  title="Country Name"
                  value={form.countryName}
                  otherStyles="mt-7"
                  editable={false}
                />

                {Array.isArray(teams) && (
                  <DropDownField
                    title="Owned by Team"
                    value={form.teamNo}
                    placeholder="Select Team"
                    items={teams.map((team) => ({
                      label: `Team ${team.number} - ${team.name}`,
                      value: team.number.toString(),
                    }))}
                    // items={[]}
                    handleChange={(e) => setForm({ ...form, teamNo: e })}
                    otherStyles="mt-7"
                  />
                )}

                {/* <FormField
            title="Team Owned"
            value={form.teamNo}
            handleChangeText={(e) => setForm({ ...form, teamName: e })}
            otherStyles="mt-7"
          /> */}

                <CustomButton
                  title="Update Country"
                  handlePress={submit}
                  containerStyles="mt-7 p-3 bg-green-800"
                  textStyles={"text-3xl"}
                  isLoading={isSubmitting}
                />
              </View>
          </ImageBackground>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditCountry;
