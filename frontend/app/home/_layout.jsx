import { useContext, useEffect } from "react";
import {
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { Tabs } from "expo-router";
import { initialWindowMetrics } from 'react-native-safe-area-context';

import { icons } from "../../constants";
import { GlobalContext } from "../../context/GlobalProvider";
import _ from "lodash";
import StickyPopup from "../../components/StickyPopup";

import PageWrapper from './../../components/PageWrapper';
import TabIcon from "../../components/TabIcon";

const TabsLayout = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const { height } = Dimensions.get("window");
  const insets = initialWindowMetrics.insets;
  const isIpad = Platform.OS === "ios" && height > 1000;

  useEffect(() => {
    globalDispatch({ type: "UPDATE_POPUP_ATTACKS" });
  }, [globalState.attacks]);

  return (
    <PageWrapper>
      <Tabs
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#BBB",
          tabBarStyle: {
            backgroundColor: "#201402",
            borderTopWidth: 0,
            borderTopColor: "#000",
            height: height * 0.14 < 100? height * 0.14 : 100,
            marginBottom: isIpad? insets.bottom* 0.9 :insets.bottom * 1.25,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Map",
            headerShown: false,
            backgroundColor: "transparent",
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

    </PageWrapper>
  );
};

export default TabsLayout;
