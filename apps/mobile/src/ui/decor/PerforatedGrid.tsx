import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

let Reanimated: typeof import('react-native-reanimated') | null = null;
try {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  Reanimated = require('react-native-reanimated');
} catch (error) {
  Reanimated = null;
}
type Align = 'tl' | 'tr' | 'bl' | 'br';

type PerforatedGridProps = {
  width: number;
  height: number;
  align?: Align;
  r?: number;
  gap?: number;
  disabled?: boolean;
};

export default function PerforatedGrid({
  width,
  height,
  align = 'tl',
  r = 1.4,
  gap = 12,
  disabled = false,
}: PerforatedGridProps) {
  const areaWidth = Math.round(width * 0.36);
  const areaHeight = Math.round(height * 0.34);
  const offsetX = align.includes('r') ? width - areaWidth : 0;
  const offsetY = align.includes('b') ? height - areaHeight : 0;

  const dots = useMemo(() => {
    const nodes = [] as React.ReactNode[];
    for (let y = r; y < areaHeight; y += gap) {
      for (let x = r; x < areaWidth; x += gap) {
        nodes.push(<Circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" />);
      }
    }
    return nodes;
  }, [areaHeight, areaWidth, gap, r]);

  if (!Reanimated || disabled || !('useSharedValue' in Reanimated)) {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
          <G opacity={0.06} transform={`translate(${offsetX}, ${offsetY})`}>
            {dots}
          </G>
        </Svg>
      </View>
    );
  }

  const { useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle } = Reanimated;
  const AnimatedContainer = (Reanimated as any).default?.View ?? (Reanimated as any).View;
  const cancelAnimation = (Reanimated as any).cancelAnimation as
    | ((value: unknown) => void)
    | undefined;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 16000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );

    return () => {
      if (cancelAnimation) {
        cancelAnimation(progress);
      } else {
        progress.value = 0;
      }
    };
  }, [cancelAnimation, progress, withRepeat, withTiming]);

  const animatedStyle = useAnimatedStyle(() => {
    const phase = Math.sin(progress.value * Math.PI * 2);
    return {
      opacity: 0.06 + (phase + 1) * 0.02,
      transform: [{ translateX: phase * 8 }],
    };
  });

  if (!AnimatedContainer) {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
          <G opacity={0.08} transform={`translate(${offsetX}, ${offsetY})`}>
            {dots}
          </G>
        </Svg>
      </View>
    );
  }

  return (
    <AnimatedContainer pointerEvents="none" style={[StyleSheet.absoluteFill, animatedStyle]}>
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <G opacity={0.06} transform={`translate(${offsetX}, ${offsetY})`}>
          {dots}
        </G>
      </Svg>
    </AnimatedContainer>
  );
}
