import { View, Text, Image, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
// import { createUser, signIn } from '../../lib/appwrite'

const validateSignUp = (email, password, confirmPassword) => {
  var result = {
    success: false,
    errorMsg: ''
  }

  if (!email || !password || !confirmPassword) {
     result.errorMsg = 'Please fill in all the fields'
     return result
  }

  var emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  if(!emailRegex.test(email)) {
    result.errorMsg =  'Please write a valid email'
    return result
  }

  if (password.length < 8) {
    result.errorMsg =  'Password must be at least 8 characters long'
    return result
  }

  if (password != confirmPassword) {
    result.errorMsg =  'Passwords do not match'
    return result
  }

  result.success = true
  return result
}

const SignUp = () => {
  // const { setUser, setIsLoggedIn } = useGlobalContext();
  
  const [form, setForm] = useState({
    email : '',
    password : '',
    confirmPassword : ''
  })

  const [isSubmitting, setisSubmitting] = useState()

  const submit = async () => {

    var result = validateSignUp(form.email, form.password, form.confirmPassword)

    if(!result.success) {
      Alert.alert('Error', result.errorMsg)
      return
    }

    setisSubmitting(true)

    try {
      const result = await createUser(form.email, form.password);
      await signIn(form.email, form.password)
      // const result2 = await getCurrentUser();

      setUser(result)
      setIsLoggedIn(true)

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
   <SafeAreaView
    className = 'bg-primary h-full'
   >
    <ScrollView>
      <View
        className = 'w-full justify-center min-h-[87.5vh] px-4 my-6'
      >
       <Image 
        source = { images.logo }
        resizeMode = 'contain'
        className = 'w-[115px] h-[35px]'
       />

       <Text
        className = 'text-2xl text-white text-semibold mt-10 font-psemibold'
       >
        Sign Up to Aora
       </Text>

       <FormField 
          title = 'Email'
          value = {form.email}
          handleChangeText = {(e) => setForm({ ...form, email: e})}
          otherStyles = 'mt-7'
          keyboardType = 'email-address'
       />

       <FormField 
          title = 'Password'
          value = {form.password}
          handleChangeText = {(e) => setForm({ ...form, password: e})}
          otherStyles = 'mt-7'
       />

       <FormField 
          title = 'Confirm Password'
          value = {form.confirmPassword}
          handleChangeText = {(e) => setForm({ ...form, confirmPassword: e})}
          otherStyles = 'mt-7'
       />

       <CustomButton 
        title = 'Sign Up'
        handlePress = {submit}
        containerStyles = 'mt-7'
        isLoading = {isSubmitting}
       />

       <View className = 'justify-center pt-5 flex-row gap-2'>
        <Text className = 'text-lg text-gray-100 font-pregular'>
          Already Have an account?
        </Text>
        <Link href='/sign_in' className = 'text-lg font-psemibold text-secondary'>Login</Link>
       </View>

      </View>
    </ScrollView>

   </SafeAreaView>
  )
}

export default SignUp