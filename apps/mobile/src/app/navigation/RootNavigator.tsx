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
      <Tab.Screen name="Home" component={HomeNavigator} options={{ title: '\u9996\u9875' }} />
      <Tab.Screen name="Trials" component={TrialsScreen} options={{ title: '\u8bd5\u70bc' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: '\u63a2\u7d22' }} />
      <Tab.Screen
        name="OnChainData"
        component={OnChainDataScreen}
        options={{ title: '\u94fe\u9274' }}
      />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ title: '\u6211\u7684' }} />
    </Tab.Navigator>
  );
};
