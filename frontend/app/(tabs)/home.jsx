import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import { get_country_mappings } from "../../api/country_functions";
import { get_all_teams } from "../../api/team_functions";

import countries from "../../constants/countries";

const Home = () => {
  const [zones, setZones] = useState([]);
  const [countryMappings, setCountryMappings] = useState([]);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setZones(countries);

      try {
        const result = await get_country_mappings();

        setCountryMappings(result);
        console.log("Mappings: ", result);
      }
      catch (err) {
        console.log(err);
        setError("Failed to fetch country mappings");
      }

      try {
        const teamsResult = await get_all_teams();
        setTeams(teamsResult);
      }
      catch (err) {
        console.log(err);
        setError("Failed to fetch teams data");
      }

    };

    // Fetch zones and teams initially
    fetchData();

    // const interval = setInterval(fetchData, 60000);
    const interval = setInterval(fetchData, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const attackPrompt = (name, teamNo) => {
    console.log(name, teamNo);
    Alert.alert("Attack", `Do you want to attack ${name}?`)
  };

  const getTeamColor = (countryName) => {
    const country = countryMappings.find(c => c.name === countryName);
    const team = country ? teams.find(t => t.number === country.teamNo) : null;
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
              key={index}
              points={zone.points}
              color={getTeamColor(zone.name)}
              label={zone.name}
              onMarkerPress={() => attackPrompt(zone.name, zone.teamNo)}
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
