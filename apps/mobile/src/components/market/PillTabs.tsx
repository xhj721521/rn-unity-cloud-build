import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type PillTabsProps<T extends string> = {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
  small?: boolean;
  style?: ViewStyle;
};

export const PillTabs = <T extends string>({ tabs, value, onChange, small = false, style }: PillTabsProps<T>) => {
  return (
    <View style={[styles.row, style]}>
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.pill,
              small && styles.pillSmall,
              active && styles.pillActive,
            ]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.text, small && styles.textSmall, active && styles.textActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    backgroundColor: 'rgba(5,8,18,0.7)',
    alignItems: 'center',
  },
  pillSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 0,
  },
  pillActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.2)',
  },
  text: { color: 'rgba(229,242,255,0.78)', fontSize: 13, fontWeight: '500' },
  textSmall: { fontSize: 12 },
  textActive: { color: '#F9FAFB', fontWeight: '700' },
});

export default PillTabs;
