import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";

const TeamAttacks = () => {
  const [attacks, setAttacks] = useState([]);
  const [error, setError] = useState(null);
  const [attackingAttacks, setAttackingAttacks] = useState([]);
  const [defendingAttacks, setDefendingAttacks] = useState([]);

  const { teamNo } = useContext(GlobalContext);

  useEffect(() => {


    // if (!teamNo) {
    //   setMyZones([]);
    //   setOtherZones([]);

    //   Alert.alert("Error", "Please login first");

    //   router.push("/home");
    //   return;
    // }

    const fetchData = async () => {
      setError(null);

      try {
        const result = await get_all_attacks();
        setAttackingAttacks(
          result.filter((attack) => attack.team_1 === teamNo)
        );
        setDefendingAttacks(
          result.filter((attack) => attack.team_2 === teamNo)
        );
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [teamNo]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-white text-center text-2xl p-4">Team Attacks</Text>
      {error ? (
        <Text className="text-red-500 text-center p-2 text-xl">{error}</Text>
      ) : (
        <View>
          <Text className="text-white text-xl p-4">Attacking Attacks</Text>
          {attackingAttacks.map((attack, index) => (
            <Text key={index} className="text-white p-2">
              Attacking: {attack.team_1} - Defending: {attack.team_2} - War:{" "}
              {attack.war}
            </Text>
          ))}
          <Text className="text-white text-xl p-4">Defending Attacks</Text>
          {defendingAttacks.map((attack, index) => (
            <Text key={index} className="text-white p-2">
              Attacking: {attack.team_1} - Defending: {attack.team_2} - War:{" "}
              {attack.war}
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default TeamAttacks;
