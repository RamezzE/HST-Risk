import { ScrollView, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
// import { images } from '../constants'

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView
        contentContainerStyle={{ height: "100vh" }}
        alwaysBounceVertical={true}
      >
        <View className="w-full justify-center items-center min-h-[95vh] px-4">
          {/* <Image
            source = { images.logo }
            className = "w-[130px] h-[84px]"
            resizeMode = 'contain'
          /> */}

          {/* <Image 
            source = { images.cards }
            className = "max-w-[380px] w-full h-[300px]"
            resizeMode = 'contain'
          /> */}

          <View className="relative mt-5">
            <Text className="text-4xl text-white font-bold text-center">
              {/* Discover Endless Possibilities with{' '}<Text className = 'text-secondary-200'>Aora</Text> */}
              {/* {' '}<Text className = 'text-secondary-200' >Helio Sports Team</Text> */}{" "}
              Domination
            </Text>
            <Text className="text-gray-200 text-center mt-3 text-sm">
              by Helio Sports Team
            </Text>

            {/* <Image 
              source = { images.path }
              className = 'w-[136px] h-[15px] absolute -bottom-2 -right-8'
              resizeMode = 'contain'
            /> */}
          </View>
          {/* <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitless
            with Aora
          </Text> */}

          <Text className="text-lg font-pregular mt-7 text-white text-left w-full">
            Login as:
          </Text>

          <View className="w-full flex flex-row justify-evenly items-center">
            <CustomButton
              title="Guest"
              // handlePress={() => router.push("/sign_in")}
              containerStyles="p-5 mt-5"
            />
            <CustomButton
              title="Team"
              // handlePress={() => router.push("/sign_in")}
              containerStyles="p-5 mt-5"
            />
            <CustomButton
              title="Admin"
              handlePress={() => router.push("/sign_in")}
              containerStyles="p-5 mt-5"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
