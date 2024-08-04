import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { get_all_teams } from "../../api/team_functions";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      setError(null);

      try {
        const result = await get_all_teams();

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

  const renderItem = ({ item }) => (
    <View className="p-4 mb-4 rounded-[8px] flex flex-row justify-between items-center">
      <View className="flex flex-col ">
        <Text className="text-white text-xl font-semibold">{item.name}</Text>
        <Text className="text-white text-sm">Owner: Team {item.number}</Text>
      </View>
        
      <CustomButton
        title="Edit"
        handlePress={() => router.push(`/edit_territory?teamNo=${item.number}`)}
        containerStyles="w-1/3 mt-2"
        textStyles="text-sm"
      />

    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center min-h-[75vh] px-4 my-6 pb-16">
        <Text className="text-white text-3xl text-center text-semibold mb-5">
          Territories
        </Text>

        <CustomButton
          title="Add Territory"
          handlePress={() => router.push("/add_territory")}
          containerStyles="p-1 w-1/2 my-5"
        />

        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>{error}</Text>
        ) : (
          <FlatList
            // data={teams}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text className="text-3xl text-white text-center">
                No Terrorities Found
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Teams;