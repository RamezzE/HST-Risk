import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import Timer from "./Timer";
import CustomButton from "./CustomButton";

import { router } from "expo-router";

const StickyPopup = ({ currentAttack, currentDefence, subteam }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (currentAttack || (currentDefence && currentDefence.length > 0))
            setIsVisible(true);
        else
            setIsVisible(false);
        
    }, [currentAttack, currentDefence]);

    if (!isVisible) return null;

    if (
        !currentAttack &&
        (!currentDefence || currentDefence.length == 0) &&
        subteam != ""
    )
        return null;

    if (subteam == "" && currentDefence.length == 0) return null;

    const timers = [];

    if (currentDefence && currentDefence.length > 0) {
        currentDefence.forEach((defence) => {
            timers.push(
                <View key={defence._id} style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => router.navigate("/home/wars")}>
                        <Text className="font-pbold text-blue-800 text-l">
                            {defence.attacking_team} {defence.attacking_subteam} VS{" "}
                            {defence.defending_team} {defence.defending_subteam}
                        </Text>
                        <Text className="font-pbold text-blue-800 text-[14px]">
                            {defence.war}
                        </Text>
                        <Timer
                            attack_id={defence._id}
                            textStyles={"font-pbold text-blue-800 text-[16px]"}
                        />
                    </TouchableOpacity>
                </View>
            );
        });
    }

    // Show attack if subteam is not empty and an attack exists
    if (subteam !== "" && currentAttack) {
        timers.push(
            <View key={currentAttack._id} style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={() => router.navigate("/home/wars")}>
                    <Text className="font-pbold text-red-800 text-l">
                        {currentAttack.attacking_team} {currentAttack.attacking_subteam} VS{" "}
                        {currentAttack.defending_team} {currentAttack.defending_subteam}
                    </Text>
                    <Text className="font-pbold text-red-800 text-[14px]">
                        {currentAttack.war}
                    </Text>
                    <Timer
                        attack_id={currentAttack._id}
                        textStyles={"font-pbold text-red-800 text-[16px]"}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    if (timers.length === 0) {
        return null; // Don't render the popup if no timers are available
    }

    return (
        <View
            style={{
                position: "absolute",
                right: 0,
                top: Platform.OS === "ios" ? 160 : 160,
                backgroundColor: "rgba(255,255,255,0.75)",
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 10,
                zIndex: 10,
            }}
        >
            <View className="flex flex-row-reverse justify-start items-start">
                <CustomButton
                    title="X"
                    textStyles="text-white font-pbold text-sm"
                    containerStyles={"p-0 m-0 min-w-[20px] min-h-[20px] bg-red-800"}
                    handlePress={() => setIsVisible(false)}
                />
                <View className="flex flex-col">{timers}</View>
            </View>
        </View>
    );
};

export default StickyPopup;