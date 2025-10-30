import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '@modules/home/HomeScreen';
import { LeaderboardScreen } from '@modules/home/LeaderboardScreen';
import { ForgeScreen } from '@modules/home/ForgeScreen';
import { MarketplaceScreen } from '@modules/home/MarketplaceScreen';
import { EventShopScreen } from '@modules/home/EventShopScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Forge" component={ForgeScreen} />
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      <Stack.Screen name="EventShop" component={EventShopScreen} />
    </Stack.Navigator>
  );
};
