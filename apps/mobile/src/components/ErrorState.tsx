import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { useNeonPulse } from '@theme/animations';
import { shadowStyles, shape, spacing, typeScale } from '@theme/tokens';

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
};

export const ErrorState = ({ title, description, onRetry }: ErrorStateProps) => {
  const pulse = useNeonPulse({ duration: 4800 });

  const glowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.18, 0.38],
    }),
  };

  return (
    <LinearGradient
      colors={['rgba(124, 92, 255, 0.32)', 'rgba(11, 11, 32, 0.92)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.shell}
    >
      <View style={styles.container}>
        <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
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
    borderRadius: shape.cardRadius,
    padding: 1,
    marginBottom: spacing.section,
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: shape.cardRadius,
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.section + spacing.grid,
    backgroundColor: 'rgba(10, 10, 32, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(78, 52, 170, 0.45)',
    gap: spacing.cardGap,
    ...shadowStyles.card,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: shape.cardRadius,
    backgroundColor: neonPalette.glowPurple,
  },
  title: {
    ...typeScale.title,
    color: neonPalette.textPrimary,
  },
  description: {
    ...typeScale.body,
    color: neonPalette.textSecondary,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.grid,
    paddingHorizontal: spacing.section,
    borderRadius: shape.buttonRadius,
    borderWidth: 1,
    borderColor: neonPalette.accentMagenta,
    backgroundColor: 'rgba(124, 92, 255, 0.18)',
  },
  retryText: {
    ...typeScale.body,
    color: neonPalette.textPrimary,
    fontWeight: '600',
  },
});
