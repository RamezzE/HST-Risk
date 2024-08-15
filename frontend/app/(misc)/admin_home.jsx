import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/CustomButton";

import { useState, useEffect, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import { get_admin_by_name } from "../../api/admin_functions";
import {
  get_attacks_by_war,
  set_attack_result,
} from "../../api/attack_functions";
import { router } from "expo-router";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

const AdminHome = () => {
  const { name, Logout } = useContext(GlobalContext);
  const [war, setWar] = useState("");
  const [response, setResponse] = useState({ attacks: [] });
  const [currentAttack, setCurrentAttack] = useState({
    attacking_team: "",
    defending_team: "",
  });

  const fetchData = async () => {
    const admin = await get_admin_by_name(name);
    setWar(admin.admin.war);
    const response = await get_attacks_by_war(admin.admin.war);

    if (response.attacks.length > 0) {
      setResponse(response);
      setCurrentAttack({
        _id: response.attacks[0]._id,
        attacking_team: response.attacks[0].attacking_team,
        defending_team: response.attacks[0].defending_team,
      });
    } else {
      setResponse(response);
      setCurrentAttack({
        _id: "",
        attacking_team: "",
        defending_team: "",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logoutFunc = () => {
    Logout();
    router.replace("/");
  };

  const setAttackResult = async (attackWon) => {
    let team;
    if (attackWon == "true") team = currentAttack.attacking_team;
    else if (attackWon == "false") team = currentAttack.defending_team;

    const response = await set_attack_result(currentAttack._id, team);
    if (response.success) {
      Alert.alert("Attack Result Set");
      fetchData();
    } else {
      Alert.alert("Error", response.errorMsg);
      fetchData();
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full min-h-[100vh] px-4 py-5 flex flex-col justify-between">
            <View>
              <BackButton
                style="w-[20vw] mb-6"
                color="#4B320C"
                size={32}
                onPress={() => logoutFunc()}
              />

              <Text className="font-montez text-black text-5xl px-5 pt-1 text-center">
                Welcome, {name}
              </Text>

              <Text className="font-montez text-black text-center mt-1 text-4xl ">
                {war}
              </Text>
            </View>

            <View
              className="border-2 border-black rounded-md p-2"
              style={{ backgroundColor: "rgba(75, 50, 12, 0.75)" }} // Transparent background
            >
              {currentAttack._id ? (
                <>
                  {/* <Text className="font-montez text-white text-4xl p-5">
                    Attack in progress:
                  </Text> */}
                  <Text className="font-montez text-white text-4xl px-5 py-2 text-center">
                    Attacking Team: {currentAttack.attacking_team}
                  </Text>
                  <Text className="font-montez text-white text-4xl px-5 py-2 text-center">
                    Defending Team: {currentAttack.defending_team}
                  </Text>
                </>
              ) : (
                <Text className="font-montez text-white text-4xl p-5">
                  No current attack
                </Text>
              )}
            </View>

            <View>
              <View className="flex flex-row justify-between mr-1 mt-7">
                {response.attacks.length > 0 && (
                  <View className="w-full">
                    <View className="flex flex-row">
                    <CustomButton
                      title="Attack Won"
                      textStyles={"text-3xl"}
                      containerStyles="w-1/2 mr-1 bg-green-500 p-3"
                      handlePress={() => {
                        setAttackResult("true");
                      }}
                    />
                    <CustomButton
                      title="Defence Won"
                      textStyles={"text-3xl"}
                      containerStyles="w-1/2 ml-1 bg-red-500 p-3"
                      handlePress={() => {
                        setAttackResult("false");
                      }}
                    />
                    </View>
                    <CustomButton
                      title="Cancel Attack"
                      containerStyles="mt-5 p-3"
                      textStyles={"text-3xl"}
                      onPress={() => {}}
                    />
                  </View>
                  
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AdminHome;
