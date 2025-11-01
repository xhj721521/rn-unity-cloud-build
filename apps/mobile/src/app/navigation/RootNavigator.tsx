import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RootTabParamList } from './types';
import { HomeNavigator } from './HomeNavigator';
import { TrialsScreen } from '@modules/trials/TrialsScreen';
import { ExploreScreen } from '@modules/explore/ExploreScreen';
import { OnChainDataScreen } from '@modules/onchain/OnChainDataScreen';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
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
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <TabIcon label="首页" type="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Trials"
        component={TrialsScreen}
        options={{
          title: '试炼',
          tabBarIcon: ({ focused }) => <TabIcon label="试炼" type="trials" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: '探索',
          tabBarIcon: ({ focused }) => <TabIcon label="探索" type="explore" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="OnChainData"
        component={OnChainDataScreen}
        options={{
          title: '链鉴',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="链鉴" type="onchain" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => <TabIcon label="我的" type="profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

type TabIconProps = {
  label: string;
  type: 'home' | 'trials' | 'explore' | 'onchain' | 'profile';
  focused: boolean;
};

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

const renderGlyph = (type: TabIconProps['type'], stroke: string) => {
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
        <>
          <View style={[styles.glyphCompass, { borderColor: stroke }]} />
          <View style={[styles.glyphCompassNeedle, { backgroundColor: stroke }]} />
        </>
      );
    case 'onchain':
      return (
        <>
          <View style={[styles.glyphChainLink, { borderColor: stroke }]} />
          <View style={[styles.glyphChainLink, styles.glyphChainLinkOffset, { borderColor: stroke }]} />
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
