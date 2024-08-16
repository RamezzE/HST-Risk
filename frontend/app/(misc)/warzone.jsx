import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreInsets } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";

import CustomButton from "../../components/CustomButton";
import { GlobalContext } from "../../context/GlobalProvider";

import { router } from "expo-router";

import { get_warzones } from "../../api/warzone_functions";
import { attack } from "../../api/attack_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

const Warzone = () => {
  const [warzones, setWarzones] = useState([]);
  const { attackData, setAttackData } = useContext(GlobalContext);
  const [isRefreshing, setIsRefreshing] = useState(true);

  
  const fetchData = async () => {
    try {
      const data = await get_warzones();
      if (data.errorMsg) {
        console.log(data.errorMsg);
      } else {
        setWarzones(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    
    fetchData();
    
  }, []);

  const handlePress = async (warzone) => {
    const availableWars = warzone.wars.filter((war) => war.available);

    if (availableWars.length === 0) {
      Alert.alert(
        "Warzone unavailable",
        `All wars are currently occupied in ${warzone.name}\nPlease check other warzones`
      );
      return;
    }

    const randomWar =
      availableWars[Math.floor(Math.random() * availableWars.length)];

    try {
      const response = await attack(
        attackData.attacking_zone,
        attackData.attacking_team,
        attackData.defending_zone,
        attackData.defending_team,
        warzone._id,
        randomWar.name
      );

      if (!response.errorMsg) {
        Alert.alert(
          `${warzone.name}`,
          `You are assigned ${randomWar.name}\n\nAttacking from: ${attackData.attacking_zone} - Team ${attackData.attacking_team}\nDefending Side: ${attackData.defending_zone} - Team ${attackData.defending_team}\n\nProceed to the warzone\n\nGood luck!`
        );

        // Navigate to the home screen or any other route
        router.replace("/team_attacks");
      } else {
        Alert.alert("Attack", response.errorMsg);
      }
    } catch (error) {
      Alert.alert("Error", "Error making attack request");
      console.log(error);
    }
  };

  const insets = useSafeAreaInsets()

  if (isRefreshing) {
    return (
      <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="flex-1 bg-black">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="25" color="#000" />
          </View>
        </ImageBackground>
      </View>
    );
  }


  return (
    <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="bg-black h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData()}
              tintColor="#000"
            />
          }
        >
          <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-between">
            <BackButton
              style="w-[20vw]"
              color="black"
              size={32}
              onPress={() => router.dismiss(1)}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Choose your warzone
            </Text>
            <Text className="text-3xl mt-2 py-1 text-center font-montez text-black ">
              Be careful, once you choose, you cannot change this attack.
            </Text>
            <View className="flex flex-row justify-between flex-wrap p-5">
              {warzones.map((warzone) => (
                <View
                  className="p-3 my-2 w-full rounded-md"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                  key={warzone._id}
                >
                  <Text className="text-black font-montez text-4xl">
                    {warzone.name}
                  </Text>

                  {warzone.wars.map((war) => (
                    <View
                      className="p-1 flex flex-wrap flex-row justify-evenly align-center"
                      key={war.name}
                    >
                      <Text className="text-black font-montez text-2xl">
                        {war.name}
                      </Text>
                    </View>
                  ))}
                  <CustomButton
                    title={`Join ${warzone.name}`}
                    handlePress={() => handlePress(warzone)}
                    containerStyles="p-3 mt-3"
                    textStyles={"text-2xl"}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Warzone;
