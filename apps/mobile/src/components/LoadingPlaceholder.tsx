import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { neonPalette } from '@theme/neonPalette';
import { useNeonPulse } from '@theme/animations';

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
          outputRange: [0.92, 1.08],
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
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  spinnerWrap: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerGlow: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: neonPalette.glowPurple,
  },
  label: {
    color: neonPalette.textSecondary,
    fontSize: 14,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
