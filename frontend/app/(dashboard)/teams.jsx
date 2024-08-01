import { View, Text, ScrollView, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


const Teams = () => {
  return (
    <SafeAreaView className="bg-primary h-full flex flex-row items-center justify-evenly">
      <ScrollView>
        <View className="w-full justify-center min-h-[87.5vh] px-4 my-6">
          <CustomButton
            title="Add Team"
            handlePress={() => router.push("/add_team")}
            containerStyles="p-1"
            // isLoading={isSubmitting}
          />
          {/* <CustomButton
        title="Add Team"
        handlePress={() => console.log("")}
        containerStyles="p-1"
        // isLoading={isSubmitting}
      />
      <CustomButton
        title="Add Team"
        handlePress={() => console.log("")}
        containerStyles="p-1"
        // isLoading={isSubmitting}
      /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Teams;
