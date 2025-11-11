import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import GlassCard from '@components/shared/GlassCard';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  onPress?: () => void;
  style?: ViewStyle;
  active?: boolean;
};

export const KpiCard = ({ label, value, hint, onPress, style, active }: KpiCardProps) => (
  <Pressable style={({ pressed }) => [style, pressed && styles.pressed]} onPress={onPress}>
    <GlassCard padding={0} style={styles.card}>
      <View style={styles.inner}>
        <Text style={[styles.label, active && styles.activeText]}>{label}</Text>
        <Text style={[styles.value, active && styles.activeText]}>{value}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </GlassCard>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
  },
  inner: {
    gap: 4,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...typography.captionCaps,
    color: 'rgba(230,241,255,0.72)',
    marginBottom: 4,
  },
  value: {
    ...typography.heading,
    fontSize: 22,
    color: palette.text,
    marginBottom: 4,
  },
  hint: {
    ...typography.caption,
    color: palette.sub,
  },
  activeText: {
    color: '#00E5FF',
  },
});

export default KpiCard;
