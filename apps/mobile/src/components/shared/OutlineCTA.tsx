import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type OutlineCTAProps = {
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
};

const tones = {
  default: { border: '#20E0E8', text: '#AEEFFC', background: 'rgba(32,224,232,0.08)' },
  danger: { border: '#FF8888', text: '#FFB2B2', background: 'rgba(255,90,112,0.08)' },
};

export const OutlineCTA = ({
  label,
  onPress,
  tone = 'default',
  disabled,
  style,
}: OutlineCTAProps) => {
  const palette = tones[tone];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: palette.border,
          backgroundColor: palette.background,
        },
        style,
        disabled && styles.disabled,
        pressed && !disabled ? { opacity: 0.9 } : null,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default OutlineCTA;
