import { View, Text } from "react-native";
import { Polygon, Marker } from "react-native-maps";

const MapZone = ({ points, color, label, onMarkerPress }) => {

  let strokeColor = "#000000";

  if (["South Africa", "Congo", "Central Africa", "Egypt", "North Africa", "Madagascar"].includes(label)) {
    strokeColor = "#000";
  } else if (["New Zealand", "Western Australia", "Eastern Australia", "New Guinea", "Indonesia"].includes(label)) {
    strokeColor = "#000";
  }
  else if (["Brazil", "Venezuela", "Peru", "Bolivia", "Chile", "Argentina", "Paraguay"].includes(label)) {
    strokeColor = "#fff";
  }
  else if (["Greenland", "Honduras", "Mexico", "Western US", "Eastern US", "Cuba", "Quebec", "Canada", "Alaska", "Northwest Territories"].includes(label)) {
    strokeColor = "#000";
  }
  else if (["Russia", "Japan", "Iceland", "China", "Mongolia", "Korea", "India", "Kazakhstan", "Middle East", "Northern Europe", "Britain", "Europe"].includes(label)) {
    strokeColor = "#fff";
  }

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
        strokeColor={strokeColor}
        fillColor={`${color}85`}
        strokeWidth={2}
      />

      <Marker coordinate={polygonCenter} onPress={onMarkerPress}>
        <View className="opacity-70 bg-black rounded-lg">
          <Text className="p-1 text-[12px] font-bold text-white">{label}</Text>
        </View>
      </Marker>
    </>
  );
};

export default MapZone;