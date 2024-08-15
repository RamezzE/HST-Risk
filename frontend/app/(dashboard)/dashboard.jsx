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
import { SafeAreaView } from "react-native-safe-area-context";

import { logout } from "../../api/user_functions";

import BackButton from "../../components/BackButton";

import { images } from "../../constants";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const logoutFunc = async () => {
    try {
      const result = await logout();
      if (result.success) {
      } else {
        setError(result.errorMsg);
      }
    }
    catch (err) {
      setError("Failed to logout");
    }
    finally {
      router.navigate("/");
    }
  };

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);

    try {
    } catch (err) {
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  if (isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <ImageBackground
          source={images.background}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="25" color="#000" />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
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
              <></>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Dashboard;
