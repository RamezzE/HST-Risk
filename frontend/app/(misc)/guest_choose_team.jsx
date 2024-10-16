import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

import { GlobalContext } from "../../context/GlobalProvider";

import BackButton from "../../components/BackButton";

import Loader from "../../components/Loader";

import { get_all_teams } from "../../api/team_functions";
import { addPushToken } from "../../api/user_functions";

const GuestChooseTeam = () => {
  
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);

    try {
      const result = await get_all_teams();

      if (result.errorMsg) 
        console.log(result.errorMsg);
      else 
        globalDispatch({ type: "SET_TEAMS", payload: result });
      
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTeamSelection = async (teamNo) => {
    setIsSubmitting(true);

    try {
      globalDispatch({ type: "SET_TEAM_NO", payload: teamNo });
      globalDispatch({ type: "SET_SUBTEAM", payload: "" });
      globalDispatch({ type: "SET_USER_MODE", payload: "guest" });
      await addPushToken(globalState.expoPushToken, teamNo);
      router.replace("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRefreshing) {
    return (
      <Loader />
    );
  }

  return (

    <View className="w-full min-h-[82.5vh] px-4 my-6 flex flex-col justify-start">
      <BackButton
        style="w-[20vw] mb-4"
        size={32}
        onPress={() => router.dismiss()}
      />
      <Text className="text-5xl mt-10 py-2 text-center font-montez text-black">
        Choose your team
      </Text>
      {Array.isArray(globalState.teams) &&
        globalState.teams.map((team) => (
          <CustomButton
            key={team.number}
            title={`${team.number} - ${team.name}`}
            handlePress={async () =>
              await handleTeamSelection(team.number)
            }
            containerStyles="my-4 p-4"
            textStyles="text-2xl text-center text-white"
            isLoading={isSubmitting}
          />
        ))}
    </View>
  );
};

export default GuestChooseTeam;
