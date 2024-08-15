import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ImageBackground } from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "../../components/BackButton"

import { get_country_mappings } from "../../api/country_functions";

import { images } from "../../constants";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);

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
    <View className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
    style={{ backgroundColor : 'rgba(75,50,12,0.25)' }}>
      <View className="flex flex-col ">
        <Text className="text-4xl font-montez">{item.name}</Text>
        <Text className="text-2xl font-montez">Owner: Team {item.teamNo}</Text>
      </View>

      <CustomButton
        title="Edit"
        handlePress={() =>
          router.push(
            `/edit_country?countryName=${item.name.trim()}&teamNo=${item.teamNo}`
          )
        }
        containerStyles="w-1/4 h-2/3 mt-2 "
        textStyles="text-2xl"
      />
    </View>


  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
      <View className="w-full justify-center min-h-[82.5vh] max-h-[90vh] p-4  ">

      <BackButton style="w-[20vw]" color="black" size={32} onPress={()=> {router.push("/")}} />

      <Text className="text-6xl text-center font-montez py-2">
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
                <Text className="text-5xl text-black text-center font-montez p-5">
                  No Countries Found
                </Text>
              }
            />
          )}
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Countries;
