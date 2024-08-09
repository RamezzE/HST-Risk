import { View, Text, } from 'react-native';
import { Polygon, Marker } from 'react-native-maps';

const MapZone = ({ points, color, label }) => {

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
        // strokeColor={``}
        // fillColor={`${color}50`}
        fillColor={`${color}85`}
        strokeWidth={4}
      />

      <Marker coordinate={polygonCenter}>
        <View className = "bg-primary rounded-lg">
        {/* <View> */}
          {/* <Text className="p-1 text-xs text-white">{label}</Text> */}
          <Text className="p-1 text-xs font-bold text-white">{label}</Text>
        </View>
      </Marker>
    </>
  );
};

export default MapZone;
