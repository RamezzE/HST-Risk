import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  LogBox,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { get_admins } from "../../api/admin_functions";

import BackButton from "../../components/BackButton";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_admins();
      console.log(result);
      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result.admins)) {
        setAdmins(result.admins);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const renderItem = ({ item }) => (
    <View
      className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
      style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
    >
      <View className="flex flex-col ">
        <Text className="text-4xl font-montez">{item.name}</Text>
        <Text className="text-2xl font-montez">War: {item.war}</Text>
      </View>

      <CustomButton
        title="Edit"
        handlePress={() =>
          router.push(
            `/edit_admin?name=${item.name.trim()}&password=${item.password.trim()}&war=${item.war.trim()}`
          )
        }
        containerStyles="w-1/4 h-2/3 mt-2 "
        textStyles="text-2xl"
      />
    </View>
  );

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
            <BackButton style="w-[20vw]" color="black" size={32} path="/" />

            <Text className="text-6xl text-center font-montez py-2">
              Admins
            </Text>

            <CustomButton
              title="Add Admin"
              handlePress={() => router.push("/add_admin")}
              containerStyles="w-1/2 my-2 p-3"
              textStyles={"text-2xl"}
            />

            <View>
              {error ? (
                <Text style={{ color: "white", textAlign: "center" }}>
                  {error}
                </Text>
              ) : (
                <FlatList
                  data={admins}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  ListEmptyComponent={
                    <Text className="text-5xl text-black text-center font-montez p-5">
                      No Admins Found
                    </Text>
                  }
                />
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Admins;
