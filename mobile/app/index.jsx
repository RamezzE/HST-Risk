import { useState, useContext } from 'react';
import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { GlobalContext } from "../context/GlobalProvider";
import { images } from "../constants";
import { isLoggedIn } from '../helpers/AuthHelpers';

const App = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AutoLogin = async () => {
    setIsSubmitting(true);

    try {
      const response = await isLoggedIn(globalState, globalDispatch);

      if (response.path)
        router.navigate(response.path)

    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center pt-8">
      <View className="w-full justify-center space-y-8 items-center px-4 py-8">
        <View className="w-full flex flex-col space-y-8">
          <View>
            <Text className="text-8xl text-black font-montez text-center p-5">
              Risk
            </Text>
            <Text className="text-5xl text-black font-montez p-2 text-center">
              Camp Domination
            </Text>
          </View>

          <View className="w-full flex flex-row justify-evenly items-center">
            <CustomButton
              title="Guest"
              handlePress={() => {
                globalDispatch({ type: "SET_NAME", payload: "Guest" });
                router.navigate("/guest_choose_team");
              }}
              textStyles={"font-montez text-3xl"}
              containerStyles={"p-4"}
            />

            <CustomButton
              title="Sign in"
              handlePress={AutoLogin}
              isLoading={isSubmitting}
              textStyles={"font-montez text-3xl"}
              containerStyles={"p-4"}
            />
          </View>
        </View>

        <View className="">
          <Image
            source={images.papyrus_globe}
            className="h-48"
            resizeMode="contain"
          />
        </View>
        <Text className="text-black text-2xl text-center font-montez">
          by Helio Sports Team
        </Text>
      </View>
    </View>
  );
}

export default App;