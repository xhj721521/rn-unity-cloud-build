import React, { PropsWithChildren } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';

type InfoCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export const InfoCard = ({ title, subtitle, children }: InfoCardProps) => {
  const pulse = useNeonPulse({ duration: 4800 });

  return (
    <LinearGradient
      colors={neonPalette.surfaceHighlight}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.border}
    >
      <View style={styles.card}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.cardGlow,
            getGlowStyle({
              animated: pulse,
              minOpacity: 0.08,
              maxOpacity: 0.22,
              minScale: 0.95,
              maxScale: 1.12,
            }),
          ]}
        />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  border: {
    borderRadius: 20,
    padding: 1,
    marginBottom: 18,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 19,
    padding: 18,
    backgroundColor: neonPalette.cardBackground,
    borderWidth: 1,
    borderColor: neonPalette.surfaceBorderMuted,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
    backgroundColor: neonPalette.cardOverlay,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: neonPalette.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 6,
    color: neonPalette.textSecondary,
    fontSize: 13,
  },
});
