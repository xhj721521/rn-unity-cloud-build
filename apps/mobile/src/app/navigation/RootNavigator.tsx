import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { MarketNavigator } from './MarketNavigator';
import FateTabBar from '@components/FateTabBar';
import { RootStackParamList, RootTabParamList } from './types';
import { ActivityHubScreen } from '@modules/activity/ActivityHubScreen';
import { ActivityDetailScreen } from '@modules/activity/ActivityDetailScreen';
import { MyActivitiesScreen } from '@modules/activity/MyActivitiesScreen';

type TabConfig = {
  name: keyof RootTabParamList;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  label: string;
};

const TAB_ITEMS: TabConfig[] = [
  { name: 'Home', component: HomeNavigator, title: '首页', label: '首页' },
  { name: 'Explore', component: ExploreScreen, title: '探索', label: '探索' },
  { name: 'Trials', component: TrialsScreen, title: '试炼', label: '试炼' },
  { name: 'Profile', component: ProfileNavigator, title: '我的', label: '我的' },
];

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Tabs = () => (
  <Tab.Navigator
    tabBar={(props) => <FateTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        elevation: 0,
        borderTopWidth: 0,
        shadowOpacity: 0,
        height: 70,
      },
    }}
  >
    {TAB_ITEMS.map((item) => (
      <Tab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{ title: item.title }}
      />
    ))}
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Tabs" component={Tabs} />
    <Stack.Screen name="ActivityHub" component={ActivityHubScreen} />
    <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
    <Stack.Screen name="MyActivities" component={MyActivitiesScreen} />
    <Stack.Screen name="FateMarket" component={MarketNavigator} />
  </Stack.Navigator>
);
