import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  LogBox,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { get_all_attacks } from "../../api/attack_functions";

import BackButton from "../../components/BackButton";

import Loader from "../../components/Loader";

const DashboardAttacks = () => {
  const [attacks, setAttacks] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

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

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const deleteAttack = async () => {
    const result = await delete_attack(id);
    if (result.success) {
      Alert.alert("Success", "Attack deleted successfully");
      fetchData();
    } else {
      Alert.alert("Error", result.errorMsg);
    }
    };


  const deleteAttackAlert = async (id, attacking_zone, attacking_team, defending_zone, defending_team, war) => {
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
          onPress: () => {deleteAttack(id)},
        },
      ]
    );
  };


  const renderItem = ({ item }) => (
    <View
      className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
    >
      <View className="flex flex-col ">
        <Text className="text-4xl font-montez">
          Team {item.attacking_team} vs Team {item.defending_team}
        </Text>
        <Text className="text-2xl font-montez">
          {item.attacking_zone} vs {item.defending_zone}
        </Text>
        <Text className="text-2xl font-montez">War: {item.war}</Text>
      </View>

      <CustomButton
        title="Delete"
        handlePress={() =>{deleteAttackAlert(item._id, item.attacking_zone, item.attacking_team, item.defending_zone, item.defending_team, item.war)}}
        containerStyles="w-1/4 h-2/3 mt-2 bg-red-800"
        textStyles="text-2xl"
      />
    </View>
  );

  if (isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Loader />
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
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchData()}
            tintColor="#000"
          />
        }
      >
        <View className="w-full justify-center min-h-[82.5vh] max-h-[90vh] p-4  ">
          <BackButton
            style="w-[20vw]"
            color="black"
            size={32}
            onPress={() => {
              router.replace("/");
            }}
          />

          <Text className="text-6xl text-center font-montez py-2">
            Attacks
          </Text>

          {error ? (
            <Text style={{ color: "white", textAlign: "center" }}>
              {error}
            </Text>
          ) : (
            <FlatList
              data={attacks}
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
  </SafeAreaView>
  );
};

export default DashboardAttacks;
