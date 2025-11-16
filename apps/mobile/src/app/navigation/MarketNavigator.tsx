import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarketStackParamList } from './types';
import { MarketHomeScreen } from '@modules/market/MarketHomeScreen';
import { MarketOrderListScreen } from '@modules/market/MarketOrderListScreen';
import { MarketHistoryScreen } from '@modules/market/MarketHistoryScreen';

const Stack = createNativeStackNavigator<MarketStackParamList>();

export const MarketNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MarketHome" component={MarketHomeScreen} />
    <Stack.Screen name="MarketListings" component={MarketOrderListScreen} />
    <Stack.Screen name="MarketHistory" component={MarketHistoryScreen} />
  </Stack.Navigator>
);

export default MarketNavigator;
