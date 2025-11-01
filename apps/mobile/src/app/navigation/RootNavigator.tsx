import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { OnChainDataScreen } from '@modules/onchain/OnChainDataScreen';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F0F1A',
          borderTopColor: '#232347',
        },
        tabBarActiveTintColor: '#7A5CFF',
        tabBarInactiveTintColor: '#8D92A3',
      }}
    >
      <Tab.Screen name="Home" component={HomeNavigator} options={{ title: '首页' }} />
      <Tab.Screen name="Trials" component={TrialsScreen} options={{ title: '试炼' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: '探索' }} />
      <Tab.Screen
        name="OnChainData"
        component={OnChainDataScreen}
        options={{ title: '链鉴' }}
      />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};
