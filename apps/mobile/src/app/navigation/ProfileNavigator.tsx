import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { ProfileScreen } from '@modules/profile/ProfileScreen';
import { MyTeamScreen } from '@modules/profile/MyTeamScreen';
import { MyInventoryScreen } from '@modules/profile/MyInventoryScreen';
import { MyInvitesScreen } from '@modules/profile/MyInvitesScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="MyTeam" component={MyTeamScreen} />
      <Stack.Screen name="MyInventory" component={MyInventoryScreen} />
      <Stack.Screen name="MyInvites" component={MyInvitesScreen} />
    </Stack.Navigator>
  );
};
