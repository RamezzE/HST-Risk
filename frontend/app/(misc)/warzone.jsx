import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";
import CustomButton from "../../components/CustomButton";
import { useLocalSearchParams } from "expo-router";
import { get_warzones } from "../../api/warzone_functions";
import { attack } from "../../api/attack_functions";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";
import { images } from "../../constants";

import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

const Warzone = () => {
  const local = useLocalSearchParams();
  const [warzones, setWarzones] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const { userMode } = useContext(GlobalContext);

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
    const availableWars = Array.isArray(warzone.wars)
      ? warzone.wars.filter((war) => war.available)
      : [];

    if (availableWars.length === 0) {
      Alert.alert(
        "Warzone unavailable",
        `All wars are currently occupied in ${warzone.name}\nPlease check other warzones`
      );
      return;
    }

    const randomWar =
      availableWars[Math.floor(Math.random() * availableWars.length)];
    setIsSubmitting(true);

    try {
      const response = await attack(
        local.attacking_zone,
        local.attacking_team,
        local.attacking_subteam,
        local.defending_zone,
        local.defending_team,
        warzone._id,
        randomWar.name
      );

      if (!response.errorMsg) {
        Alert.alert(
          `${warzone.name}`,
          `You are assigned ${randomWar.name}\n\nAttacking from: ${local.attacking_zone} - Team ${local.attacking_team}${local.attacking_subteam}\nDefending Side: ${local.defending_zone} - Team ${local.defending_team}\n\nProceed to the warzone\n\nGood luck!`
        );

        // Navigate to the home screen or any other route
        if (userMode == "super_admin") {
          router.replace("/dashboard_attacks");
          return;
        }
        router.replace("/team_attacks");
      } else {
        Alert.alert("Attack", response.errorMsg);
      }
    } catch (error) {
      Alert.alert("Error", "Error making attack request");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRefreshing) {
    return (
      <View
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        }}
        className="flex-1 bg-black"
      >
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Loader />
        </ImageBackground>
      </View>
    );
  }

  return (
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchData}
              tintColor="#000"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-between">
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => router.navigate("/attack")}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
              Choose your warzone
            </Text>
            <Text className="text-3xl mt-2 py-1 text-center font-montez text-black ">
              Be careful, once you choose, you cannot change this attack.
            </Text>
            <View className="flex flex-row justify-between flex-wrap p-5">
              {Array.isArray(warzones) &&
                warzones.map((warzone) => {
                  const availableWars = Array.isArray(warzone.wars)
                    ? warzone.wars.filter((war) => war.available)
                    : [];
                  const isUnavailable = availableWars.length === 0;

                  return (
                    <View
                      className="p-3 my-2 w-full rounded-md"
                      style={{
                        backgroundColor: isUnavailable
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(255, 255, 255, 0.5)",
                        opacity: isUnavailable ? 0.5 : 1, // Make it more transparent if unavailable
                      }}
                      key={warzone._id}
                    >
                      <Text className="text-black font-montez text-4xl">
                        {warzone.name}
                      </Text>

                      {Array.isArray(warzone.wars) &&
                        warzone.wars.map((war) => (
                          <View
                            className="p-1 flex flex-wrap flex-row justify-evenly align-center"
                            key={war.name}
                          >
                            <Text className="text-black font-plight text-2xl">
                              {war.name}
                            </Text>
                          </View>
                        ))}
                      <CustomButton
                        title={`Join ${warzone.name}`}
                        handlePress={() => handlePress(warzone)}
                        containerStyles="p-3 mt-3"
                        textStyles={"text-xl font-pregular"}
                        isLoading={isSubmitting}
                        disabled={isUnavailable} // Disable button if the warzone is unavailable
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Warzone;
