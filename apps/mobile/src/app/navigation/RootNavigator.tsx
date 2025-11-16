import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { MarketNavigator } from './MarketNavigator';
import { RootTabParamList } from './types';
import FateTabBar from '@components/FateTabBar';

type TabConfig = {
  name: keyof RootTabParamList;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  label: string;
};

const TAB_ITEMS: TabConfig[] = [
  { name: 'Home', component: HomeNavigator, title: '首页', label: '首页' },
  { name: 'Market', component: MarketNavigator, title: '集市', label: '集市' },
  { name: 'Explore', component: ExploreScreen, title: '探索', label: '探索' },
  { name: 'Trials', component: TrialsScreen, title: '试炼', label: '试炼' },
  { name: 'Profile', component: ProfileNavigator, title: '我的', label: '我的' },
];

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => (
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
