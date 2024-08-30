import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get_all_subteams } from "../../api/team_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";

import { GlobalContext } from "../../context/GlobalProvider";

const SubTeams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { socket } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_all_subteams();
      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result)) {
        setTeams(result);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch subteams");
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();

      socket.on("update_subteam", (editedSubteam) => {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.username === editedSubteam.username ? editedSubteam : team
          )
        );
      });

    }, [])
  );

  const renderSubTeams = () => {
    if (!Array.isArray(teams)) {
      return (
        <Text className="text-center">
          No teams available or unexpected data format.
        </Text>
      );
    }

    return teams.map((item, index) => (
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
            router.push(`/edit_subteam?username=${item.username}&password=${item.password}`)
          }
          containerStyles="w-1/4 h-2/3 mt-2"
          textStyles="text-xl font-pregular"
          />
      </View>
    ));
  };

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
      className="bg-black flex-1"
    >
      <ImageBackground
        source={images.background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchData}
              tintColor="#000"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="w-full justify-start p-4 mb-24">
            <BackButton 
              style="w-[20vw]"
              size={32}
              onPress={() => router.navigate('/teams')}
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
      </ImageBackground>
    </View>
  );
};

export default SubTeams;
