import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { leaderboardTokens } from '@modules/home/leaderboardTokens';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type GlowButtonProps = PressableProps & {
  label: string;
  disabledLabel?: string;
};

export const GlowButton = ({ label, disabledLabel, disabled, ...rest }: GlowButtonProps) => (
  <Pressable
    disabled={disabled}
    style={({ pressed }) => [
      styles.button,
      disabled && styles.buttonDisabled,
      pressed && !disabled && styles.buttonPressed,
    ]}
    {...rest}
  >
    <LinearGradient
      colors={leaderboardTokens.gradientStroke}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.buttonBg}
    >
      <Text style={styles.buttonText}>{disabled && disabledLabel ? disabledLabel : label}</Text>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: leaderboardTokens.radiusCard,
    overflow: 'hidden',
    shadowColor: leaderboardTokens.colorShadow,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonBg: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: leaderboardTokens.radiusCard,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});
