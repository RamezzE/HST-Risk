import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  LogBox,
  RefreshControl,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { logout } from "../../api/user_functions";
import { get_settings } from "../../api/settings_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [settings, setSettings] = useState([]);

  const insets = useSafeAreaInsets();

  const logoutFunc = async () => {
    try {
      const result = await logout();
      if (result.success) {
      } else {
        setError(result.errorMsg);
      }
    } catch (err) {
      setError("Failed to logout");
    } finally {
      router.navigate("/");
    }
  };

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);

    try {
      const result = await get_settings();

      console.log(result);

      if (result.errorMsg) {
        setError(result.errorMsg);
      } else {
        setSettings(result);
      }
    } catch (err) {
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex flex-col ">
          <Text className="text-4xl font-montez">
            {item.name}
          </Text>
          <Text className="text-3xl font-montez">
            Value: {item.value}
          </Text>
        </View>

        <CustomButton
          title="Edit"
          handlePress={() => {}}
          containerStyles="w-1/4 h-2/3 mt-2"
          textStyles="text-2xl"
        />
      </View>
    );
  };

  if (isRefreshing) {
    return (
      <View style={{ paddingTop: insets.top, paddingRight: insets.right, paddingLeft: insets.left}} className="flex-1 bg-black">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="25" color="#000" />
          </View>
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
          <View className="w-full justify-start min-h-[82.5vh] max-h-[90vh] p-4">
            <BackButton
              style="w-[20vw]"
              color="black"
              size={32}
              onPress={() => {
                logoutFunc();
              }}
            />

            <Text className="text-6xl text-center font-montez py-2">
              Dashboard
            </Text>

            {error ? (
              <Text style={{ color: "white", textAlign: "center" }}>
                {error}
              </Text>
            ) : (
              <>
                {/* <CustomButton
                  title="Start Game"
                  onPress={() => {
                    logoutFunc();
                  }}
                  containerStyles={"mb-5 p-3"}
                  textStyles={"text-2xl"}
                /> */}

                <View className="flex flex-col justify-start w-full">
                  <Text className="font-montez text-4xl text-left ">
                    Settings
                  </Text>

                  <FlatList
                    data={settings}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={
                      <Text className="text-5xl text-black text-center font-montez p-5">
                        No attacks Found
                      </Text>
                    }
                  />
                </View>

                <CustomButton
                  title="Logout"
                  onPress={() => {
                    logoutFunc();
                  }}
                />
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Dashboard;
