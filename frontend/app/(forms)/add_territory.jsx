import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import FormField from '../../components/FormField';
import DropDownField from '../../components/DropDownField';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { get_all_teams } from '../../api/team_functions';

const validateAddTerritory = (territory_name, teamNo) => {
  var result = {
    success: false,
    errorMsg: '',
  };

  if (!teamNo || !territory_name) {
    result.errorMsg = 'Please fill in all the fields';
    return result;
  }

  if (isNaN(teamNo)) {
    result.errorMsg = 'Team number must be a number';
    return result;
  }

  result.success = true;
  return result;
};

const AddTerritory = () => {
  const [form, setForm] = useState({
    name: '',
    teamNo: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setError(null);

      try {
        const result = await get_all_teams();

        if (result.success === false) {
          setError(result.errorMsg);
        } else if (Array.isArray(result)) {
          setTeams(result);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch teams");
      }
    };

    fetchTeams();
  }, []);

  const submit = async () => {
    var result = validateAddTerritory(form.name, form.teamNo);

    if (!result.success) {
      Alert.alert('Error', result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      // Add your submit logic here

      // Reset the form state
    //   setForm({
    //     name: '',
    //     teamNo: '',
    //     description: '',
    //   });

      router.push('/territories');
    } catch (error) {
      Alert.alert('Error', 'Error adding territory');
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
            Add Territory
          </Text>
          <FormField
            title="Territory Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
          />

          <DropDownField
            title="Owned by Team"
            value={form.teamNo}
            placeholder="Select Team"
            items={teams.map((team) => ({
              label: `Team ${team.number} - ${team.name}`,
              value: (team.number).toString(),
            }))}
            handleChange={(e) => setForm({ ...form, teamNo: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Description"
            value={form.description}
            handleChangeText={(e) => setForm({ ...form, description: e })}
            otherStyles="mt-7"
          />

          <View className="w-full flex flex-row items-center justify-evenly">
            <CustomButton
              title="Cancel"
              handlePress={() => router.push('/territories')}
              containerStyles="w-[45%] mt-7"
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Add Territory"
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

export default AddTerritory;
