import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../../components/BackButton"

import { get_country_mappings } from "../../api/country_functions";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const result = await get_country_mappings();

        if (result.success === false) {
          setError(result.errorMsg);
        } else if (Array.isArray(result)) {
          setCountries(result);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch teams");
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View className="p-4 mb-4 rounded-[8px] flex flex-row justify-between items-center">
      <View className="flex flex-col ">
        <Text className="text-white text-xl font-semibold">{item.name}</Text>
        <Text className="text-white text-sm">Owner: Team {item.teamNo}</Text>
      </View>

      <CustomButton
        title="Edit"
        handlePress={() =>
          router.push(
            `/edit_territory?countryName=${item.name.trim()}&teamNo=${item.teamNo}`
          )
        }
        containerStyles="w-1/3 mt-2"
        textStyles="text-sm"
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center min-h-[82.5vh] px-4 my-6 pb-16">

      <BackButton style="w-[20vw]" color="white" size={32} path="/" />

        <Text className="text-white text-3xl text-center text-semibold mb-5">
          Countries
        </Text>

          {error ? (
            <Text style={{ color: "white", textAlign: "center" }}>{error}</Text>
          ) : (
            <FlatList
              data={countries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text className="text-3xl text-white text-center">
                  No Countries Found
                </Text>
              }
            />
          )}
      </View>
    </SafeAreaView>
  );
};

export default Countries;
