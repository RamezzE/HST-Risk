import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "../../constants";
import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";

import { get_warzones } from "../../api/warzone_functions";

import { useFocusEffect } from "@react-navigation/native";

import { GlobalContext } from "../../context/GlobalProvider";

const Warzones = () => {
  const [warzones, setWarzones] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { socket } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_warzones();
      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result)) {
        setWarzones(result);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch warzones");
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch initial data

      // Set up socket listeners for real-time updates
      socket.on("new_warzone", (newWarzone) => {
        setWarzones((prevWarzones) => [newWarzone, ...prevWarzones]);
      });

      socket.on("update_warzone", (updatedWarzone) => {
        setWarzones((prevWarzones) =>
          prevWarzones.map((warzone) =>
            warzone._id === updatedWarzone._id ? updatedWarzone : warzone
          )
        );
      });

      socket.on("delete_warzone", (deletedWarzoneId) => {
        setWarzones((prevWarzones) =>
          prevWarzones.filter((warzone) => warzone._id !== deletedWarzoneId)
        );
      });

      return () => {
        socket.off("new_warzone");
        socket.off("update_warzone");
        socket.off("delete_warzone");
      };
    }, [])
  );

  const renderWarzones = () => {
    if (!Array.isArray(warzones)) {
      return (
        <Text className="text-center">
          No warzones available or unexpected data format.
        </Text>
      );
    }

    const renderWars = (warzone) => {
      return warzone.wars.map((item, index) => (
        <View key={index} className="flex flex-row justify-between">
          <Text className="text-[16px] font-pregular">{item.name}</Text>
          {item.location != "" && (
            
            <Text className="text-[16px] font-pregular">{item.location}</Text>
          )}
        </View>
      ));
    };

    return warzones.map((item, index) => (
      <View
        key={index}
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex-1 mr-6 flex-col">
          <Text className="text-xl font-pmedium">{item.name}</Text>
          {renderWars(item)}
        </View>

        <CustomButton
          title="Edit"
          handlePress={() => {
            const jsonData = JSON.stringify(item.wars);
            router.push(
              `/edit_warzone?id=${item._id}&name=${item.name}&wars=${jsonData}`
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
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchData}
              tintColor="#000"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="w-full justify-start p-4 mb-24">
            <BackButton
              style="w-[20vw]"
              size={32}
              onPress={() => router.navigate("/dashboard_attacks")}
            />
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Warzones
            </Text>
            <CustomButton
              title="Add Warzone"
              handlePress={() => router.navigate("/add_warzone")}
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
      </ImageBackground>
    </View>
  );
};

export default Warzones;
