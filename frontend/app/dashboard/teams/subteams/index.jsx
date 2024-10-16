import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";
import CustomButton from "../../../../components/CustomButton";
import { router } from "expo-router";
import { get_all_subteams } from "../../../../api/team_functions";
import Loader from "../../../../components/Loader";
import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../context/GlobalProvider";

const SubTeams = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    try {
      const result = await get_all_subteams();
      if (result.success === false) 
        setError(result.errorMsg);
      else if (Array.isArray(result))
        globalDispatch({ type: "SET_SUBTEAMS", payload: result });
      else
        setError("Unexpected response format");
      
    } catch (err) {
      setError("Failed to fetch subteams");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderSubTeams = () => {
    if (!Array.isArray(globalState.subteams)) {
      return (
        <Text className="text-center">
          No teams available or unexpected data format.
        </Text>
      );
    }

    return globalState.subteams.map((item, index) => (
      <View
        key={index}
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex flex-col">
          <Text className="text-xl font-pregular">Team {item.username}</Text>
          <Text className="text-xl font-pregular">{item.name}</Text>
        </View>

        <CustomButton
          title="Edit"
          handlePress={() =>
            router.push(
              `/dashboard/teams/subteams/edit?username=${item.username}&password=${item.password}`
            )
          }
          containerStyles="w-1/4 h-2/3 mt-2"
          textStyles="text-xl font-pregular"
        />
      </View>
    ));
  };

  if (isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
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
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full justify-start p-4 mb-24">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => router.navigate("/dashboard/teams")}
        />
        <Text className="text-6xl text-center font-montez py-2 mt-7">
          Subteams
        </Text>

        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {error}
          </Text>
        ) : (
          renderSubTeams()
        )}
      </View>
    </ScrollView>
  );
};

export default SubTeams;
