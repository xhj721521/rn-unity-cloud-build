import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { ProfileScreen } from '@modules/profile/ProfileScreen';
import { MyTeamScreen } from '@modules/profile/MyTeamScreen';
import { TeamChatScreen } from '@modules/team/TeamChatScreen';
import { MyInventoryScreen } from '@modules/profile/MyInventoryScreen';
import { MyInvitesScreen } from '@modules/profile/MyInvitesScreen';
import { WalletScreen } from '@modules/profile/WalletScreen';
import { MemberScreen } from '@modules/profile/MemberScreen';
import { ReportsScreen } from '@modules/profile/ReportsScreen';
import { HighlightsScreen } from '@modules/profile/HighlightsScreen';
import { KYCScreen } from '@modules/profile/KYCScreen';
import { SettingsScreen } from '@modules/profile/SettingsScreen';

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
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="MyInventory" component={MyInventoryScreen} />
      <Stack.Screen name="MyInvites" component={MyInvitesScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Member" component={MemberScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Highlights" component={HighlightsScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
