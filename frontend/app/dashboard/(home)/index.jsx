import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";

import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";
import { get_settings } from "../../../api/settings_functions";
import BackButton from "../../../components/BackButton";
import Loader from "../../../components/Loader";
import { GlobalContext } from "../../../context/GlobalProvider";
import { create_teams } from "../../../api/team_functions";

import { useFocusEffect } from "@react-navigation/native";
import { Logout } from "../../../helpers/AuthHelpers";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  const logoutFunc = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?\nYou won't be able to log back in without your username and password.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            Logout(globalDispatch);
            router.replace("/");
          },
        },
      ]
    );
  };

  const fetchData = async () => {
    setError(null);

    try {
      const result = await get_settings();
      if (result.errorMsg) 
        setError(result.errorMsg);
      else 
        globalDispatch({ type: "SET_SETTINGS", payload: result });
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const createNewGameAlert = async () => {
    Alert.alert(
      "Create New Game",
      `Are you sure you want to create a new game?\nThis will erase current teams and subteams data.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create New Game",
          onPress: () => {
            createNewGame();
          },
        },
      ]
    );
  };

  const createNewGame = async () => {
    setIsSubmitting(true);

    const filteredSettings = Array.isArray(globalState.settings)
      ? globalState.settings.filter(
        (setting) =>
          setting.name === "No of Teams" || setting.name === "No of Subteams"
      )
      : [];

    // Find the values, ensuring the result is defined before accessing .value
    const noOfTeams = filteredSettings.find(
      (setting) => setting.name === "No of Teams"
    )?.value;

    const noOfSubteams = filteredSettings.find(
      (setting) => setting.name === "No of Subteams"
    )?.value;

    try {
      const result = await create_teams(noOfTeams, noOfSubteams);

      if (result.success) {
        Alert.alert(
          "Success",
          "New Game Created Successfully.\nAll users will be logged out automatically"
        );
        router.navigate("/dashboard/teams");
      } else {
        Alert.alert("Error", result.errorMsg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsRefreshing(true);
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (globalState.userMode != "super_admin") {
        router.replace("/");
        return;
      }
      fetchData();

    }, [])
  );

  const titles = [
    "Cost & Rate",
    "Cooldowns",
    "Max Attacks/ Defences",
    "New Game Settings",
  ];

  const renderSettings = () => {
    if (!Array.isArray(globalState.settings)) {
      return (
        <Text className="text-center">
          No settings available or unexpected data format.
        </Text>
      );
    }

    return globalState.settings.map((item, index) => {
      // Determine which title to show based on index
      const showTitle = () => {
        if (index === 0) return titles[0];
        if (index === 2) return titles[1];
        if (index === 4) return titles[2];
        if (index === 6) return titles[3];
        return null;
      };

      return (
        <React.Fragment key={index}>
          <View
            className="p-4 my-2 rounded-md flex flex-row justify-between items-center"
            style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
          >
            <View className="flex flex-col w-[70%]">
              <Text className="text-2xl font-pmedium">{item.name}</Text>
              <Text className="text-xl font-pregular">Value: {item.value}</Text>
            </View>

            <CustomButton
              title="Edit"
              handlePress={() => {
                const jsonData = JSON.stringify(item.options);
                router.push(
                  `/dashboard/edit?name=${item.name}&value=${item.value}&options=${jsonData}`
                );
              }}
              containerStyles="w-1/4 h-2/3 mt-2"
              textStyles="text-2xl"
            />
          </View>

          {showTitle() && (
            <Text className="text-3xl text-center text-black font-montez p-5">
              {showTitle()}
            </Text>
          )}
        </React.Fragment>
      );
    });
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
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full justify-start p-4 mb-24">
        <BackButton
          style="w-[20vw]"
          size={32}
          onPress={() => {
            logoutFunc();
          }}
        />

        <Text className="text-6xl text-center font-montez py-2">
          Dashboard
        </Text>
        <View className="flex flex-row w-full justify-between items-center">
          <CustomButton
            title="View Map"
            handlePress={() => {
              router.navigate("/dashboard/map");
            }}
            containerStyles="w-[45%] mt-2 mb-6 p-3"
            textStyles={"text-2xl"}
            isLoading={isSubmitting}
          />
          <CustomButton
            title="New Game"
            handlePress={() => {
              createNewGameAlert();
            }}
            containerStyles="w-[45%] mt-2 mb-6 p-3"
            textStyles={"text-2xl"}
            isLoading={isSubmitting}
          />
        </View>


        <Text className="font-montez text-4xl text-left mb-3">
          Settings
        </Text>
        {error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {error}
          </Text>
        ) : (
          renderSettings()
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
