import React, { useEffect, useState, useContext } from "react";
import { View, Text, ImageBackground, ScrollView } from "react-native";
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

  useEffect(() => {
    get_all_teams().then((data) => {
      if (data.errorMsg) {
        console.log(data.errorMsg);
      } else {
        setTeams(data);
      }
    });
  }, []);

  const handleTeamSelection = (teamNo) => {
    setTeamNo(teamNo);
    router.replace("/guest_home");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView>
          <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-start">
            <BackButton
              style="w-[20vw] mb-4"
              color="#4B320C"
              size={32}
              onPress={() => router.replace("/")}
            />
            <Text className="text-5xl mt-10 py-1 text-center font-montez text-black">
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
