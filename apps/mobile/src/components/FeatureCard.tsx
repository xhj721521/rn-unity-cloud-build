import React, { useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typeScale } from '@theme/tokens';
import { FeatureCard as FeatureFrame } from '../ui/Card';
import PerforatedGrid from '../ui/decor/PerforatedGrid';

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
              <FeatureIcon tint={accent} type={icon} />
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
  },
  subtitle: {
    color: 'rgba(234,234,251,0.78)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
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

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
