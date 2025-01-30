import React, { useEffect, useCallback, useContext, useReducer } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import Loader from "../../components/Loader";
import { get_country_mappings } from "../../api/country_functions";

import { GlobalContext } from "../../context/GlobalProvider";

const initialState = {
  error: null,
  isRefreshing: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    default:
      return state;
  }
}

const Countries = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const result = await get_country_mappings();

      if (result.success === false)
        dispatch({ type: "SET_ERROR", payload: result.errorMsg })
      else if (Array.isArray(result))
        globalDispatch({ type: "SET_COUNTRIES", payload: result })
      else
        dispatch({ type: "SET_ERROR", payload: "Unexpected response format" })

    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch countries" })
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false })
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
            <Text className="my-4 font-montez text-3xl text-left">{title}</Text>
          )}
          <View
            className="flex flex-row flex-wrap justify-between items-center my-2 p-4 rounded-md"
            style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
          >
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="font-pmedium text-xl">{item.name}</Text>
              <Text className="font-pregular text-[16px]">
                Team {item.teamNo}
              </Text>
            </View>

          </View>
        </React.Fragment>
      );
    });
  };

  if (state.isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={() => {
            dispatch({ type: "SET_IS_REFRESHING", payload: true });
            fetchData();
          }}
          tintColor="#000"
        />
      }
      bounces={true}
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="justify-center mb-24 p-4 w-full min-h-[82.5vh]">
        <Text className="mt-7 py-2 font-montez text-6xl text-center">
          Countries
        </Text>

        {state.error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {state.error}
          </Text>
        ) : (
          renderCountries()
        )}
      </View>
    </ScrollView>
  );
};

export default Countries;
