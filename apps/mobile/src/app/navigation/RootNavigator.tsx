import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
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
  { name: 'Profile', component: ProfileNavigator, title: '我的', label: '我的', icon: 'profile' },
];

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabBarBackground = () => (
  <LinearGradient
    colors={['rgba(8, 12, 24, 0.88)', 'rgba(4, 8, 18, 0.78)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
);

const renderTabIcon = (label: string, icon: BottomTabGlyph) => {
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
      tabBarItemStyle: { paddingVertical: 0 },
      tabBarActiveTintColor: '#E6F1FF',
    }}
  >
    {TAB_ITEMS.map((item) => (
      <Tab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{
          title: item.title,
          tabBarIcon: renderTabIcon(item.label, item.icon),
        }}
      />
    ))}
  </Tab.Navigator>
);

const tabStyles = StyleSheet.create({
  glass: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 20,
    borderTopWidth: 0,
    borderRadius: 32,
    height: 82,
    paddingBottom: 14,
    paddingTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#5AE6FF',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
});
