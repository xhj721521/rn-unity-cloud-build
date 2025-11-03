import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { OnChainDataScreen } from '@modules/onchain/OnChainDataScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { RootTabParamList } from './types';
import { BottomTabIcon } from '@components/BottomTabIcon';
import type { BottomTabGlyph } from '@components/BottomTabIcon';

type TabConfig = {
  name: keyof RootTabParamList;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  label: string;
  icon: BottomTabGlyph;
};

const TAB_ITEMS: TabConfig[] = [
  {
    name: 'Home',
    component: HomeNavigator,
    title: '首页',
    label: '首页',
    icon: 'home',
  },
  {
    name: 'Trials',
    component: TrialsScreen,
    title: '试炼',
    label: '试炼',
    icon: 'trials',
  },
  {
    name: 'Explore',
    component: ExploreScreen,
    title: '探索',
    label: '探索',
    icon: 'explore',
  },
  {
    name: 'OnChainData',
    component: OnChainDataScreen,
    title: '链鉴',
    label: '链鉴',
    icon: 'onchain',
  },
  {
    name: 'Profile',
    component: ProfileNavigator,
    title: '我的',
    label: '我的',
    icon: 'profile',
  },
];

const Tab = createBottomTabNavigator<RootTabParamList>();

const createTabIcon = (label: string, type: BottomTabGlyph) => {
  const IconComponent = ({ focused }: { focused: boolean }) => (
    <BottomTabIcon label={label} type={type} focused={focused} />
  );
  return IconComponent;
};

export const RootNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#0A0A1F',
        borderTopColor: 'rgba(60, 58, 120, 0.4)',
        height: 68,
        paddingBottom: 10,
        paddingTop: 6,
      },
    }}
  >
    {TAB_ITEMS.map((item) => (
      <Tab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{
          title: item.title,
          tabBarIcon: createTabIcon(item.label, item.icon),
        }}
      />
    ))}
  </Tab.Navigator>
);
