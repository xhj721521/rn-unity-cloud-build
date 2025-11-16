import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FateExploreIcon,
  FateHomeIcon,
  FateMarketIcon,
  FateProfileIcon,
  FateTrialsIcon,
} from '@components/icons';

const H_PADDING = 16;
const pillWidth = Dimensions.get('window').width - H_PADDING * 2;

const LABELS: Record<string, string> = {
  Home: '首页',
  Market: '集市',
  Trials: '试炼',
  Explore: '探索',
  Profile: '我的',
};

const ICONS = {
  Home: FateHomeIcon,
  Market: FateMarketIcon,
  Trials: FateTrialsIcon,
  Explore: FateExploreIcon,
  Profile: FateProfileIcon,
};

const ORDER: (keyof typeof ICONS)[] = ['Home', 'Market', 'Explore', 'Trials', 'Profile'];

const FateTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const routes = ORDER.map((key) => state.routes.find((route) => route.name === key)).filter(
    (route): route is typeof state.routes[number] => Boolean(route),
  );

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom - 4, 0) }]}
    >
      <View style={[styles.pill, { width: pillWidth - 20 }]}>
        {routes.map((route, index) => {
          const focused = state.index === state.routes.indexOf(route);
          const Icon = ICONS[route.name as keyof typeof ICONS];
          const label = LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.85}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : undefined}
              accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                {Icon ? <Icon focused={focused} /> : null}
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: H_PADDING,
    right: H_PADDING,
    bottom: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(5,10,25,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    paddingHorizontal: 12,
    shadowColor: '#00ffff',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(51,245,255,0.14)',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  labelActive: {
    color: '#33F5FF',
    fontWeight: '600',
  },
});

export default FateTabBar;
