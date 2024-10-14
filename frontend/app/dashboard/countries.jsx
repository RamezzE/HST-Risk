import React, { useEffect, useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

import Loader from "../../components/Loader";
import { get_country_mappings } from "../../api/country_functions";


import { GlobalContext } from "../../context/GlobalProvider";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const { socket } = useContext(GlobalContext);

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

      socket.on("update_country", (updatedCountry) => {
        setCountries((prevCountries) =>
          prevCountries.map((country) =>
            country.name === updatedCountry.name ? updatedCountry : country
          )
        );
      });

      return () => {
        socket.off("update_country");
      };
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
            <Text className="text-3xl font-montez text-left my-4">{title}</Text>
          )}
          <View
            className="p-4 my-2 rounded-md flex flex-row justify-between items-center flex-wrap"
            style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
          >
            <View className="flex flex-col">
              <Text className="text-2xl font-pmedium">{item.name}</Text>
              <Text className="text-[16px] font-pregular">
                Owner: Team {item.teamNo}
              </Text>
            </View>

            <CustomButton
              title="Edit"
              handlePress={() =>
                router.push(
                  `/edit_country?countryName=${item.name.trim()}&teamNo=${item.teamNo
                  }`
                )
              }
              containerStyles="p-2 px-4 mt-2"
              textStyles="text-xl font-pregular"
            />
          </View>
        </React.Fragment>
      );
    });
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
          onRefresh={fetchData}
          tintColor="#000"
        />
      }
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full justify-center p-4 mb-24">
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
  );
};

export default Countries;
