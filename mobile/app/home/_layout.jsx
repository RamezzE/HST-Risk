import { useContext, useEffect } from "react";
import { ImageBackground, View } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { GlobalContext } from "../../context/GlobalProvider";
import _ from "lodash";
import StickyPopup from "../../components/StickyPopup";

import TabIcon from "../../components/TabIcon";
import useTabScreenOptions from "../../hooks/useTabScreenOptions";

const TabsLayout = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  useEffect(() => {
    globalDispatch({ type: "UPDATE_POPUP_ATTACKS" });
  }, [globalState.attacks]);

  const tabScreenOptions = useTabScreenOptions();

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={tabScreenOptions}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Map",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.globe}
                color={color}
                name="Map"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="attack"
          options={{
            title: "Attack",
            href: globalState.subteam == "" ? null : undefined,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.sword}
                color={color}
                name="Attack"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wars"
          options={{
            title: "Wars",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.swords}
                color={color}
                name="Wars"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: "Teams",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.teams}
                color={color}
                name="Teams"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="countries"
          options={{
            title: "Countries",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.countries}
                color={color}
                name="Countries"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StickyPopup
        currentAttack={globalState.currentAttack}
        currentDefence={globalState.currentDefence}
        subteam={globalState.subteam}
      />
    </View>
  );
};

export default TabsLayout;
