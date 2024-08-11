import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { login } from '../../api/user_functions';

import { useContext } from 'react';

import { GlobalContext } from '../../context/GlobalProvider';

const validateSignIn = (username, password) => {
  var result = {
    success: false,
    errorMsg: ''
  };

  if (!username || !password) {
    result.errorMsg = 'Please fill in all the fields';
    return result;
  }

  result.success = true;
  return result;
};

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const { setName, setTeamNo, setUserMode } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    var result = validateSignIn(form.username, form.password);

    if (!result.success) {
      Alert.alert('Error', result.errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(form.username.trim(), form.password.trim());
      
      if (!response.success) {
        Alert.alert('Error', response.errorMsg);
        return;
      }

      if (response.team != "") {
        setTeamNo(form.username)
        router.push("/home")
        return;
      }

      if (response.admin != "") {
        setName(form.username)
        router.push("/admin_home")
        return;
      }

      if (response.superAdmin != "") {
        setName(form.username)
        router.push("/dashboard")
        return;
      }

      Alert.alert("Error", response.errorMsg);
      
    } catch (error) {
      Alert.alert('Error', "Cannot sign in");
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[75vh] px-4 my-6'>

          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Sign In
          </Text>

          <FormField 
            title='Username'
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles='mt-7'
          />

          <FormField 
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton 
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
