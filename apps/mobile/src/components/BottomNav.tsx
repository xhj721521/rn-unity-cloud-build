import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/colors';
import { NAV_H, PRESS_SCALE } from '../theme/metrics';

type TabKey = 'home' | 'explore' | 'trials' | 'chain' | 'me';

type Props = {
  active: TabKey;
  onTabPress: (key: TabKey) => void;
};

const icons: Record<TabKey, number> = {
  home: require('../../assets/icons/home.png'),
  explore: require('../../assets/icons/explore.png'),
  trials: require('../../assets/icons/trials.png'),
  chain: require('../../assets/icons/chain.png'),
  me: require('../../assets/icons/me.png'),
};

const labels: Record<TabKey, string> = {
  home: 'Home',
  explore: 'Explore',
  trials: 'Trials',
  chain: 'On-chain',
  me: 'Me',
};

export default function BottomNav({ active, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {Object.keys(icons).map(key => {
        const tab = key as TabKey;
        const focused = tab === active;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            onPress={() => onTabPress(tab)}
            style={styles.item}
          >
            {({ pressed }) => (
              <View style={[styles.inner, { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] }]}
              >
                <Image source={icons[tab]} style={[styles.icon, focused && styles.iconActive]} />
                <Text style={[styles.label, focused && styles.labelActive]}>{labels[tab]}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: palette.bg0,
    borderTopWidth: 1,
    borderTopColor: palette.cyan,
    height: NAV_H,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    opacity: 0.7,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  labelActive: {
    color: palette.text,
    fontWeight: '700',
  },
});
