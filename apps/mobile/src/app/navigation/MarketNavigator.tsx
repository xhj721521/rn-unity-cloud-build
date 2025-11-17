import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarketStackParamList } from './types';
import { FateMarketScreen } from '@modules/market/FateMarketScreen';
import { MarketOrderListScreen } from '@modules/market/MarketOrderListScreen';
import { MarketHistoryScreen } from '@modules/market/MarketHistoryScreen';

const Stack = createNativeStackNavigator<MarketStackParamList>();

export const MarketNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MarketHome" component={FateMarketScreen} />
    <Stack.Screen name="MarketListings" component={MarketOrderListScreen} />
    <Stack.Screen name="MarketHistory" component={MarketHistoryScreen} />
  </Stack.Navigator>
);

export default MarketNavigator;
