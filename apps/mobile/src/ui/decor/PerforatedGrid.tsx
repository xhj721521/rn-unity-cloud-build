import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

let Reanimated: typeof import('react-native-reanimated') | null = null;
try {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  Reanimated = require('react-native-reanimated');
} catch (error) {
  Reanimated = null;
}

const AnimatedG = Reanimated?.default?.createAnimatedComponent ? Reanimated.default.createAnimatedComponent(G) : G;

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
  const areaWidth = Math.round(width * 0.45);
  const areaHeight = Math.round(height * 0.42);
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

  if (!Reanimated || disabled) {
    return (
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <G opacity={0.08} transform={`translate(${offsetX}, ${offsetY})`}>
          {dots}
        </G>
      </Svg>
    );
  }

  const { useSharedValue, withRepeat, withTiming, Easing, useAnimatedProps } = Reanimated;
  const t = useSharedValue(0);
  t.value = withRepeat(
    withTiming(1, { duration: 16000, easing: Easing.inOut(Easing.quad) }),
    -1,
    true,
  );

  const animatedProps = useAnimatedProps(() => {
    const phase = Math.sin(t.value * Math.PI * 2);
    return {
      opacity: 0.06 + (phase + 1) * 0.02,
      transform: `translate(${offsetX + phase * 8}, ${offsetY})`,
    } as Record<string, unknown>;
  });

  const AnimatedGroup = AnimatedG as any;

  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <AnimatedGroup animatedProps={animatedProps}>
        {dots}
      </AnimatedGroup>
    </Svg>
  );
}
