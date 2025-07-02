import React, { useState, useEffect, useContext } from "react";
import { View, Text, Alert } from "react-native";
import { router } from "expo-router";

import { attack_check } from "../../../api/attack_functions";
import BackButton from "../../../components/BackButton";
import Loader from "../../../components/Loader";
import DropDownField from "../../../components/DropDownField";
import CustomButton from "../../../components/CustomButton";
import FormWrapper from "../../../components/FormWrapper";

import { GlobalContext } from "../../../context/GlobalProvider";
import { get_country_mappings } from "../../../api/country_functions";

const validateAddAttack = (
  attackingTeam,
  attackingCountry,
  defendingTeam,
  defendingCountry
) => {
  var result = {
    success: false,
    errorMsg: "",
  };

  if (!attackingTeam || !defendingTeam || !defendingCountry) {
    result.errorMsg = "Please fill in all the fields";
    return result;
  }

  if (attackingTeam === defendingTeam) {
    result.errorMsg = "Attacking team and defending team cannot be the same";
    return result;
  }

  result.success = true;
  return result;
};

const AddAttack = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [form, setForm] = useState({
    attackingTeam: "",
    attackingSubteam: "",
    attackingCountry: "",
    defendingTeam: "",
    defendingCountry: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [subteamLetters, setSubteamLetters] = useState([]);
  const [error, setError] = useState(null);

  const submit = async () => {
    setIsSubmitting(true);

    var result = validateAddAttack(
      form.attackingTeam,
      form.attackingCountry,
      form.defendingTeam,
      form.defendingCountry
    );

    if (!result.success) {
      Alert.alert("Error", result.errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await attack_check(
        form.attackingCountry,
        form.attackingTeam,
        form.attackingSubteam,
        form.defendingCountry,
        form.defendingTeam,
        ""
      );

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      router.replace(
        `/dashboard/wars/warzones/choose?attacking_zone=${form.attackingCountry}&defending_zone=${form.defendingCountry}&attacking_team=${form.attackingTeam}&defending_team=${form.defendingTeam}&attacking_subteam=${form.attackingSubteam}`
      );
    } catch (error) {
      Alert.alert("Error", "Error initiating attack");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubteamLetters = () => {
    if (globalState.subteams.length === 0 || globalState.teams.length === 0) {
      return [];
    }

    const subteams = globalState.subteams.slice(
      0,
      globalState.subteams.length / globalState.teams.length
    );

    return subteams.map((subteam) => subteam.letter);
  };

  const fetchData = async () => {
    setError(null);
    try {
      const response = await get_country_mappings();
      globalDispatch({ type: "SET_COUNTRIES", payload: response });

      setSubteamLetters(getSubteamLetters());
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
    return <Loader />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  const filterCountriesByTeam = (teamNo) => {
    if (!globalState.countries) {
      return [];
    }

    return globalState.countries.filter(
      (country) => country.teamNo.toString() === teamNo.toString()
    );
  };

  return (
    <FormWrapper>
      <View className="justify-center my-6 px-4 w-full min-h-[82.5vh]">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => router.back()}
        />
        <Text className="mt-10 py-1 pt-2 font-montez text-black text-5xl text-center">
          Add Attack
        </Text>

        <DropDownField
          title="Attacking Team"
          value={form.attackingTeam}
          placeholder="Select Team"
          items={globalState.teams.map((team) => ({
            label: `Team ${team.number} - ${team.name}`,
            value: team.number.toString(),
          }))}
          handleChange={(e) => {
            setForm({
              ...form,
              attackingTeam: e,
              attackingCountry: "",
            });
          }}
          otherStyles="mt-7"
        />

        <DropDownField
          title="Attacking Subteam"
          value={form.attackingSubteam}
          placeholder="Select Subteam"
          items={subteamLetters.map((subteam) => ({
            label: subteam,
            value: subteam,
          }))}
          handleChange={(e) => {
            setForm({ ...form, attackingSubteam: e });
          }}
          otherStyles="mt-7"
        />

        {form.attackingTeam && (
          <DropDownField
            title="Attacking Country"
            value={form.attackingCountry}
            placeholder="Select Country"
            items={filterCountriesByTeam(form.attackingTeam).map((country) => ({
              label: country.name,
              value: country.name,
            }))}
            handleChange={(e) => setForm({ ...form, attackingCountry: e })}
            otherStyles="mt-7"
          />
        )}

        <DropDownField
          title="Defending Team"
          value={form.defendingTeam}
          placeholder="Select Team"
          items={globalState.teams.map((team) => ({
            label: `Team ${team.number} - ${team.name}`,
            value: team.number.toString(),
          }))}
          handleChange={(e) => {
            setForm({
              ...form,
              defendingTeam: e,
              defendingCountry: "",
            });
          }}
          otherStyles="mt-7"
        />

        {form.defendingTeam && (
          <DropDownField
            title="Defending Country"
            value={form.defendingCountry}
            placeholder="Select Defending Country"
            items={filterCountriesByTeam(form.defendingTeam).map((country) => ({
              label: country.name,
              value: country.name,
            }))}
            handleChange={(e) => setForm({ ...form, defendingCountry: e })}
            otherStyles="mt-7"
          />
        )}

        <CustomButton
          title="Initiate Attack"
          handlePress={() => submit()}
          containerStyles="mt-7 p-3 bg-green-700"
          textStyles={"text-3xl"}
          isLoading={isSubmitting}
        />
      </View>
    </FormWrapper>
  );
};

export default AddAttack;
