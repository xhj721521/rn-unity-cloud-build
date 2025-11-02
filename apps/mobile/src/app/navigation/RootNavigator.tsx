import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { OnChainDataScreen } from '@modules/onchain/OnChainDataScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { NeonTabIcon, TabGlyphType } from '@components/icons/NeonTabIcon';

type TabConfig = {
  title: string;
  label: string;
  type: TabGlyphType;
};

const TAB_CONFIG: Record<keyof RootTabParamList, TabConfig> = {
  Home: { title: '首页', label: '首页', type: 'home' },
  Trials: { title: '试炼', label: '试炼', type: 'trials' },
  Explore: { title: '探索', label: '探索', type: 'explore' },
  OnChainData: { title: '链鉴', label: '链鉴', type: 'onchain' },
  Profile: { title: '我的', label: '我的', type: 'profile' },
};

const createTabIcon =
  (label: string, type: TabGlyphType) =>
  ({ focused }: { focused: boolean }) =>
    <NeonTabIcon label={label} type={type} focused={focused} />;

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#090820',
        borderTopColor: '#1F2040',
        height: 62,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#6C7193',
    }),
    [],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: TAB_CONFIG.Home.title,
          tabBarIcon: createTabIcon(
            TAB_CONFIG.Home.label,
            TAB_CONFIG.Home.type,
          ),
        }}
      />
      <Tab.Screen
        name="Trials"
        component={TrialsScreen}
        options={{
          title: TAB_CONFIG.Trials.title,
          tabBarIcon: createTabIcon(
            TAB_CONFIG.Trials.label,
            TAB_CONFIG.Trials.type,
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: TAB_CONFIG.Explore.title,
          tabBarIcon: createTabIcon(
            TAB_CONFIG.Explore.label,
            TAB_CONFIG.Explore.type,
          ),
        }}
      />
      <Tab.Screen
        name="OnChainData"
        component={OnChainDataScreen}
        options={{
          title: TAB_CONFIG.OnChainData.title,
          tabBarIcon: createTabIcon(
            TAB_CONFIG.OnChainData.label,
            TAB_CONFIG.OnChainData.type,
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: TAB_CONFIG.Profile.title,
          tabBarIcon: createTabIcon(
            TAB_CONFIG.Profile.label,
            TAB_CONFIG.Profile.type,
          ),
        }}
      />
    </Tab.Navigator>
  );
};
