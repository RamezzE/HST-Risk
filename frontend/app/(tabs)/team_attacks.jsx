import React, { useEffect, useReducer, useContext, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";

import { GlobalContext } from "../../context/GlobalProvider";
import { get_all_attacks } from "../../api/attack_functions";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

import { useFocusEffect } from "@react-navigation/native";

const initialState = {
  error: null,
  attackingAttacks: [],
  defendingAttacks: [],
  isRefreshing: true
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ATTACKING_ATTACKS":
      return { ...state, attackingAttacks: action.payload };
    case "SET_DEFENDING_ATTACKS":
      return { ...state, defendingAttacks: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    default:
      return state;
  }
}

const TeamAttacks = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const { globalState } = useContext(GlobalContext);

  const fetchData = async () => {


    dispatch({ type: "SET_ERROR", payload: null })
    try {
      const result = await get_all_attacks();

      const filteredAttackingAttacks = Array.isArray(result)
        ? result.filter((attack) => attack.attacking_team === globalState.teamNo.toString())
        : [];

      const filteredDefendingAttacks = Array.isArray(result)
        ? result.filter((attack) => attack.defending_team === globalState.teamNo.toString())
        : [];

      dispatch({ type: "SET_ATTACKING_ATTACKS", payload: filteredAttackingAttacks })
      dispatch({ type: "SET_DEFENDING_ATTACKS", payload: filteredDefendingAttacks })

    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch data" })
      console.error("Error fetching attacks:", err);
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false })
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch initial data
      fetchData();

      // Set up socket listeners for real-time updates
      globalState.socket.on("new_attack", (newAttack) => {

        if (newAttack.attacking_team.toString() === globalState.teamNo.toString())
          dispatch({ type: "SET_ATTACKING_ATTACKS", payload: [...state.attackingAttacks, newAttack] })

        else if (newAttack.defending_team.toString() === globalState.teamNo.toString())
          dispatch({ type: "SET_DEFENDING_ATTACKS", payload: [...state.defendingAttacks, newAttack] })

      });

      globalState.socket.on("remove_attack", (attackId) => {

        dispatch({
          type: "SET_ATTACKING_ATTACKS",
          payload: state.attackingAttacks.filter((attack) => attack._id !== attackId)
        });

        dispatch({
          type: "SET_DEFENDING_ATTACKS",
          payload: state.defendingAttacks.filter((attack) => attack._id !== attackId)
        });

      });

      // Clean up the socket listeners when the component loses focus or unmounts
      return () => {
        globalState.socket.off("new_attack");
        globalState.socket.off("remove_attack");
      };
    }, [globalState.teamNo])
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (state.isRefreshing) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={() => {
            dispatch({ type: "SET_IS_REFRESHING", payload: true })
            fetchData();
          }}
          tintColor="#000"
        />
      }
      bounces={false}
      overScrollMode="never"
    >
      <View className="w-full min-h-[82.5vh] px-4 py-4 flex flex-col justify-start">
        <Text className="font-montez text-center text-5xl py-5">
          Team {globalState.teamNo} Wars
        </Text>

        {state.error ? (
          <Text className="text-red-500 text-center p-2 text-xl">
            {state.error}
          </Text>
        ) : (
          <View style={{ backgroundColor: "rgb(75,50,12,1)" }}>
            <Text className="text-red-800 font-montez text-4xl p-2 mb-2">
              Ongoing Attacks
            </Text>
            <View className="mb-4">
              {Array.isArray(state.attackingAttacks) &&
                state.attackingAttacks.length > 0 ? (
                state.attackingAttacks.map((attack, index) => (
                  <View
                    key={index}
                    className="px-2 rounded-md mb-3"
                    style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                  >
                    <View className="p-2">
                      <Text className="text-black text-xl font-psemibold">
                        {attack.attacking_zone} ({attack.attacking_team}
                        {attack.attacking_subteam}) →{" "}
                        {attack.defending_zone} ({attack.defending_team}
                        {attack.defending_subteam})
                      </Text>
                      <Text className="text-black text-xl font-pregular mr-2">
                        {attack.war}
                      </Text>
                      {attack.location != "" && (
                        <Text className="text-black text-xl font-pregular">
                          Location: {attack.location}
                        </Text>
                      )}

                      <Timer
                        attack_id={attack._id}
                        textStyles={"font-pbold text-red-800 text-xl"}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-black text-3xl font-montez px-4">
                  You are not attacking now
                </Text>
              )}
            </View>

            <Text className="text-green-800 text-4xl font-montez p-2 mb-2">
              Ongoing Defense
            </Text>
            <View className="mb-4">
              {Array.isArray(state.defendingAttacks) &&
                state.defendingAttacks.length > 0 ? (
                state.defendingAttacks.map((attack, index) => (
                  <View
                    key={index}
                    className="px-2 rounded-md mb-3"
                    style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                  >
                    <View className="p-2">
                      <Text className="text-black text-xl font-psemibold">
                        {attack.attacking_zone} ({attack.attacking_team}
                        {attack.attacking_subteam}) →{" "}
                        {attack.defending_zone} ({attack.defending_team}
                        {attack.defending_subteam})
                      </Text>
                      <Text className="text-black text-xl font-pregular mr-2">
                        {attack.war}
                      </Text>
                      {attack.location != "" && (
                        <Text className="text-black text-xl font-pregular">
                          Location: {attack.location}
                        </Text>
                      )}
                      <Timer
                        attack_id={attack._id}
                        textStyles={"font-pbold text-red-800 text-xl"}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-black text-3xl font-montez px-4">
                  There are no attacks on you
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TeamAttacks;
