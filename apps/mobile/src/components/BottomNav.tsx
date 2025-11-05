import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NAV_H } from '@theme/metrics';
import { palette } from '@theme/colors';

const TABS: { key: string; label: string; icon: any }[] = [
  { key: 'home', label: '首页', icon: require('../assets/icons/home.png') },
  { key: 'trial', label: '试炼', icon: require('../assets/icons/trial.png') },
  { key: 'explore', label: '探索', icon: require('../assets/icons/explore.png') },
  { key: 'chain', label: '链鉴', icon: require('../assets/icons/chain.png') },
  { key: 'me', label: '我的', icon: require('../assets/icons/me.png') },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const selected = t.key === active;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={styles.item}>
            <Image source={t.icon} style={[styles.icon, selected && styles.iconActive]} />
            <Text style={[styles.label, selected && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: NAV_H,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'rgba(10, 12, 26, 0.86)',
    borderTopWidth: 1,
    borderColor: 'rgba(92, 100, 255, 0.25)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  item: {
    width: '20%',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: 'rgba(180, 190, 255, 0.8)',
    marginBottom: 4,
  },
  iconActive: {
    tintColor: palette.cyan,
  },
  label: {
    color: 'rgba(226, 231, 255, 0.66)',
    fontSize: 11,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
