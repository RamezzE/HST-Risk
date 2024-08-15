import { View, Text, ImageBackground, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";

import { images } from "../../constants";

const StatsGuest = () => {
  const [attacks, setAttacks] = useState([]);
  const [error, setError] = useState(null);
  const [attackingAttacks, setAttackingAttacks] = useState([]);
  const [defendingAttacks, setDefendingAttacks] = useState([]);

  const { teamNo } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const result = await get_all_attacks();

        // Log the entire result for debugging
        console.log("All attacks:", result);

        // Filter attacks based on the attacking_team and defending_team

        console.log("Team No:", teamNo);

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
      }
    };

    fetchData();
  }, [teamNo]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full min-h-[82.5vh] px-4 mb-24 mt-6 flex flex-col justify-between">
            <View className="py-4 mb-2">
              <Text className="text-5xl py-1 text-center font-montez text-black">
                Game Stats
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
                <Text className="text-red-800 font-montez text-4xl p-4">
                  Currently Attacking
                </Text>
                <ScrollView
                  style={{ height: "10vh" }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {attackingAttacks.map((attack, index) => (
                    <View
                      key={index}
                      className="px-2 mx-3 rounded-md mb-3"
                      style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
                    >
                      <View className="p-2">
                        <Text className="text-green-800 text-3xl font-montez">
                          From: {attack.attacking_zone}
                        </Text>
                        <Text className="text-red-700 text-3xl font-montez">
                          On: {attack.defending_zone} -- Team{" "}
                          {attack.defending_team}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <Text className="text-green-800 text-4xl font-montez p-4">
                  Defending Attacks
                </Text>
                <ScrollView
                  style={{ height: "10vh" }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {defendingAttacks.map((attack, index) => (
                    <View
                      key={index}
                      className="px-2 mx-3 rounded-md mb-3"
                      style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
                    >
                      <View className="p-2">
                        <Text className="text-red-700 text-3xl font-montez">
                          From: {attack.attacking_zone} -- Team{" "}
                          {attack.attacking_team}
                        </Text>
                        <Text className="text-green-800 text-3xl font-montez">
                          On: {attack.defending_zone}
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

export default StatsGuest;
