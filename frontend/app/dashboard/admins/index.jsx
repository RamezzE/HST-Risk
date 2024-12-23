import React, { useReducer, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";
import { get_admins } from "../../../api/admin_functions";
import Loader from "../../../components/Loader";

import { GlobalContext } from "../../../context/GlobalProvider";

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
};

const Admins = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await get_admins();

      if (result.success === false)
        dispatch({ type: "SET_ERROR", payload: result.errorMsg });
      else if (Array.isArray(result.admins))
        globalDispatch({ type: "SET_ADMINS", payload: result.admins });
      else
        dispatch({ type: "SET_ERROR", payload: "Unexpected response format" });

    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch admins" });
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    }
  };

  const renderAdmins = () => {
    if (!Array.isArray(globalState.admins)) {
      return (
        <Text className="text-center">
          No admins available or unexpected data format.
        </Text>
      );
    }

    return globalState.admins.map((item, index) => (
      <View
        key={index}
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex flex-col">
          <Text className="text-2xl font-pmedium">{item.name}</Text>
          <Text className="text-xl font-pregular">Type: {item.type}</Text>
          {item.type == "Wars" && (
            <Text className="text-xl font-pregular">War: {item.war}</Text>
          )}
        </View>

        <CustomButton
          title="Edit"
          handlePress={() =>
            router.push(
              `/dashboard/admins/edit?name=${item.name.trim()}&password=${item.password.trim()}&war=${item.war.trim()}&type=${item.type.trim()}`
            )
          }
          containerStyles="p-2 px-4 mt-2"
          textStyles="text-xl font-pregular"
        />
      </View>
    ));
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
      contentContainerStyle={{ paddingBottom: 20 }}
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full justify-start p-4 mb-24">
        <Text className="text-6xl text-center font-montez py-2 mt-7">
          Admins
        </Text>

        <View className="flex flex-row justify-between">
          <CustomButton
            title="Add Admin"
            handlePress={() => router.replace("/dashboard/admins/add")}
            containerStyles="w-[45%] my-2 p-3"
            textStyles={"text-2xl"}
          />
        </View>

        {state.error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {state.error}
          </Text>
        ) : (
          renderAdmins()
        )}
      </View>
    </ScrollView>
  );
};

export default Admins;
