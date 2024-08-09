import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";
import { get_all_attacks } from "../../api/team_functions";

import countries from "../../constants/countries";

const Home = () => {
  const [zones, setZones] = useState([]);
  const [countryMappings, setCountryMappings] = useState([]);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setZones(countries);

      try {
        const result = await get_country_mappings();
        setCountryMappings(result);

        const attacksResult = await get_all_attacks();
        setAttacks(attacksResult);

      } catch (err) {
        console.log(err);
        setError("Failed to fetch country mappings");
      }

      try {
        const teamsResult = await get_all_teams();
        setTeams(teamsResult);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch teams data");
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const onMarkerPress = (zone) => {
    const country = countryMappings.find((c) => c.name === zone.name);
    const team = country ? teams.find((t) => t.number === country.teamNo) : null;
    const attack = attacks.find((a) => a.defending_zone === zone.name);

    Alert.alert(zone.name, `Owned by: Team ${team.number}\n${attack ? `Under attack by: Team ${attack.attacking_team}` : "Not under attack"}`);
      
  };

  const getTeamColor = (countryName) => {
    const country = countryMappings.find((c) => c.name === countryName);
    const team = country ? teams.find((t) => t.number === country.teamNo) : null;
    return team ? team.color : "#000000";
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Text className="text-center text-white text-2xl p-4">World Map</Text>
      <View className="flex-1 px-5">
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: 30.357810872761366,
            longitude: 30.392057112613095,
            latitudeDelta: 100,
            longitudeDelta: 180,
          }}
          mapType="satellite"
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {zones.map((zone, index) => (
            <MapZone
              key={zone.name}
              points={zone.points}
              color={getTeamColor(zone.name)}
              label={zone.name}
              onMarkerPress={() => onMarkerPress(zone)}
            />
          ))}
        </MapView>
      </View>

      {error && (
        <Text className="text-white text-center p-2 text-xl">{error}</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;
