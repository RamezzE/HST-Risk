import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";


import CustomButton from "../../components/CustomButton";
import { GlobalContext } from "../../context/GlobalProvider";

import { Link, router } from "expo-router";

import { get_warzones } from "../../api/warzone_functions";
import { attack } from "../../api/attack_functions";

const Warzone = () => {
  const [warzones, setWarzones] = useState([]);
  const { attackData, setAttackData } = useContext(GlobalContext);

  useEffect(() => {
    get_warzones().then((data) => {
      if (data.errorMsg) {
        console.log(data.errorMsg);
      } else {
        setWarzones(data);
        console.log("Warzones: ", data);
      }
    });
  }, []);

  const handlePress = async (warzone) => {
    const availableWars = warzone.wars.filter(war => war.available);
    const randomWar = availableWars[Math.floor(Math.random() * availableWars.length)];

    setAttackData({ war: randomWar.name });

    try {
      const response = await attack(
        attackData.attacking_zone,
        attackData.attacking_team,
        attackData.defending_zone,
        attackData.defending_team,
        randomWar.name
      );
      
      if (!response.errorMsg) {
        Alert.alert(
          `${warzone.name}`,
          `You are assigned ${randomWar.name}\n\nAttacking from: ${attackData.attacking_zone} - Team ${attackData.attacking_team}\nDefending Side: ${attackData.defending_zone} - Team ${attackData.defending_team}\n\nProceed to the warzone\n\nGood luck!`
        );

        // Navigate to the home screen or any other route
        router.push("/home");
      } else {
        Alert.alert("Attack", response.errorMsg);
      }
    } catch (error) {
      Alert.alert("Error", "Error making attack request");
      console.log(error)
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[80vh] px-4 my-6 flex flex-col justify-between">
          <Text className="text-white text-center p-3 text-3xl ">
            Choose Your Warzone
          </Text>
          <Text className="text-white text-center p-3 text-xl ">
            Be careful, once you choose, you cannot change this attack.
          </Text>
          <View className="flex flex-row justify-between flex-wrap p-5">
            {warzones.map((warzone) => (
              <View
                className="p-3 my-2 w-full bg-gray-500 rounded-xl"
                key={warzone._id}
              >
                <Text className="text-white text-2xl">{warzone.name}</Text>

                {warzone.wars.map((war) => (
                  <View
                    className="p-1 flex flex-wrap flex-row justify-evenly align-center"
                    key={war.name}
                  >
                    <Text className="text-white text-xl">{war.name}</Text>
                  </View>
                ))}
                <CustomButton
                  title={`Join ${warzone.name}`}
                  handlePress={() => handlePress(warzone)}
                  containerStyles="p-3 mt-3"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Warzone;
