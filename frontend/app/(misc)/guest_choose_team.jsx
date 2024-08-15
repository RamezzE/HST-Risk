import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

import { images } from "../../constants";

import BackButton from "../../components/BackButton";

import { get_all_teams } from "../../api/team_functions";

const GuestChooseTeam = () => {
  const { setTeamNo } = useContext(GlobalContext);
  const [teams, setTeams] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const fetchData = async () => {
    setIsRefreshing(true);

    try {
      const result = await get_all_teams();
      if (result.errorMsg) {
        console.log(result.errorMsg);
      } else {
        setTeams(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTeamSelection = (teamNo) => {
    setTeamNo(teamNo);
    router.replace("/guest_home");
  };

  if (isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
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
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData()}
              tintColor="#000"
            />
          }
        >
          <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-start">
            <BackButton
              style="w-[20vw] mb-4"
              color="#4B320C"
              size={32}
              onPress={() => router.replace("/")}
            />
            <Text className="text-5xl mt-10 py-2 text-center font-montez text-black">
              Choose your team
            </Text>
            {teams.map((team) => (
              <CustomButton
                key={team.number}
                title={`${team.number} - ${team.name}`}
                handlePress={() => handleTeamSelection(team.number)}
                containerStyles="my-4 p-4"
                textStyles="text-2xl text-center text-white"
              />
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default GuestChooseTeam;
