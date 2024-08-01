import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { get_all_teams } from "../../api";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setError(null);

      try {
        const result = await get_all_teams();
        console.log("API Response:", result); // Log the API response

        if (result.success === false) {
          setError(result.errorMsg);
        } else if (Array.isArray(result)) {
          setTeams(result);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch teams");
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    console.log("Teams State:", teams); // Log the teams state
  }, [teams]);

  const renderItem = ({ item }) => (
    <View className="bg-gray-400 p-4 mb-4 rounded-[8px]">
      <Text className="text-white text-xl font-semibold">{item.name}</Text>
      <Text style={{ color: "white", fontSize: 14 }}>
        Team Number: {item.number}
      </Text>
      <View className = "flex flex-row justify-between align-center">
        <CustomButton
          title="View Team"
          // handlePress={() => router.push(`/team/${item.number}`)}
          containerStyles={"w-1/3 mt-2"}
          textStyles={"text-sm"}
        />
        <CustomButton
          title="Edit Team"
          // handlePress={() => router.push(`/team/${item.number}`)}
          containerStyles={"w-1/3 mt-2"}
          textStyles={"text-sm"}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center min-h-[75vh] px-4 my-6 pb-16">
        <Text className="text-white text-3xl text-center text-semibold mb-5">
          Teams
        </Text>

        <CustomButton
          title="Add Team"
          handlePress={() => router.push("/add_team")}
          containerStyles="p-1 w-1/2 my-5"
        />

        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>{error}</Text>
        ) : (
          <FlatList
            data={teams}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text className="text-3xl text-white text-center">
                No teams found
              </Text>
            }
          />
        )}

       
      </View>
    </SafeAreaView>
  );
};

export default Teams;
