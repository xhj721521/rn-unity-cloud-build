import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { OnChainDataScreen } from '@modules/onchain/OnChainDataScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { RootTabParamList } from './types';

type TabIconType = 'home' | 'trials' | 'explore' | 'onchain' | 'profile';

type TabIconProps = {
  label: string;
  type: TabIconType;
  focused: boolean;
};

type TabConfig = {
  name: keyof RootTabParamList;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  label: string;
  icon: TabIconType;
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

const createTabIcon = (label: string, type: TabIconType) => {
  const IconComponent = ({ focused }: { focused: boolean }) => (
    <TabIcon label={label} type={type} focused={focused} />
  );
  return IconComponent;
};

export const RootNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#090820',
        borderTopColor: '#1F2040',
        height: 62,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#6C7193',
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

const TabIcon = ({ label, type, focused }: TabIconProps) => {
  const color = focused ? '#FFFFFF' : '#6C7193';
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconGlyph, focused && styles.iconGlyphActive]}>
        {renderGlyph(type, focused ? '#8B6CFF' : '#3E3F63')}
      </View>
      <Text style={[styles.iconLabel, { color }]}>{label}</Text>
    </View>
  );
};

const renderGlyph = (type: TabIconType, stroke: string) => {
  switch (type) {
    case 'home':
      return (
        <>
          <View style={[styles.glyphRoof, { borderColor: stroke }]} />
          <View style={[styles.glyphBody, { borderColor: stroke }]} />
        </>
      );
    case 'trials':
      return (
        <View style={[styles.glyphShield, { borderColor: stroke }]}>
          <View style={[styles.glyphSword, { backgroundColor: stroke }]} />
        </View>
      );
    case 'explore':
      return (
        <View style={[styles.glyphCompass, { borderColor: stroke }]}>
          <View style={[styles.glyphCompassNeedle, { backgroundColor: stroke }]} />
        </View>
      );
    case 'onchain':
      return (
        <>
          <View style={[styles.glyphChainLink, { borderColor: stroke }]} />
          <View
            style={[styles.glyphChainLink, styles.glyphChainLinkOffset, { borderColor: stroke }]}
          />
        </>
      );
    case 'profile':
    default:
      return (
        <>
          <View style={[styles.glyphCircle, { borderColor: stroke }]} />
          <View style={[styles.glyphCircle, styles.glyphCircleSmall, { borderColor: stroke }]} />
        </>
      );
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  iconGlyph: {
    width: 32,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 76, 181, 0.4)',
    backgroundColor: 'rgba(16, 17, 40, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconGlyphActive: {
    borderColor: 'rgba(139, 108, 255, 0.6)',
    backgroundColor: 'rgba(47, 37, 94, 0.9)',
  },
  iconLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  glyphRoof: {
    width: 14,
    height: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderRadius: 2,
  },
  glyphBody: {
    marginTop: 2,
    width: 14,
    height: 8,
    borderWidth: 2,
    borderRadius: 2,
  },
  glyphShield: {
    width: 16,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphSword: {
    width: 4,
    height: 10,
    borderRadius: 2,
  },
  glyphCompass: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphCompassNeedle: {
    width: 2,
    height: 10,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  glyphChainLink: {
    width: 16,
    height: 8,
    borderWidth: 2,
    borderRadius: 4,
  },
  glyphChainLinkOffset: {
    position: 'absolute',
    transform: [{ translateX: 6 }],
  },
  glyphCircle: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
  },
  glyphCircleSmall: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
