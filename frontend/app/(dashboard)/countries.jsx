import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  FlatList,
  ImageBackground,
  ScrollView,
  LogBox,
  RefreshControl,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Loader from "../../components/Loader";
import { get_country_mappings } from "../../api/country_functions";

import { images } from "../../constants";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);

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
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const renderItem = ({ item }) => (
    <View
      className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
    >
      <View className="flex flex-col ">
        <Text className="text-4xl font-montez">{item.name}</Text>
        <Text className="text-2xl font-montez">Owner: Team {item.teamNo}</Text>
      </View>

      <CustomButton
        title="Edit"
        handlePress={() =>
          router.navigate(
            `/edit_country?countryName=${item.name.trim()}&teamNo=${
              item.teamNo
            }`
          )
        }
        containerStyles="w-1/4 h-2/3 mt-2 "
        textStyles="text-2xl"
      />
    </View>
  );

  if (isRefreshing) {
    return (
      <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="flex-1 bg-black">
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
    <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="bg-black h-full">
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

          <Text className="text-6xl text-center font-montez py-2 mt-7">
              Countries
            </Text>

            {error ? (
              <Text style={{ color: "white", textAlign: "center" }}>
                {error}
              </Text>
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
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Countries;
