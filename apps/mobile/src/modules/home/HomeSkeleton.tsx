import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { CARD_WIDTH, GUTTER, H_ASSET, H_BOX, H_SMALL } from '@theme/metrics';
import { spacing, shape } from '@theme/tokens';
import { palette } from '@theme/colors';

const HomeSkeleton = () => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const frameWidth = Math.max(320, Math.min(CARD_WIDTH, width - spacing.pageHorizontal * 2));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const shimmerStyle = {
    opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] }),
  };

  const quickWidth = Math.max(150, Math.floor((frameWidth - GUTTER) / 2));

  return (
    <View style={styles.container}>
      <View style={[styles.section, { width: frameWidth }]}>
        <Animated.View style={[styles.card, shimmerStyle, { height: H_ASSET }]} />
      </View>
      <View style={[styles.quickGrid, { width: frameWidth }]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Animated.View
            key={`skeleton-${index}`}
            style={[styles.card, shimmerStyle, { width: quickWidth, height: H_SMALL }]}
          />
        ))}
      </View>
      <View style={[styles.section, { width: frameWidth }]}>
        <Animated.View style={[styles.card, shimmerStyle, { height: H_BOX }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.pageVertical,
    paddingBottom: 32,
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing.section,
  },
  card: {
    borderRadius: shape.cardRadius,
    backgroundColor: palette.card,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: GUTTER,
    rowGap: GUTTER,
    justifyContent: 'center',
    marginBottom: spacing.section,
  },
});

export default HomeSkeleton;
