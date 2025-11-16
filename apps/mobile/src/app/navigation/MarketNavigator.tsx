import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarketStackParamList } from './types';
import { MarketHomeScreen } from '@modules/market/MarketHomeScreen';
import { MarketListingsScreen } from '@modules/market/MarketListingsScreen';
import { MarketHistoryScreen } from '@modules/market/MarketHistoryScreen';
import { MarketNewOrderScreen } from '@modules/market/MarketNewOrderScreen';
import { MarketNewAuctionScreen } from '@modules/market/MarketNewAuctionScreen';

const Stack = createNativeStackNavigator<MarketStackParamList>();

export const MarketNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MarketHome" component={MarketHomeScreen} />
    <Stack.Screen name="MarketListings" component={MarketListingsScreen} />
    <Stack.Screen name="MarketHistory" component={MarketHistoryScreen} />
    <Stack.Screen name="MarketNewOrder" component={MarketNewOrderScreen} />
    <Stack.Screen name="MarketNewAuction" component={MarketNewAuctionScreen} />
  </Stack.Navigator>
);

export default MarketNavigator;
