import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  ImageBackground,
  ScrollView,
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
  }, []);

  const renderCountries = () => {

    if (!Array.isArray(countries)) {
      return (
        <Text className="text-center">
          No countries available or unexpected data format.
        </Text>
      );
    }

    const titles = [
      "Africa",
      "Australia",
      "South America",
      "North America",
      "Asia & Europe",
    ];
  
    const showTitle = (index) => {
      if (index === 0) return titles[0];
      if (index === 6) return titles[1];
      if (index === 11) return titles[2];
      if (index === 18) return titles[3];
      if (index === 28) return titles[4];
      return null;
    };
  
    return countries.map((item, index) => {
      const title = showTitle(index);
  
      return (
        <React.Fragment key={item.name}>
          {title && (
            <Text className="text-3xl font-montez text-left my-4">
              {title}
            </Text>
          )}
          <View
            className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
            style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
          >
            <View className="flex flex-col">
              <Text className="text-4xl font-montez">{item.name}</Text>
              <Text className="text-2xl font-montez">
                Owner: Team {item.teamNo}
              </Text>
            </View>
  
            <CustomButton
              title="Edit"
              handlePress={() =>
                router.push(
                  `/edit_country?countryName=${item.name.trim()}&teamNo=${item.teamNo}`
                )
              }
              containerStyles="w-1/4 h-2/3 mt-2"
              textStyles="text-2xl"
            />
          </View>
        </React.Fragment>
      );
    });
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
        style={{ resizeMode: "cover" }}
        className="flex-1"  // Ensure it covers the full height
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchData}
              tintColor="#000"
            />
          }
        >
          <View className="w-full justify-center p-4">
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Countries
            </Text>
  
            {error ? (
              <Text style={{ color: "white", textAlign: "center" }}>
                {error}
              </Text>
            ) : (
              renderCountries()
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};  

export default Countries;
