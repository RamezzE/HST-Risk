import React, { useState, useContext } from "react";

import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";

import Loader from "../../../components/Loader";
import { get_country_mappings } from "../../../api/country_functions";
import { GlobalContext } from "../../../context/GlobalProvider";

const Countries = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);

    try {
      const result = await get_country_mappings();

      if (result.success === false) 
        setError(result.errorMsg);
      else if (Array.isArray(result)) 
        globalDispatch({ type: "SET_COUNTRIES", payload: result });
      else 
        setError("Unexpected response format");
      
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderCountries = () => {
    if (!Array.isArray(globalState.countries)) {
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

    return globalState.countries.map((item, index) => {
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
                  `/dashboard/countries/edit?countryName=${item.name.trim()}&teamNo=${item.teamNo
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
          onRefresh={() =>{
            setIsRefreshing(true);
            fetchData();
          }}
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
