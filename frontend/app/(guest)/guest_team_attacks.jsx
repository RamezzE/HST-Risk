import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

import { useFocusEffect } from "@react-navigation/native";


const TeamAttacks = () => {
  const [error, setError] = useState(null);
  const [attackingAttacks, setAttackingAttacks] = useState([]);
  const [defendingAttacks, setDefendingAttacks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const { teamNo, socket } = useContext(GlobalContext);
  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    setError(null);
    try {
      const result = await get_all_attacks();

      const filteredAttackingAttacks = Array.isArray(result)
        ? result.filter((attack) => attack.attacking_team === teamNo.toString())
        : [];

      const filteredDefendingAttacks = Array.isArray(result)
        ? result.filter((attack) => attack.defending_team === teamNo.toString())
        : [];

      setAttackingAttacks(filteredAttackingAttacks);
      setDefendingAttacks(filteredDefendingAttacks);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching attacks:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      // Fetch initial data
      fetchData();
  
      // Set up socket listeners for real-time updates
      socket.on("new_attack", (newAttack) => {
        if (newAttack.attacking_team === teamNo.toString()) {
          setAttackingAttacks((prevAttacks) => [...prevAttacks, newAttack]);
        } else if (newAttack.defending_team === teamNo.toString()) {
          setDefendingAttacks((prevAttacks) => [...prevAttacks, newAttack]);
        }
      });
  
      // Listen for attack removal
      socket.on("remove_attack", (attackId) => {
        setAttackingAttacks((prevAttacks) =>
          prevAttacks.filter((attack) => attack._id !== attackId)
        );
        setDefendingAttacks((prevAttacks) =>
          prevAttacks.filter((attack) => attack._id !== attackId)
        );
      });

      socket.on("new_game", () => {
        Alert.alert(
          "New Game",
          "A new game has started. You will be logged out automatically."
        );
      
        setTimeout(async () => {
          deletePushToken(expoPushToken, teamNo);
          router.replace("/");
        }, 3000);
      });
  
      // Clean up the socket listeners when the component loses focus or unmounts
      return () => {
        socket.off("new_attack");
        socket.off("remove_attack");
        socket.off("new_game");
      };
    }, [teamNo]) // Add teamNo as a dependency to re-run effect when teamNo changes
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (isRefreshing) {
    return (
      <View
        className="bg-black h-full"
        style={{
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        }}
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
      className="bg-black flex-1"
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchData();
              }}
              tintColor="#000"
            />
          }
        >
          <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-start">
            <Text className="font-montez text-center text-5xl py-5">
              Team {teamNo} Wars
            </Text>

            {error ? (
              <Text className="text-red-500 text-center p-2 text-xl">
                {error}
              </Text>
            ) : (
              <View style={{ backgroundColor: "rgb(75,50,12,1)" }}>
                <Text className="text-red-800 font-montez text-4xl p-2 mb-2">
                  Ongoing Attacks
                </Text>
                <View className="mb-4">
                  {Array.isArray(attackingAttacks) &&
                  attackingAttacks.length > 0 ? (
                    attackingAttacks.map((attack, index) => (
                      <View
                        key={index}
                        className="px-2 rounded-md mb-3"
                        style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                      >
                        <View className="p-2">
                          <Text className="text-black text-xl font-psemibold">
                            {attack.attacking_zone} ({attack.attacking_team}
                            {attack.attacking_subteam}) →{" "}
                            {attack.defending_zone} ({attack.defending_team}
                            {attack.defending_subteam})
                          </Text>
                          <Text className="text-black text-xl font-pregular">
                            {attack.war}
                          </Text>
                          <Timer
                            attack_id={attack._id}
                            textStyles={"font-pbold text-red-800 text-xl"}
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text className="text-black text-3xl font-montez px-4">
                      You are not attacking now
                    </Text>
                  )}
                </View>

                <Text className="text-green-800 text-4xl font-montez p-2 mb-2">
                  Ongoing Defense
                </Text>
                <View className="mb-4">
                  {Array.isArray(defendingAttacks) &&
                  defendingAttacks.length > 0 ? (
                    defendingAttacks.map((attack, index) => (
                      <View
                        key={index}
                        className="px-2 rounded-md mb-3"
                        style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                      >
                        <View className="p-2">
                          <Text className="text-black text-xl font-psemibold">
                            {attack.attacking_zone} ({attack.attacking_team}
                            {attack.attacking_subteam}) →{" "}
                            {attack.defending_zone} ({attack.defending_team}
                            {attack.defending_subteam})
                          </Text>
                          <Text className="text-black text-xl font-pregular">
                            {attack.war}
                          </Text>
                          <Timer
                            attack_id={attack._id}
                            textStyles={"font-pbold text-red-800 text-xl"}
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text className="text-black text-3xl font-montez px-4">
                      There are no attacks on you
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default TeamAttacks;
