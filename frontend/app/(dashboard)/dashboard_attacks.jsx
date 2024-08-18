import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Alert,
  LogBox,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "../../constants";
import { get_all_attacks } from "../../api/attack_functions";

import { delete_attack, set_attack_result } from "../../api/attack_functions";

import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

const DashboardAttacks = () => {
  const [attacks, setAttacks] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_all_attacks();
      console.log(result);
      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result)) {
        setAttacks(result);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch attacks");
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const setAttackResultAlert = (attackWon, id, attacking_team, attacking_subteam, defending_team) => {
    const team =
      attackWon === "true"
        ? attacking_team
        : defending_team;

    const subteam = attackWon === "true" ? attacking_subteam : "";
    Alert.alert(
      "Confirm",
      `Are you SURE that team ${team}${subteam} won?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setAttackResult(attackWon, id, attacking_team, defending_team);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setAttackResult = async (attackWon, id, attacking_team, defending_team) => {
    setIsSubmitting(true);

    try {
      let team;
      if (attackWon === "true") team = attacking_team;
      else if (attackWon === "false") team = defending_team;

      const response = await set_attack_result(id, team);
      if (response.success) {
        Alert.alert("Success", "Attack result set successfully");
        fetchData();
      } else {
        Alert.alert("Error", response.errorMsg);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to set attack result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAttack = async (id) => {
    const result = await delete_attack(id);
    if (result.success) {
      Alert.alert("Success", "Attack deleted successfully");
      fetchData();
    } else {
      Alert.alert("Error", result.errorMsg);
    }
  };

  const deleteAttackAlert = async (
    id,
    attacking_zone,
    attacking_team,
    defending_zone,
    defending_team,
    war
  ) => {
    Alert.alert(
      "Delete Attack",
      `Are you sure you want to delete this attack?\nTeam ${attacking_team} VS Team ${defending_team} \n${attacking_zone} VS ${defending_zone}\nWar: ${war}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteAttack(id);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View
      className="p-3 my-2 rounded-md flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
    >
      <View className="flex flex-col w-[72.5%]">
        <Text className="text-4xl font-montez">
          Team {item.attacking_team}{item.attacking_subteam} vs Team {item.defending_team}{item.defending_subteam}
        </Text>
        <Text className="text-2xl font-montez">
          {item.attacking_zone} vs {item.defending_zone}
        </Text>
        <Text className="text-2xl font-montez">War: {item.war}</Text>
        <Timer attack_id={item._id} />
      </View>
      <View className="flex flex-col ">
        <CustomButton
          title="Set Win"
          handlePress={() => setAttackResultAlert("true", item._id, item.attacking_team, item.attacking_subteam, item.defending_team)}
          containerStyles="p-1 mt-2 bg-green-800"
          textStyles="text-2xl"
          isLoading={isSubmitting}
        />
        <CustomButton
          title="Set Lose"
          handlePress={() => setAttackResultAlert("false", item._id, item.attacking_team, item.attacking_subteam, item.defending_team)}
          containerStyles="p-1 mt-2 bg-red-800"
          textStyles="text-2xl"
          isLoading={isSubmitting}

        />

        <CustomButton
          title="Delete"
          handlePress={() => {
            deleteAttackAlert(
              item._id,
              item.attacking_zone,
              item.attacking_team,
              item.defending_zone,
              item.defending_team,
              item.war
            );
          }}
          containerStyles="mt-2"
          textStyles="text-2xl"
          isLoading={isSubmitting}

        />
      </View>
    </View>
  );

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
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData()}
              tintColor="#000"
            />
          }
        >
          <View className="w-full justify-center min-h-[82.5vh] max-h-[90vh] p-4 ">
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Attacks
            </Text>

            {error ? (
              <Text style={{ color: "white", textAlign: "center" }}>
                {error}
              </Text>
            ) : (
              <FlatList
                data={attacks}
                className="mb-12"
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text className="text-5xl text-black text-center font-montez p-5">
                    No attacks Found
                  </Text>
                }
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default DashboardAttacks;
