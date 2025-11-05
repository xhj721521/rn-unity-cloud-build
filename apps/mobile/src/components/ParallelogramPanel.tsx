import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

type ParallelogramPanelProps = PropsWithChildren<{
  width: number;
  height: number;
  tiltDeg?: number;
  strokeColors?: [string, string];
  fillColors?: [string, string];
  padding?: number;
  animated?: boolean;
}>;

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

export const ParallelogramPanel = ({
  width,
  height,
  tiltDeg = -10,
  strokeColors = ['#FF55D8', '#3FE8FF'],
  fillColors = ['rgba(18, 8, 32, 0.96)', 'rgba(10, 4, 22, 0.9)'],
  padding = 16,
  animated = true,
  children,
}: ParallelogramPanelProps) => {
  const leanRight = tiltDeg >= 0;
  const absTilt = Math.abs(tiltDeg);
  const slant = Math.min(Math.tan(degToRad(absTilt)) * height, width * 0.2);

  const polygonPoints = useMemo(() => {
    const p1X = leanRight ? 0 : slant;
    const p2X = leanRight ? width - slant : width;
    const p3X = leanRight ? width : width - slant;
    const p4X = leanRight ? slant : 0;
    return `${p1X},0 ${p2X},0 ${p3X},${height} ${p4X},${height}`;
  }, [height, leanRight, slant, width]);

  const insetLeft = leanRight ? slant * 0.25 : padding;
  const insetRight = leanRight ? padding : slant * 0.25;
  const perimeter = useMemo(() => {
    const topEdge = width - slant;
    const sideEdge = Math.sqrt(height * height + slant * slant);
    return topEdge * 2 + sideEdge * 2;
  }, [height, slant, width]);

  const strokeId = useMemo(() => `stroke-${Math.random().toString(36).slice(2)}`, []);
  const fillId = useMemo(() => `fill-${Math.random().toString(36).slice(2)}`, []);
  const pulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      pulse.stopAnimation();
      scan.stopAnimation();
      return;
    }
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    const scanLoop = Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 5200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    pulseLoop.start();
    scanLoop.start();
    return () => {
      pulseLoop.stop();
      scanLoop.stop();
    };
  }, [animated, pulse, scan]);

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.32],
  });
  const scanDashOffset = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [0, perimeter],
  });

  return (
    <View
      style={[
        styles.wrapper,
        {
          width,
          height,
          shadowColor: strokeColors[0],
        },
      ]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={strokeColors[0]} stopOpacity={0.9} />
            <Stop offset="100%" stopColor={strokeColors[1]} stopOpacity={0.9} />
          </LinearGradient>
          <LinearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={fillColors[0]} />
            <Stop offset="100%" stopColor={fillColors[1]} />
          </LinearGradient>
        </Defs>
        <Polygon
          points={polygonPoints}
          stroke={`url(#${strokeId})`}
          fill={`url(#${fillId})`}
          strokeWidth={2.4}
        />
        {animated && (
          <>
            <AnimatedPolygon
              points={polygonPoints}
              stroke={`url(#${strokeId})`}
              fill="none"
              strokeWidth={3}
              opacity={pulseOpacity}
            />
            <AnimatedPolygon
              points={polygonPoints}
              stroke="rgba(255, 255, 255, 0.35)"
              fill="none"
              strokeWidth={2}
              strokeDasharray={[perimeter * 0.2, perimeter]}
              strokeDashoffset={scanDashOffset}
              opacity={0.8}
            />
          </>
        )}
      </Svg>
      <View
        style={[
          styles.inner,
          { left: insetLeft, right: insetRight, top: padding, bottom: padding },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  inner: {
    position: 'absolute',
    justifyContent: 'center',
  },
});

export default ParallelogramPanel;
