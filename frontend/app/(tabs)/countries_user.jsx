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
import PageWrapper from "../../components/PageWrapper";

const initialState = {
  countries: [],
  error: null,
  isRefreshing: true,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COUNTRIES":
      return { ...state, countries: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    case "UPDATE_COUNTRY":
      const updatedCountries = state.countries.map((country) => {
        if (country.name === action.payload.name)
          return action.payload;
        return country;
      });

      return { ...state, countries: updatedCountries };
    default:
      return state;
  }
}

const Countries = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const { globalState } = useContext(GlobalContext);

  const fetchData = async () => {
    dispatch({ type: "SET_ERROR", payload: null })
    dispatch({ type: "SET_IS_REFRESHING", payload: true })

    try {
      const result = await get_country_mappings();

      if (result.success === false)
        dispatch({ type: "SET_ERROR", payload: result.errorMsg })
      else if (Array.isArray(result))
        dispatch({ type: "SET_COUNTRIES", payload: result })
      else
        dispatch({ type: "SET_ERROR", payload: "Unexpected response format" })

    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch countries" })
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false })
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();

      globalState.socket.on("update_country", (updatedCountry) => {
        dispatch({ type: "UPDATE_COUNTRY", payload: updatedCountry })
      });

      return () => {
        globalState.socket.off("update_country");
      };
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const renderCountries = () => {
    if (!Array.isArray(state.countries)) {
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

    return state.countries.map((item, index) => {
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
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-xl font-pmedium">{item.name}</Text>
              <Text className="text-[16px] font-pregular">
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
      <PageWrapper>
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={fetchData}
            tintColor="#000"
          />
        }
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="w-full justify-center min-h-[82.5vh] p-4 mb-24">
          <Text className="text-6xl text-center font-montez py-2 mt-7">
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
    </PageWrapper>
  );
};

export default Countries;
