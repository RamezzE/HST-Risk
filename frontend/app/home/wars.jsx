import React, { useEffect, useReducer, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";

import { GlobalContext } from "../../context/GlobalProvider";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";

import { get_all_attacks } from "../../api/attack_functions";

const initialState = {
  error: null,
  attackingAttacks: [],
  defendingAttacks: [],
  isRefreshing: false,
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

  useEffect(() => {

    const filteredAttackingAttacks = Array.isArray(globalState.attacks)
      ? globalState.attacks.filter((attack) => attack.attacking_team.toString() === globalState.teamNo.toString())
      : [];

    const filteredDefendingAttacks = Array.isArray(globalState.attacks)
      ? globalState.attacks.filter((attack) => attack.defending_team.toString() === globalState.teamNo.toString())
      : [];

    dispatch({ type: "SET_ATTACKING_ATTACKS", payload: filteredAttackingAttacks })
    dispatch({ type: "SET_DEFENDING_ATTACKS", payload: filteredDefendingAttacks })

  }, [globalState.attacks, globalState.teamNo])


  const fetchData = async () => {

    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const response = await get_all_attacks();

      if (Array.isArray(response)) {
        dispatch({ type: "SET_ATTACKING_ATTACKS", payload: filteredAttackingAttacks })
        dispatch({ type: "SET_DEFENDING_ATTACKS", payload: filteredDefendingAttacks })
      }

    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch data" })
      console.error("Error fetching attacks:", err);
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false })
    }
  };

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
      bounces={true}
      overScrollMode="never"
    >
      <View className="flex flex-col justify-start px-4 py-4 w-full min-h-[82.5vh]">
        <Text className="py-5 font-montez text-5xl text-center">
          Team {globalState.teamNo} Wars
        </Text>

        {state.error ? (
          <Text className="p-2 text-center text-red-500 text-xl">
            {state.error}
          </Text>
        ) : (
          <View style={{ backgroundColor: "rgb(75,50,12,1)" }}>
            <Text className="mb-2 p-2 font-montez text-4xl text-red-800">
              Ongoing Attacks
            </Text>
            <View className="mb-4">
              {Array.isArray(state.attackingAttacks) &&
                state.attackingAttacks.length > 0 ? (
                state.attackingAttacks.map((attack, index) => (
                  <View
                    key={index}
                    className="mb-3 px-2 rounded-md"
                    style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                  >
                    <View className="p-2">
                      <Text className="font-psemibold text-black text-xl">
                        {attack.attacking_zone} ({attack.attacking_team}
                        {attack.attacking_subteam}) →{" "}
                        {attack.defending_zone} ({attack.defending_team}
                        {attack.defending_subteam})
                      </Text>
                      <Text className="mr-2 font-pregular text-black text-xl">
                        {attack.war}
                      </Text>
                      {attack.location != "" && (
                        <Text className="font-pregular text-black text-xl">
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
                <Text className="px-4 font-montez text-3xl text-black">
                  You are not attacking now
                </Text>
              )}
            </View>

            <Text className="mb-2 p-2 font-montez text-4xl text-green-800">
              Ongoing Defense
            </Text>
            <View className="mb-4">
              {Array.isArray(state.defendingAttacks) &&
                state.defendingAttacks.length > 0 ? (
                state.defendingAttacks.map((attack, index) => (
                  <View
                    key={index}
                    className="mb-3 px-2 rounded-md"
                    style={{ backgroundColor: "rgba(75,50,12,0.35)" }}
                  >
                    <View className="p-2">
                      <Text className="font-psemibold text-black text-xl">
                        {attack.attacking_zone} ({attack.attacking_team}
                        {attack.attacking_subteam}) →{" "}
                        {attack.defending_zone} ({attack.defending_team}
                        {attack.defending_subteam})
                      </Text>
                      <Text className="mr-2 font-pregular text-black text-xl">
                        {attack.war}
                      </Text>
                      {attack.location != "" && (
                        <Text className="font-pregular text-black text-xl">
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
                <Text className="px-4 font-montez text-3xl text-black">
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
