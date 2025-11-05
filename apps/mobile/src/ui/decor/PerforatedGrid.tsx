import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

let Reanimated: typeof import('react-native-reanimated') | null = null;
try {
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

  if (disabled) {
    return <StaticGrid dots={dots} offsetX={offsetX} offsetY={offsetY} opacity={0.06} />;
  }

  const canAnimate = Reanimated && typeof Reanimated.useSharedValue === 'function';

  if (!canAnimate) {
    return <StaticGrid dots={dots} offsetX={offsetX} offsetY={offsetY} opacity={0.06} />;
  }

  return (
    <AnimatedGrid
      reanimated={Reanimated as typeof import('react-native-reanimated')}
      dots={dots}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
}

type GridLayerProps = {
  dots: React.ReactNode[];
  offsetX: number;
  offsetY: number;
  opacity?: number;
};

const StaticGrid = ({ dots, offsetX, offsetY, opacity = 0.06 }: GridLayerProps) => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <G opacity={opacity} transform={`translate(${offsetX}, ${offsetY})`}>
        {dots}
      </G>
    </Svg>
  </View>
);

type AnimatedGridProps = GridLayerProps & {
  reanimated: typeof import('react-native-reanimated');
};

const AnimatedGrid = ({ reanimated, dots, offsetX, offsetY }: AnimatedGridProps) => {
  const {
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    useAnimatedStyle,
    createAnimatedComponent,
  } = reanimated;
  const AnimatedView = useMemo(() => createAnimatedComponent(View), [createAnimatedComponent]);
  const cancelAnimation: ((value: unknown) => void) | undefined =
    typeof reanimated.cancelAnimation === 'function' ? reanimated.cancelAnimation : undefined;
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
  }, [Easing, cancelAnimation, progress, withRepeat, withTiming]);

  const animatedStyle = useAnimatedStyle(() => {
    const phase = Math.sin(progress.value * Math.PI * 2);
    return {
      opacity: 0.06 + (phase + 1) * 0.02,
      transform: [{ translateX: phase * 8 }],
    };
  }, [progress]);

  if (!AnimatedView) {
    return <StaticGrid dots={dots} offsetX={offsetX} offsetY={offsetY} opacity={0.08} />;
  }

  return (
    <AnimatedView pointerEvents="none" style={[StyleSheet.absoluteFill, animatedStyle]}>
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <G opacity={0.06} transform={`translate(${offsetX}, ${offsetY})`}>
          {dots}
        </G>
      </Svg>
    </AnimatedView>
  );
};
