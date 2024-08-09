import { View, Text, SafeAreaView, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";

import { get_admins } from "../../api/admin_functions";

import CustomButton from "../../components/CustomButton";

const Admins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get_admins();
        if (result && result.admins) {  // Adjust this line based on your API response structure
          setAdmins(result.admins);
        } else {
          setAdmins([]); // Ensure an empty array is set if there's no data
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View className="p-4 mb-4 rounded-[8px] flex flex-row justify-between items-center">
      <View className="flex flex-col ">
        <Text className="text-white text-xl font-semibold">{item.name}</Text>
        <Text className="text-white text-sm">War: {item.war}</Text>
      </View>

      <CustomButton
        title="Edit"
        handlePress={() =>
          router.push(`/edit_admin?name=${item.name.trim()}&password=${item.password.trim()}&war=${item.war.trim()}`)
        }
        containerStyles="w-1/3 mt-2"
        textStyles="text-sm"
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center min-h-[85vh] my-16 pb-16 px-4">
        <Text className="text-white text-3xl text-center text-semibold mb-5">
          Admins
        </Text>

        <CustomButton
          title="Add Admin"
          handlePress={() => router.push("/add_admin")}
          containerStyles="w-1/3 mt-4"
        />

        <FlatList
          data={admins}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-2xl text-white text-center mt-5">
              No Admins Found
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Admins;
