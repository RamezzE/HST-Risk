import { View, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="25" color="#000" />
    </View>
  );
};

export default Loader;
