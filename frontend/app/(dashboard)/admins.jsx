import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get_admins } from "../../api/admin_functions";
import { images } from "../../constants";
import Loader from "../../components/Loader";

import { GlobalContext } from './../../context/GlobalProvider';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { socket } = useContext(GlobalContext);

  const fetchData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await get_admins();
      if (result.success === false) {
        setError(result.errorMsg);
      } else if (Array.isArray(result.admins)) {
        setAdmins(result.admins);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();      

      socket.on("update_admin", (editedAdmin) => {
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin._id === editedAdmin._id ? editedAdmin : admin
          )
        );
      });

      socket.on("delete_admin", (deletedAdmin) => {
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.name !== deletedAdmin)
        );
      });

      return () => {
        socket.off("new_admin");
        socket.off("delete_admin");
      }
    }, [])
  );

  const renderAdmins = () => {

    if (!Array.isArray(admins)) {
      return (
        <Text className="text-center">
          No admins available or unexpected data format.
        </Text>
      );
    }

    return admins.map((item, index) => (
      <View
        key={index}
        className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
      >
        <View className="flex flex-col">
          <Text className="text-2xl font-pmedium">{item.name}</Text>
          <Text className="text-xl font-pregular">Type: {item.type}</Text>
          {item.type == "Wars" && <Text className="text-xl font-pregular">War: {item.war}</Text>}
        </View>

        <CustomButton
          title="Edit"
          handlePress={() =>
            router.push(
              `/edit_admin?name=${item.name.trim()}&password=${item.password.trim()}&war=${item.war.trim()}&type=${item.type.trim()}`

            )
          }
          containerStyles="p-2 px-4 mt-2"
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
            <Text className="text-6xl text-center font-montez py-2 mt-7">
              Admins
            </Text>

            <View className="flex flex-row justify-between">
              <CustomButton
                title="Add Admin"
                handlePress={() => router.replace("/add_admin")}
                containerStyles="w-[45%] my-2 p-3"
                textStyles={"text-2xl"}
              />
            </View>

            {error ? (
              <Text style={{ color: "white", textAlign: "center" }}>
                {error}
              </Text>
            ) : (
              renderAdmins()
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Admins;
