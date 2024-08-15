import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";

import { images } from "../../constants";

const TeamAttacks = () => {
  const [error, setError] = useState(null);
  const [attackingAttacks, setAttackingAttacks] = useState([]);
  const [defendingAttacks, setDefendingAttacks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const { teamNo } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_all_attacks();

      // Filter attacks based on the attacking_team and defending_team
      const filteredAttackingAttacks = result.filter(
        (attack) => attack.attacking_team === teamNo
      );
      const filteredDefendingAttacks = result.filter(
        (attack) => attack.defending_team === teamNo
      );

      setAttackingAttacks(filteredAttackingAttacks);
      setDefendingAttacks(filteredDefendingAttacks);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching attacks:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isRefreshing) {
    return (
      <SafeAreaView className=" bg-primary h-full">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="25" color="#000" />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
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
          <View className="w-full min-h-[82.5vh] px-4 mb-24 mt-6 flex flex-col justify-start">
            <View className="py-4 mb-2">
              <Text className="text-5xl py-1 text-center font-montez text-black">
                Team Attacks
              </Text>
              <Text className="text-3xl  text-center font-montez text-black">
                Team {teamNo}
              </Text>
            </View>
            {error ? (
              <Text className="text-red-500 text-center p-2 text-xl">
                {error}
              </Text>
            ) : (
              <View className="" style={{ backgroundColor: "rgb(75,50,12,1)" }}>
                <Text className="text-red-800 font-montez text-4xl p-2 mb-2">
                Ongoing Attacks (Team {teamNo})
                </Text>
                <ScrollView
                  style={{ height: "10vh" }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {attackingAttacks.map((attack, index) => (
                    <View
                      key={index}
                      className="px-2 rounded-md mb-3"
                      // style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
                      style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                    >
                      <View className="p-2">
                        <Text className="text-black text-3xl font-montez">
                          {attack.attacking_zone} ({attack.attacking_team}) → {attack.defending_zone} ({attack.defending_team})
                        </Text>
                      
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <Text className="text-green-800 text-4xl font-montez p-2 mb-2">
                Ongoing Defence (Team {teamNo})
                </Text>
                <ScrollView
                  style={{ height: "10vh" }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {defendingAttacks.map((attack, index) => (
                    <View
                    key={index}
                    className="px-2 rounded-md mb-3"
                    // style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
                    style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                  >
                    <View className="p-2">
                      <Text className="text-black text-3xl font-montez">
                        {attack.attacking_zone} ({attack.attacking_team}) → {attack.defending_zone} ({attack.defending_team})
                      </Text>
                    
                    </View>
                  </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default TeamAttacks;
