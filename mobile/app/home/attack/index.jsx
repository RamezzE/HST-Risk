import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect, useContext, useReducer } from "react";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";

import { GlobalContext } from "../../../context/GlobalProvider";
import countries from "../../../constants/countries";

import {
  get_country_mappings,
} from "../../../api/country_functions";
import { get_all_teams } from "../../../api/team_functions";
import { attack_check, get_all_attacks } from "../../../api/attack_functions";
import { get_settings } from "../../../api/settings_functions";

import MapZone from "../../../components/MapZone";
import CountryConnections from "../../../constants/country_connections";
import DottedLine from "../../../components/DottedLine";
import Loader from "../../../components/Loader";
import DropDownField from "../../../components/DropDownField";
import CustomButton from "../../../components/CustomButton";

const initialState = {
  initialArea: [30, 30],
  zones: [],
  myZones: [],
  otherZones: [],
  isSubmitting: false,
  error: null,
  isRefreshing: false,
  attackCost: 0,
  balance: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_AREA":
      return { ...state, initialArea: action.payload };
    case "SET_ZONES":
      return { ...state, zones: action.payload };
    case "SET_MY_ZONES":
      return { ...state, myZones: action.payload };
    case "SET_OTHER_ZONES":
      return { ...state, otherZones: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    case "SET_ATTACK_COST":
      return { ...state, attackCost: action.payload };
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    default:
      return state;
  }
};

const Attack = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [form, setForm] = useState({
    teamNo: globalState.teamNo,
    your_zone: "",
    other_zone: "",
  });

  useEffect(() => {
    try {
      dispatch({ type: "SET_ZONES", payload: countries });
      dispatch({
        type: "SET_MY_ZONES",
        payload: Array.isArray(globalState.countries)
          ? globalState.countries.filter((country) => country.teamNo === parseInt(globalState.teamNo))
          : []
      });
      dispatch({ type: "SET_OTHER_ZONES", payload: [] });
    } catch (error) {
      console.log(error);
    }
  }, [globalState.countries, globalState.teamNo]);

  useEffect(() => {
    try {
      const attackCostSetting = globalState.settings.find(
        (setting) => setting.name === "Attack Cost"
      );
      if (attackCostSetting) {
        dispatch({ type: "SET_ATTACK_COST", payload: attackCostSetting.value });
      }
    } catch (error) {
      console.log(error);
    }
  }, [globalState.settings]);

  useEffect(() => {
    try {
      if (globalState.teams && globalState.teams[globalState.teamNo - 1]) {
        dispatch({
          type: "SET_BALANCE",
          payload: globalState.teams[globalState.teamNo - 1].balance,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [globalState.teams, globalState.teamNo]);

  const getTeamColor = (countryName) => {
    try {
      const country = globalState.countries.find((c) => c.name === countryName);
      const team = country
        ? globalState.teams.find((t) => t.number === country.teamNo)
        : null;
      if (form.your_zone === countryName || state.otherZones.includes(countryName)) {
        return team ? team.color : "#000000";
      } else if (form.your_zone) {
        return "#000000";
      } else {
        return team ? team.color : "#000000";
      }
    } catch (error) {
      return "#000000";
    }
  };

  const changeMapPreview = (zone) => {
    if (!zone || zone === "Select Your Country" || zone === "Select Country to Attack") {
      return;
    }
    const country = countries.find((c) => c.name === zone);
    if (!country || !Array.isArray(country.points) || country.points.length === 0) {
      return;
    }
    const avgLat = country.points.reduce((acc, curr) => acc + curr.latitude, 0) / country.points.length;
    const avgLong = country.points.reduce((acc, curr) => acc + curr.longitude, 0) / country.points.length;
    dispatch({ type: "SET_INITIAL_AREA", payload: [avgLat, avgLong] });
  };

  const validateAttack = (zone_1, zone_2) => {
    var result = {
      success: false,
      errorMsg: "",
    };
    if (!zone_1 || !zone_2) {
      result.errorMsg = "Please fill in all the fields";
      return result;
    }
    result.success = true;
    return result;
  };

  const selectYourZone = (zone) => {
    setForm({ ...form, your_zone: zone, other_zone: "" });

    if (!zone || zone === "") return;
    changeMapPreview(zone);

    const country = countries.find((c) => c.name === zone);
    if (!country || !Array.isArray(country.adjacent_zones)) return;

    dispatch({ type: "SET_OTHER_ZONES", payload: country.adjacent_zones });
    dispatch({ type: "SET_COUNTRY_MAPPINGS", payload: globalState.countries });
  };

  const selectOtherZone = (zone) => {
    setForm({ ...form, other_zone: zone });

    if (!zone || zone === "") return;
    changeMapPreview(zone);
  };

  const fetchData = async () => {
    try {
      const result = await get_country_mappings();
      if (Array.isArray(result)) globalDispatch({ type: "SET_COUNTRY_MAPPINGS", payload: result });

      const attacksResult = await get_all_attacks();
      if (Array.isArray(attacksResult)) globalDispatch({ type: "SET_ATTACKS", payload: attacksResult });

      const teamsResult = await get_all_teams();
      if (Array.isArray(teamsResult)) globalDispatch({ type: "SET_TEAMS", payload: teamsResult });

      const settings = await get_settings();
      if (Array.isArray(settings)) globalDispatch({ type: "SET_SETTINGS", payload: settings });

    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      dispatch({ type: "SET_IS_REFRESHING", payload: false });
    }
  };

  const attack_func = async (zone_1, team_1, zone_2) => {
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });
    try {
      const result = validateAttack(form.your_zone, form.other_zone);
      if (!result.success) {
        Alert.alert("Attack Failed", result.errorMsg);
        fetchData();
        return;
      }

      const team_2 = parseInt(globalState.countries.find((c) => c.name === zone_2).teamNo);

      const response = await attack_check(zone_1, team_1, globalState.subteam, zone_2, team_2);
      if (!response.success) {
        Alert.alert("Attack Failed", response.errorMsg);
        return;
      }

      router.navigate(
        `/home/attack/warzone?attacking_zone=${zone_1}&defending_zone=${zone_2}&attacking_team=${team_1}&defending_team=${team_2}&attacking_subteam=${globalState.subteam}`
      );

    } catch (error) {
      Alert.alert("Attack Failed", error.response?.data || "Error checking attack");
    } finally {
      dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    }
  };

  const onMarkerPress = (zone) => {
    try {
      const country = globalState.countries.find((c) => c.name === zone.name);
      const team = country ? globalState.teams.find((t) => t.number === country.teamNo) : null;
      const attack = globalState.attacks.find((a) => a.defending_zone === zone.name);

      Alert.alert(
        zone.name,
        `Owned by: Team ${team ? team.number : "Unknown"}\n${attack ? `Under attack by: Team ${attack.attacking_team}` : "Not under attack"
        }`
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (state.isRefreshing) {
    return <Loader />;
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={() => {
            dispatch({ type: "SET_IS_REFRESHING", payload: true });
            setForm({ your_zone: "", other_zone: "" });
            fetchData();
          }}
          tintColor="#000"
        />
      }
      bounces={true}
      overScrollMode="never"
    >
      <View className="flex flex-col justify-start mt-2 mb-8 px-4 pt-4 w-full min-h-[82.5vh]">
        <View className="flex flex-col mb-6">
          <View className="flex flex-row justify-between pb-4">
            <Text className="font-pmedium text-[16px]">Team money: {state.balance}</Text>
            <Text className="font-pmedium text-[16px]">Attack cost: {state.attackCost}</Text>
          </View>

          <DropDownField
            title="Select Your Country"
            value={form.your_zone}
            placeholder="Select Your Country"
            items={state.myZones.map((zone) => ({
              label: `${zone.name}`,
              value: zone.name,
            }))}
            handleChange={(e) => selectYourZone(e)}
            otherStyles=""
          />

          {!Array.isArray(state.otherZones) || state.otherZones.length === 0 ? (
            <></>
          ) : (
            <DropDownField
              title="Select Country to Attack"
              value={form.other_zone}
              placeholder="Select Country to Attack"
              items={state.otherZones.map((zone) => ({
                label: `${zone}`,
                value: zone,
              }))}
              handleChange={(e) => selectOtherZone(e)}
              otherStyles="mt-5"
            />
          )}
        </View>
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => {
              dispatch({ type: "SET_IS_REFRESHING", payload: true });
              setForm({ your_zone: "", other_zone: "" });
              fetchData();
            }}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 100,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <FontAwesome name="refresh" size={20} color="black" />
          </TouchableOpacity>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: state.initialArea[0],
              longitude: state.initialArea[1],
              latitudeDelta: 75,
              longitudeDelta: 100,
            }}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            mapType="satellite"
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {Array.isArray(state.zones) &&
              state.zones.map((zone, index) => {
                const isSelectedOrCanAttack =
                  form.your_zone === zone.name || state.otherZones.includes(zone.name);
                const shouldHideLabel = form.your_zone && !isSelectedOrCanAttack;

                return (
                  <MapZone
                    key={index}
                    points={zone.points}
                    color={getTeamColor(zone.name)}
                    label={shouldHideLabel ? "" : zone.name}
                    onMarkerPress={() => onMarkerPress(zone)}
                  />
                );
              })}

            {Array.isArray(CountryConnections) &&
              CountryConnections.map((points, index) => (
                <DottedLine
                  key={index}
                  startPoint={points.point1}
                  endPoint={points.point2}
                  color="#FFF"
                  thickness={2}
                  dashGap={2}
                />
              ))}
          </MapView>
          {Array.isArray(globalState.teams) && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                padding: 10,
                borderRadius: 5,
                zIndex: 999,
              }}
            >
              {globalState.teams.map((team, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: team.color,
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                  />
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Team {team.number}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <CustomButton
          title={form.other_zone ? `Attack ${form.other_zone}` : "Attack"}
          handlePress={() =>
            attack_func(form.your_zone, parseInt(globalState.teamNo), form.other_zone)
          }
          containerStyles="mt-5 mb-5 p-3"
          textStyles={"text-xl font-pregular"}
          isLoading={state.isSubmitting}
        />
      </View>

    </ScrollView>
  );
};

export default Attack;
