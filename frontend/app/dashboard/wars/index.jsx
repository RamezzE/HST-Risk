import React, { useEffect, useReducer, useContext } from "react";
import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";

import { get_all_attacks } from "../../../api/attack_functions";

import { delete_attack, set_attack_result } from "../../../api/attack_functions";

import Loader from "../../../components/Loader";
import Timer from "../../../components/Timer";

import { GlobalContext } from "../../../context/GlobalProvider";

const initialState = {
  error: null,
  isRefreshing: false,
  isSubmitting: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    default:
      return state;
  }
};

const DashboardAttacks = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { globalState, globalDispatch } = useContext(GlobalContext);

  useEffect(() => {
    if (!Array.isArray(globalState.attacks))
      fetchData();

    return () => {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    };
    
  }, [globalState.attacks]);

  const fetchData = async () => {
    dispatch({ type: "SET_IS_REFRESHING", payload: true });

    try {
      const result = await get_all_attacks();

      if (result.success === false)
        dispatch({ type: "SET_ERROR", payload: result.errorMsg });

      else if (Array.isArray(result)) 
        globalDispatch({ type: "SET_ATTACKS", payload: result });

      else 
        dispatch({ type: "SET_ERROR", payload: "Unexpected Response Format" });
      
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error fetching attacks" });
      console.log(err);
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    }
  };

  

  const setAttackResultAlert = (
    attackWon,
    id,
    attacking_team,
    attacking_subteam,
    defending_team
  ) => {
    const team = attackWon === "true" ? attacking_team : defending_team;

    const subteam = attackWon === "true" ? attacking_subteam : "";
    Alert.alert(
      "Confirm",
      `Are you SURE that team ${team}${subteam} won?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setAttackResult(attackWon, id, attacking_team, defending_team);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setAttackResult = async (
    attackWon,
    id,
    attacking_team,
    defending_team
  ) => {
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });

    try {
      let team;
      if (attackWon === "true") team = attacking_team;
      else if (attackWon === "false") team = defending_team;

      const response = await set_attack_result(id, team);
      if (response.success)
        Alert.alert("Success", "Attack result set successfully");
      else 
        Alert.alert("Error", response.errorMsg);
      
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to set attack result");
    } finally {
      dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    }
  };

  const deleteAttack = async (id) => {
    const result = await delete_attack(id);
    if (result.success) {
      Alert.alert("Success", "Attack deleted successfully");
    } else {
      Alert.alert("Error", result.errorMsg);
    }
  };

  const deleteAttackAlert = async (
    id,
    attacking_zone,
    attacking_team,
    defending_zone,
    defending_team,
    war
  ) => {
    Alert.alert(
      "Delete Attack",
      `Are you sure you want to delete this attack?\nTeam ${attacking_team} VS Team ${defending_team} \n${attacking_zone} VS ${defending_zone}\nWar: ${war}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteAttack(id);
          },
        },
      ]
    );
  };

  const renderAttacks = () => {
    if (!Array.isArray(globalState.attacks)) {
      return (
        <Text className="text-center">
          No attacks available or unexpected data format.
        </Text>
      );
    }

    return globalState.attacks.map((item) => {
      return (
        <View
          key={item._id}
          className="flex flex-row justify-between items-center my-2 p-3 rounded-md"
          style={{ backgroundColor: "rgba(75,50,12,0.25)" }}
        >
          <View className="flex flex-col w-[72.5%]">
            <Text className="font-pmedium text-[24px]">
              {item.attacking_team}
              {item.attacking_subteam} VS {item.defending_team}
              {item.defending_subteam}
            </Text>
            <Text className="font-pregular text-xl">
              {item.attacking_zone} VS {item.defending_zone}
            </Text>
            <Text className="font-pregular text-xl">War: {item.war} </Text>
            <Text className="font-pregular text-xl">
              Location: {item.location}{" "}
            </Text>
            <Timer
              attack_id={item._id}
              textStyles="text-red-800 font-psemibold"
              expiryMessage="Timer expired"
            />
          </View>
          <View className="flex flex-col">
            <CustomButton
              title={`${item.attacking_team}${item.attacking_subteam}`}
              handlePress={() =>
                setAttackResultAlert(
                  "true",
                  item._id,
                  item.attacking_team,
                  item.attacking_subteam,
                  item.defending_team
                )
              }
              containerStyles="p-1 mt-2 bg-green-800"
              textStyles="text-xl font-pregular"
              isLoading={state.isSubmitting}
            />
            <CustomButton
              title={`${item.defending_team}`}
              handlePress={() =>
                setAttackResultAlert(
                  "false",
                  item._id,
                  item.attacking_team,
                  item.attacking_subteam,
                  item.defending_team
                )
              }
              containerStyles="p-2 px-4 mt-2 bg-red-800"
              textStyles="text-xl font-pregular"
              isLoading={state.isSubmitting}
            />
            <CustomButton
              title="Delete"
              handlePress={() => {
                deleteAttackAlert(
                  item._id,
                  item.attacking_zone,
                  item.attacking_team,
                  item.defending_zone,
                  item.defending_team,
                  item.war
                );
              }}
              containerStyles="p-2  mt-2"
              textStyles="text-xl font-pregular"
              isLoading={state.isSubmitting}
            />
          </View>
        </View>
      );
    });
  };

  if (state.isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
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
      bounces={true}
      overScrollMode="never"
    >
      <View className="justify-center mb-24 p-4 w-full">
        <Text className="mt-7 py-2 font-montez text-6xl text-center">
          Wars
        </Text>
        <View className="flex flex-row justify-between">
          <CustomButton
            title="Create Attack"
            handlePress={() => router.replace("/dashboard/wars/add")}
            containerStyles="w-[45%] my-2 p-3"
            textStyles={"text-2xl"}
          />
          <CustomButton
            title="View Warzones"
            handlePress={() => router.navigate("/dashboard/wars/warzones")}
            containerStyles="w-[45%] my-2 p-3"
            textStyles={"text-2xl"}
          />
        </View>
        {state.error ? (
          <Text style={{ color: "white", textAlign: "center" }}>
            {state.error}
          </Text>
        ) : (
          renderAttacks()
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardAttacks;
