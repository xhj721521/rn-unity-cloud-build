import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type StatPillProps = {
  label: string;
  value: string | number;
  style?: ViewStyle;
};

export const StatPill = ({ label, value, style }: StatPillProps) => {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(12,20,42,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  value: {
    ...typography.numeric,
    color: palette.text,
    marginTop: 2,
  },
});

export default StatPill;
