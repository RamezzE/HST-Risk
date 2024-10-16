import React, { useEffect, useContext, useReducer } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { GlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

import { set_attack_result, delete_attack } from "../../api/attack_functions";
import { Logout } from "../../helpers/AuthHelpers";
import { FilterAttacksByWar } from "../../helpers/AttackHelper";
import { GetAssignedWar } from "../../helpers/AdminHelper";

const initialState = {
  currentAttack: null,
  war: null,
  isSubmitting: false,
  isRefreshing: true,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_ATTACK":
      return { ...state, currentAttack: action.payload };
    case "SET_WAR":
      return { ...state, war: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    default:
      return state;
  }
}

const AdminHome = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {

    const filteredAttacks = FilterAttacksByWar(globalState.attacks, state.war)

    if (filteredAttacks.length > 0)
      dispatch({ type: "SET_CURRENT_ATTACK", payload: filteredAttacks[0] });
    else
      dispatch({ type: "SET_CURRENT_ATTACK", payload: null });

  }, [globalState.attacks, state.war])

  const fetchData = async () => {

    try {
      const response = await GetAssignedWar(globalState.name);

      if (!response.success) {
        Alert.alert("Error", response.errorMsg);
        return;
      }

      dispatch({ type: "SET_WAR", payload: response.war });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    }
  };

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

  const deleteAttack = async (attack_id) => {
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });
    try {
      const response = await delete_attack(attack_id);

      if (response.success)
        Alert.alert("Success", "Attack cancelled successfully");
      else
        Alert.alert("Error", response.errorMsg);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to cancel attack");
    } finally {
      dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    }
  };

  const cancelAttackAlert = (attack_id) => {
    Alert.alert(
      "Cancel Attack",
      `Are you SURE that you want to cancel this attack?\nThis action cannot be undone.\nYou are advised to wait for the timer to expire first.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm Cancelling Attack",
          onPress: async () => {
            deleteAttack(attack_id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setAttackResultAlert = (attackWon) => {
    const team =
      attackWon === "true"
        ? state.currentAttack.attacking_team
        : state.currentAttack.defending_team;

    const subteam = attackWon === "true" ? state.currentAttack.attacking_subteam : "";
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
            setResult(attackWon);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setResult = async (attackWon) => {
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });

    try {
      let team;
      if (attackWon === "true") team = state.currentAttack.attacking_team;
      else if (attackWon === "false") team = state.currentAttack.defending_team;

      const response = await set_attack_result(state.currentAttack._id, team);

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
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full min-h-[100vh] px-4 py-5 flex flex-col justify-start">
        <View>
          <BackButton
            style="w-[20vw] mb-6"
            size={32}
            onPress={() => logoutFunc()}
          />

          <Text className="font-montez text-black text-5xl px-5 pt-1 text-center">
            Welcome, {globalState.name}
          </Text>

          <Text className="font-montez text-black text-center mt-1 text-4xl ">
            {state.war}
          </Text>
        </View>

        <View
          className="rounded-md mt-3 px-2 flex-1 flex-col justify-start"
          style={{ backgroundColor: "rgba(32, 20, 2, 0.6)" }}
        >
          {state.currentAttack != null ? (
            <View className="h-full flex flex-col justify-between py-4">
              <View>
                <Text className="font-pregular text-white text-2xl px-5 py-2 text-left">
                  Attacking Side:
                </Text>
                <Text className="font-pbold text-white text-xl px-5 py-2 text-left">
                  Team {state.currentAttack.attacking_team}
                  {state.currentAttack.attacking_subteam},{" "}
                  {state.currentAttack.attacking_zone}
                </Text>
                <Text></Text>
                <Text className="font-pregular text-white text-2xl px-5 py-2 text-left">
                  Defending Side:
                </Text>
                <Text className="font-pbold text-white text-xl px-5 py-2 text-left">
                  Team {state.currentAttack.defending_team},{" "}
                  {state.currentAttack.defending_zone}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="font-montez text-white text-4xl p-5 text-center ">
              No current attack
            </Text>
          )}
        </View>

        <View>
          {state.currentAttack != null && (
            <Timer
              attack_id={state.currentAttack._id}
              textStyles={
                "text-3xl text-red-800 mt-4 mb-2 text-center font-psemibold"
              }
              expiryMessage="Timer expired"
            />
          )}
          <View className="flex flex-row justify-between mr-1 mt-3">
            {state.currentAttack != null && (
              <View className="w-full">
                <View className="flex flex-row">
                  <CustomButton
                    title={`${state.currentAttack.attacking_team}${state.currentAttack.attacking_subteam} Won`}
                    textStyles={"text-xl font-pregular"}
                    containerStyles="w-1/2 mr-1 bg-green-800 p-3"
                    handlePress={() => setAttackResultAlert("true")}
                    isLoading={state.isSubmitting}
                  />
                  <CustomButton
                    title={`${state.currentAttack.defending_team} Won`}
                    textStyles={"text-xl font-pregular"}
                    containerStyles="w-1/2 ml-1 bg-red-800 p-3"
                    handlePress={() => setAttackResultAlert("false")}
                    isLoading={state.isSubmitting}
                  />
                </View>
                <CustomButton
                  title="Cancel Attack"
                  containerStyles="mt-5 p-3 mb-10"
                  textStyles={"text-xl font-pregular"}
                  handlePress={() => {
                    cancelAttackAlert(state.currentAttack._id);
                  }}
                  isLoading={state.isSubmitting}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminHome;