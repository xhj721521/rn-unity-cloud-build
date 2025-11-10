import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RipplePressable from '@components/RipplePressable';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Category<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: Category<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const CategoryChips = <T extends string>({ options, value, onChange }: Props<T>) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const active = option.key === value;
        return (
          <RipplePressable
            key={option.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option.label}</Text>
          </RipplePressable>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  row: {
    gap: 12,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(8,10,24,0.5)',
  },
  chipActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.18)',
    shadowColor: palette.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  chipLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  chipLabelActive: {
    color: palette.text,
  },
});
