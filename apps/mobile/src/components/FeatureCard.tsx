import React, { useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typeScale } from '@theme/tokens';
import { FeatureCard as FeatureFrame } from '../ui/Card';
import PerforatedGrid from '../ui/decor/PerforatedGrid';
import QuickGlyph, { QuickGlyphId } from './QuickGlyph';

export type FeatureCardType = 'leaderboard' | 'forge' | 'market' | 'events';

type FeatureCardProps = {
  title: string;
  subtitle: string;
  accent: string;
  onPress: () => void;
  icon: FeatureCardType;
  height?: number;
};

export const FeatureCard = ({
  title,
  subtitle,
  accent,
  onPress,
  icon,
  height = 120,
}: FeatureCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const gradientColors = useMemo<[string, string]>(() => {
    return [hexToRgba(accent, 0.32), hexToRgba(accent, 0.58)];
  }, [accent]);

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

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height: measuredHeight } = event.nativeEvent.layout;
    setCardSize((prev) =>
      prev.width === width && prev.height === measuredHeight
        ? prev
        : { width, height: measuredHeight },
    );
  };

  const showGrid = cardSize.width > 0 && cardSize.height > 0;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={[styles.cardWrapper, { height, transform: [{ scale }] }]}>
        <View style={styles.cardSurface} onLayout={handleLayout}>
          <FeatureFrame colors={gradientColors} style={styles.frameContent}>
            <View style={styles.iconRow}>
              <QuickGlyph id={featureGlyphMap[icon]} size={26} colors={[accent, '#78F7FF']} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
          </FeatureFrame>
          {showGrid ? (
            <PerforatedGrid width={cardSize.width} height={cardSize.height} align="tl" />
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const featureGlyphMap: Record<FeatureCardType, QuickGlyphId> = {
  leaderboard: 'leaderboard',
  forge: 'forge',
  market: 'market',
  events: 'event',
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
  },
  cardSurface: {
    flex: 1,
    position: 'relative',
  },
  frameContent: {
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
    color: '#EAEAFB',
    ...typeScale.title,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(255, 255, 255, 0.28)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: 'rgba(190, 210, 255, 0.78)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
