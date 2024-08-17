import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";

import moment from "moment";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";

import { images } from "../../constants";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

const TeamAttacks = () => {
  const [error, setError] = useState(null);
  const [attackingAttacks, setAttackingAttacks] = useState([]);
  const [defendingAttacks, setDefendingAttacks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const { teamNo } = useContext(GlobalContext);

  const insets = useSafeAreaInsets();

  const getCountdown = (createdAt) => {
    // Add 5 minutes (300 seconds) to the createdAt time
    const endTime = moment(createdAt).add(5, "minutes");

    // Calculate the remaining time until the endTime
    const remainingTime = moment.duration(endTime.diff(moment()));

    // Check if the countdown has expired
    if (remainingTime.asMilliseconds() <= 0) {
      return "Countdown expired";
    }

    // Extract minutes and seconds from the remaining time
    const minutes = Math.floor(remainingTime.asMinutes());
    const seconds = Math.floor(remainingTime.seconds());

    // Format the time as MM:SS
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_all_attacks();

      // Filter attacks based on the attacking_team and defending_team
      const filteredAttackingAttacks = result.filter(
        (attack) => attack.attacking_team === teamNo.toString()
      );
      const filteredDefendingAttacks = result.filter(
        (attack) => attack.defending_team === teamNo.toString()
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
      <View
        className=" bg-black h-full"
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
        // paddingBottom: insets.bottom,
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
              onRefresh={() => fetchData()}
              tintColor="#000"
            />
          }
        >
          <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-start">
            <View className="flex flex-col mb-6">
              <Text className="font-montez text-center text-5xl py-5">
                Team {teamNo} Attacks
              </Text>
            </View>
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
                  {attackingAttacks.map((attack, index) => (
                    <View
                      key={index}
                      className="px-2 rounded-md mb-3"
                      style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                    >
                      <View className="p-2">
                        <Text className="text-black text-3xl font-montez">
                          {attack.attacking_zone} ({attack.attacking_team}) →{" "}
                          {attack.defending_zone} ({attack.defending_team})
                        </Text>
                        <Text className="text-black text-2xl font-montez">
                          {attack.war}
                        </Text>
                        <Timer attack_id={attack._id} />
                      </View>
                    </View>
                  ))}
                </View>
                <Text className="text-green-800 text-4xl font-montez p-2 mb-2">
                  Ongoing Defence
                </Text>
                <View className="mb-4">
                  {defendingAttacks.map((attack, index) => (
                    <View
                      key={index}
                      className="px-2 rounded-md mb-3"
                      style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                    >
                      <View className="p-2">
                        <Text className="text-black text-3xl font-montez">
                          {attack.attacking_zone} ({attack.attacking_team}) →{" "}
                          {attack.defending_zone} ({attack.defending_team})
                        </Text>
                        <Text className="text-black text-2xl font-montez">
                          {attack.war}
                        </Text>
                        <Timer createdAt={attack.createdAt} timerDuration={5} />
                      </View>
                    </View>
                  ))}
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