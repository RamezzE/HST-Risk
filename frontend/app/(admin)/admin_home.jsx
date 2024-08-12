import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/CustomButton";

import { useState, useEffect, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";

import { get_admin_by_name } from "../../api/admin_functions";
import { get_attacks_by_war } from "../../api/attack_functions";

import BackButton from "../../components/BackButton";

const AdminHome = () => {
  const { name } = useContext(GlobalContext);
  const [war, setWar] = useState("");
  const [zoneAttack, setZoneAttack] = useState({
    attacking_team: "",
    defending_team: "",
  });
  const [wars, setWars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const admin = await get_admin_by_name(name);
      setWar(admin.admin.war);
      const response = await get_attacks_by_war(admin.admin.war); // returns undefined

      console.log(response)
      setZoneAttack(response.attack);
      console.log(response.attack);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-between">
          <BackButton style="w-[20vw]" color="white" size={32} path="/" />
          <View className="flex flex-col">
            <Text className="text-white text-xl px-5 py-0">
              Welcome, {name}
            </Text>

            <Text className="text-white text-l p-5">War: {war}</Text>

            <Text className="text-white text-3xl p-5">Attack in progress:</Text>
            <Text className="text-white text-xl px-5 py-2">
              {/* Attacking Team: {zoneAttack.attacking_team} */}
            </Text>
            <Text className="text-white text-xl px-5 py-2">
              {/* Defending Team: {zoneAttack.defending_team} */}
            </Text>
          </View>
          <View>
            <View className="flex flex-row justify-between mr-1 mb-5">
              <CustomButton
                title="Attack Won"
                containerStyles="w-1/2 mr-1 bg-green-500"
                onPress={() => {}}
              />
              <CustomButton
                title="Defence Won"
                containerStyles="w-1/2 ml-1 bg-red-500"
                onPress={() => {}}
              />
            </View>
            <CustomButton
              title="Start Attack"
              containerStyles=""
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHome;
