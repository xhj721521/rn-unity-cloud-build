import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
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
  { name: 'Home', component: HomeNavigator, title: '首页', label: '首页', icon: 'home' },
  { name: 'Trials', component: TrialsScreen, title: '试炼', label: '试炼', icon: 'trials' },
  { name: 'Explore', component: ExploreScreen, title: '探索', label: '探索', icon: 'explore' },
  {
    name: 'OnChainData',
    component: OnChainDataScreen,
    title: '链鉴',
    label: '链鉴',
    icon: 'onchain',
  },
  { name: 'Profile', component: ProfileNavigator, title: '我的', label: '我的', icon: 'profile' },
];

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabBarBackground = () => (
  <LinearGradient
    colors={['rgba(20, 26, 54, 0.92)', 'rgba(8, 12, 28, 0.72)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
);

const tabIconFactory = (label: string, icon: BottomTabGlyph) => {
  return ({ focused }: { focused: boolean }) => (
    <BottomTabIcon label={label} type={icon} focused={focused} />
  );
};

export const RootNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarBackground: TabBarBackground,
      tabBarStyle: tabStyles.glass,
      tabBarItemStyle: { paddingVertical: 6 },
    }}
  >
    {TAB_ITEMS.map((item) => (
      <Tab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{
          title: item.title,
          tabBarIcon: tabIconFactory(item.label, item.icon),
        }}
      />
    ))}
  </Tab.Navigator>
);

const tabStyles = StyleSheet.create({
  glass: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    borderTopWidth: 0,
    borderRadius: 28,
    height: 78,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
    elevation: 20,
    shadowColor: '#4DE0FF',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
  },
});
