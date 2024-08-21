import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { GlobalContext } from "../../context/GlobalProvider";
import { get_admin_by_name } from "../../api/admin_functions";
import {
  get_attacks_by_war,
  set_attack_result,
  delete_attack,
} from "../../api/attack_functions";
import { router } from "expo-router";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";
import Timer from "../../components/Timer";
import { images } from "../../constants";

const AdminHome = () => {
  const { name, Logout } = useContext(GlobalContext);
  const [war, setWar] = useState("");
  const [response, setResponse] = useState({ attacks: [] });
  const [currentAttack, setCurrentAttack] = useState({
    _id: "",
    attacking_team: "",
    defending_team: "",
    attacking_zone: "",
    defending_zone: "",
    createdAt: "",
    expiryTime: "",
  });
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    console.log("Fetching data");
    try {
      const admin = await get_admin_by_name(name);
      setWar(admin.admin.war);
      const response = await get_attacks_by_war(admin.admin.war);

      if (response.attacks.length > 0) {
        setResponse(response);
        const attack = response.attacks[0];

        setCurrentAttack({
          _id: attack._id,
          attacking_team: attack.attacking_team,
          attacking_subteam: attack.attacking_subteam,
          defending_team: attack.defending_team,
          attacking_zone: attack.attacking_zone,
          defending_zone: attack.defending_zone,
          createdAt: attack.createdAt,
          expiryTime: attack.expiryTime,
        });
      } else {
        setResponse(response);
        setCurrentAttack({
          _id: "",
          attacking_team: "",
          attacking_subteam: "",
          attacking_zone: "",
          defending_team: "",
          defending_zone: "",
          createdAt: "",
          expiryTime: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

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
            Logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const deleteAttack = async (attack_id) => {
    setIsSubmitting(true);

    try {
      const response = await delete_attack(attack_id);
      if (response.success) {
        Alert.alert("Success", "Attack cancelled successfully");
        fetchData();
      } else {
        Alert.alert("Error", response.errorMsg);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to cancel attack");
    } finally {
      setIsSubmitting(false);
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
        ? currentAttack.attacking_team
        : currentAttack.defending_team;

    const subteam = attackWon === "true" ? currentAttack.attacking_subteam : "";
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
            setAttackResult(attackWon);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setAttackResult = async (attackWon) => {
    setIsSubmitting(true);

    try {
      let team;
      if (attackWon === "true") team = currentAttack.attacking_team;
      else if (attackWon === "false") team = currentAttack.defending_team;

      const response = await set_attack_result(currentAttack._id, team);
      if (response.success) {
        Alert.alert("Success", "Attack result set successfully");
        fetchData();
      } else {
        Alert.alert("Error", response.errorMsg);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to set attack result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();

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
      className="bg-black h-full"
    >
      <ImageBackground
        source={images.background}
        style={{ resizeMode: "cover" }}
        className="min-h-[100vh]"
      >
        <ScrollView
          scrollEnabled={true}
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
        >
          <View className="w-full min-h-[100vh] px-4 py-5 flex flex-col justify-start">
            <View>
              <BackButton
                style="w-[20vw] mb-6"
                size={32}
                onPress={() => logoutFunc()}
              />

              <Text className="font-montez text-black text-5xl px-5 pt-1 text-center">
                Welcome, {name}
              </Text>

              <Text className="font-montez text-black text-center mt-1 text-4xl ">
                {war}
              </Text>
            </View>

            <View
              className="rounded-md mt-3 px-2 flex-1 flex-col justify-start"
              style={{ backgroundColor: "rgba(32, 20, 2, 0.6)" }} // Transparent background
            >
              {currentAttack._id ? (
                <View className="h-full flex flex-col justify-between py-4">
                  <View>
                    <Text className="font-pregular text-white text-2xl px-5 py-2 text-left">
                      Attacking Side:
                    </Text>
                    <Text className="font-pbold text-white text-xl px-5 py-2 text-left">
                      Team {currentAttack.attacking_team}
                      {currentAttack.attacking_subteam},{" "}
                      {currentAttack.attacking_zone}
                    </Text>
                    <Text></Text>
                    <Text className="font-pregular text-white text-2xl px-5 py-2 text-left">
                      Defending Side:
                    </Text>
                    <Text className="font-pbold text-white text-xl px-5 py-2 text-left">
                      Team {currentAttack.defending_team},{" "}
                      {currentAttack.defending_zone}
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
              {currentAttack._id && (
                <Timer
                  attack_id={currentAttack._id}
                  textStyles={
                    "text-3xl text-red-800 mt-4 mb-2 text-center font-psemibold"
                  }
                  expiryMessage="Timer expired"

                />
              )}
              <View className="flex flex-row justify-between mr-1 mt-3">
                {response.attacks.length > 0 && (
                  <View className="w-full">
                    <View className="flex flex-row">
                      <CustomButton
                        title={`${currentAttack.attacking_team}${currentAttack.attacking_subteam} Won`}
                        textStyles={"text-xl font-pregular"}
                        containerStyles="w-1/2 mr-1 bg-green-800 p-3"
                        handlePress={() => setAttackResultAlert("true")}
                        isLoading={isSubmitting}
                      />
                      <CustomButton
                        title={`${currentAttack.defending_team} Won`}
                        textStyles={"text-xl font-pregular"}
                        containerStyles="w-1/2 ml-1 bg-red-800 p-3"
                        handlePress={() => setAttackResultAlert("false")}
                        isLoading={isSubmitting}
                      />
                    </View>
                    <CustomButton
                      title="Cancel Attack"
                      containerStyles="mt-5 p-3 mb-10"
                      textStyles={"text-xl font-pregular"}
                      handlePress={() => {
                        cancelAttackAlert(currentAttack._id);
                      }}
                      isLoading={isSubmitting}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AdminHome;
