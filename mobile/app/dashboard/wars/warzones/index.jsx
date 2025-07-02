import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
} from "react-native";
import CustomButton from "../../../../components/CustomButton";
import { router } from "expo-router";
import Loader from "../../../../components/Loader";
import BackButton from "../../../../components/BackButton";

import { get_warzones } from "../../../../api/warzone_functions";

import { GlobalContext } from "../../../../context/GlobalProvider";

const Warzones = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    try {
      const result = await get_warzones();
      if (result.success === false)
        setError(result.errorMsg);
      else if (Array.isArray(result))
        globalDispatch({ type: "SET_WARZONES", payload: result });
      else
        setError("Unexpected response format");

    } catch (err) {
      setError("Failed to fetch warzones");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderWarzones = () => {
    if (!Array.isArray(globalState.warzones)) {
      return (
        <Text className="text-center">
          No warzones available or unexpected data format.
        </Text>
      );
    }

    const renderWars = (warzone) => {
      return warzone.wars.map((item, index) => (
        <View key={index} className="flex flex-row justify-between">
          <Text className="font-pregular text-[16px]">{item.name}</Text>
          {item.location != "" && (
            <Text className="font-pregular text-[16px]">{item.location}</Text>
          )}
        </View>
      ));
    };

    return globalState.warzones.map((item, index) => (
      <View
        key={index}
        className="flex flex-row justify-between items-center my-2 p-4 rounded-md"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex-col flex-1 mr-6">
          <Text className="font-pmedium text-xl">{item.name}</Text>
          {renderWars(item)}
        </View>

        <CustomButton
          title="Edit"
          handlePress={() => {
            const jsonData = JSON.stringify(item.wars);
            router.push(
              `/dashboard/wars/warzones/edit?id=${item._id}&name=${item.name}&wars=${jsonData}`
            );
          }}
          containerStyles="w-1/4 h-2/3 mt-2 self-end"
          textStyles="text-xl font-pregular"
        />
      </View>
    ));
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
          onRefresh={() => {
            setIsRefreshing(true);
            fetchData();
          }}
          tintColor="#000"
        />
      }
      bounces={true}
      overScrollMode="never"
    >
      <View className="justify-start mb-24 p-4 w-full">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => router.back()}
        />
        <Text className="mt-7 py-2 font-montez text-6xl text-center">
          Warzones
        </Text>
        <CustomButton
          title="Add Warzone"
          handlePress={() => router.navigate("/dashboard/wars/warzones/add")}
          containerStyles="w-[45%] my-2 p-3"
          textStyles={"text-2xl"}
        />
        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {error}
          </Text>
        ) : (
          renderWarzones()
        )}
      </View>
    </ScrollView>

  );
};

export default Warzones;
