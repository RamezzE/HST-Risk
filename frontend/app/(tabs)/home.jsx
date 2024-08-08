import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapZone from "../../components/MapZone";
import { get_zones } from "../../api/zone_functions";

const Home = () => {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      setError(null);

      try {
        const result = await get_zones();

        if (result.success === false) {
          setError(result.errorMsg);
        } else if (Array.isArray(result)) {
          setZones(result);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch zones");
      }
    };

    // Fetch zones initially
    fetchZones();

    // Set up interval to fetch zones every 5 seconds
    // const interval = setInterval(fetchZones, 5000);

    // Clear interval on component unmount
    // return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Text className="text-center text-white text-xl p-2">Home</Text>
      <Text className="text-center text-white text-xl p-2">Home</Text>
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
          // scrollEnabled={false}
          // zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {zones.map((zone, index) => (
            <MapZone
              key={index}
              points={zone.points}
              color={zone.color}
              label={zone.label}
            />
          ))}
        </MapView>
      </View>
      
      {error && (
        <Text className="text-red text-center p-2 text-xl">{error}</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;
