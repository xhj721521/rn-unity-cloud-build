import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { neonPalette } from '@theme/neonPalette';
import { useNeonPulse } from '@theme/animations';
import { spacing, shape } from '@theme/tokens';

type LoadingPlaceholderProps = {
  label?: string;
};

export const LoadingPlaceholder = ({ label = '功能开发中...' }: LoadingPlaceholderProps) => {
  const pulse = useNeonPulse({ duration: 4200 });

  const glowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.25],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1.05],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrap}>
        <Animated.View pointerEvents="none" style={[styles.spinnerGlow, glowStyle]} />
        <ActivityIndicator size="large" color={neonPalette.accentViolet} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.section * 1.5,
    alignItems: 'center',
    gap: spacing.cardGap,
  },
  spinnerWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: neonPalette.glowPurple,
    borderWidth: 1,
    borderColor: 'rgba(136, 98, 220, 0.45)',
  },
  label: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: spacing.section,
    borderRadius: shape.cardRadius,
  },
});
