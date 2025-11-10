import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { teamTokens } from '@theme/tokens.team';

type BadgeChipProps = {
  label: string;
  tone?: 'online' | 'offline' | 'default' | 'danger';
  style?: ViewStyle;
  testID?: string;
};

const toneMap = {
  online: { bg: 'rgba(75,209,128,0.16)', border: '#4BD180', text: '#4BD180' },
  offline: { bg: 'rgba(138,148,166,0.16)', border: '#8A94A6', text: '#C0C8D8' },
  default: { bg: 'rgba(32,224,232,0.12)', border: '#20E0E8', text: '#A8F5FF' },
  danger: { bg: 'rgba(255,102,122,0.12)', border: '#FF667A', text: '#FF9FAF' },
};

export const BadgeChip = ({ label, tone = 'default', style, testID }: BadgeChipProps) => {
  const palette = toneMap[tone];
  return (
    <View
      testID={testID}
      style={[styles.chip, style, { borderColor: palette.border, backgroundColor: palette.bg }]}
    >
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: teamTokens.layout.radiusPill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default BadgeChip;
