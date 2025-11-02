import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { useNeonPulse } from '@theme/animations';

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  title,
  description,
  onRetry,
}: ErrorStateProps) => {
  const pulse = useNeonPulse({ duration: 4800 });

  const glowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.18, 0.38],
    }),
  };

  return (
    <LinearGradient
      colors={['rgba(124, 92, 255, 0.28)', 'rgba(11, 11, 32, 0.9)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.shell}
    >
      <View style={styles.container}>
        <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {onRetry ? (
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>重新尝试</Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 18,
    padding: 1,
    marginBottom: 16,
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(10, 10, 32, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(68, 45, 155, 0.45)',
    gap: 10,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
    backgroundColor: neonPalette.glowPurple,
  },
  title: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: neonPalette.accentMagenta,
    backgroundColor: 'rgba(124, 92, 255, 0.18)',
  },
  retryText: {
    color: neonPalette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
