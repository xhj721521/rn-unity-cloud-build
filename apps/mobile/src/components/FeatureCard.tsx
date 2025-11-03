import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { shape, spacing, shadowStyles, typeScale } from '@theme/tokens';

export type FeatureCardType = 'leaderboard' | 'forge' | 'market' | 'events';

type FeatureCardProps = {
  title: string;
  subtitle: string;
  accent: string;
  onPress: () => void;
  icon: FeatureCardType;
};

export const FeatureCard = ({ title, subtitle, accent, onPress, icon }: FeatureCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}
      >
        <LinearGradient
          colors={[`${accent}26`, `${accent}66`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconRow}>
            <FeatureIcon tint={accent} type={icon} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const FeatureIcon = ({ tint, type }: { tint: string; type: FeatureCardType }) => {
  switch (type) {
    case 'leaderboard':
      return (
        <View style={styles.iconBase}>
          <View style={[styles.trophyCup, { borderColor: tint }]} />
          <View style={[styles.trophyStem, { backgroundColor: tint }]} />
        </View>
      );
    case 'forge':
      return (
        <View style={styles.iconBase}>
          <View style={[styles.hammerHead, { backgroundColor: tint }]} />
          <View style={[styles.hammerHandle, { backgroundColor: tint }]} />
        </View>
      );
    case 'market':
      return (
        <View style={styles.iconBase}>
          <View style={[styles.tagShape, { borderColor: tint }]} />
          <View style={[styles.tagDot, { borderColor: tint }]} />
        </View>
      );
    case 'events':
    default:
      return (
        <View style={styles.iconBase}>
          <View style={[styles.giftLid, { borderColor: tint }]} />
          <View style={[styles.giftBox, { borderColor: tint }]} />
          <View style={[styles.giftRibbon, { backgroundColor: tint }]} />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    height: 120,
    borderRadius: shape.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(68, 42, 138, 0.35)',
    backgroundColor: neonPalette.cardBackground,
    ...shadowStyles.card,
  },
  gradient: {
    flex: 1,
    padding: spacing.section,
    gap: spacing.cardGap,
  },
  iconRow: {
    height: 32,
    alignItems: 'flex-start',
  },
  textBlock: {
    gap: spacing.grid / 2,
  },
  title: {
    color: neonPalette.textPrimary,
    ...typeScale.title,
  },
  subtitle: {
    color: neonPalette.textSecondary,
    ...typeScale.body,
    fontSize: 14,
  },
  iconBase: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCup: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderRadius: 6,
    borderTopWidth: 2,
  },
  trophyStem: {
    marginTop: 2,
    width: 6,
    height: 8,
    borderRadius: 2,
  },
  hammerHead: {
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  hammerHandle: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginTop: 2,
  },
  tagShape: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderRadius: 6,
    transform: [{ rotate: '-12deg' }],
  },
  tagDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
    top: 6,
    right: 6,
  },
  giftLid: {
    width: 20,
    height: 6,
    borderWidth: 2,
    borderRadius: 3,
  },
  giftBox: {
    marginTop: 2,
    width: 20,
    height: 12,
    borderWidth: 2,
    borderRadius: 6,
  },
  giftRibbon: {
    position: 'absolute',
    width: 2,
    height: 18,
    borderRadius: 1,
    left: 11,
    top: 3,
  },
});
