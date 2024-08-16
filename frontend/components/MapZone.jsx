import { View, Text } from "react-native";
import { Polygon, Marker } from "react-native-maps";

const MapZone = ({ points, color, label, onMarkerPress }) => {
  const calculateCenter = (coordinates) => {
    let latSum = 0;
    let lonSum = 0;
    coordinates.forEach((coord) => {
      latSum += coord.latitude;
      lonSum += coord.longitude;
    });
    return {
      latitude: latSum / coordinates.length,
      longitude: lonSum / coordinates.length,
    };
  };

  const polygonCenter = calculateCenter(points);

  return (
    <>
      <Polygon
        coordinates={points}
        strokeColor={`#000000`}
        fillColor={`${color}85`}
        strokeWidth={2}
      />

      <Marker coordinate={polygonCenter} onPress={onMarkerPress}>
        <View className="opacity-70 bg-black rounded-lg">
          <Text className="p-1 text-[8px] font-bold text-white">{label}</Text>
        </View>
      </Marker>
    </>
  );
};

export default MapZone;
