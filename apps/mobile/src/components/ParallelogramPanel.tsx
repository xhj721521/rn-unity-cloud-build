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
  innerStrokeColors?: [string, string];
  innerGap?: number;
}>;

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
type Point = { x: number; y: number };

const pointsToString = (pts: Point[]) => pts.map((pt) => `${pt.x},${pt.y}`).join(' ');

const polygonArea = (pts: Point[]) => {
  if (pts.length < 3) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    sum += curr.x * next.y - next.x * curr.y;
  }
  return sum / 2;
};

const normalize = (vec: Point): Point => {
  const len = Math.hypot(vec.x, vec.y);
  if (!len) {
    return { x: 0, y: 0 };
  }
  return { x: vec.x / len, y: vec.y / len };
};

const intersectLines = (p1: Point, d1: Point, p2: Point, d2: Point): Point | null => {
  const cross = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(cross) < 1e-6) {
    return null;
  }
  const diff = { x: p2.x - p1.x, y: p2.y - p1.y };
  const t = (diff.x * d2.y - diff.y * d2.x) / cross;
  return { x: p1.x + d1.x * t, y: p1.y + d1.y * t };
};

const insetPolygon = (pts: Point[], gap: number): Point[] => {
  if (pts.length < 3 || gap <= 0) {
    return pts.slice();
  }
  const orientation = polygonArea(pts) >= 0 ? 1 : -1;
  const edges = pts.map((point, idx) => {
    const next = pts[(idx + 1) % pts.length];
    const dir = normalize({ x: next.x - point.x, y: next.y - point.y });
    const outward = normalize({
      x: dir.y * orientation,
      y: -dir.x * orientation,
    });
    const inward = { x: -outward.x, y: -outward.y };
    return {
      point: {
        x: point.x + inward.x * gap,
        y: point.y + inward.y * gap,
      },
      dir,
    };
  });

  return pts.map((_, idx) => {
    const prev = edges[(idx - 1 + edges.length) % edges.length];
    const curr = edges[idx];
    return (
      intersectLines(prev.point, prev.dir, curr.point, curr.dir) ?? {
        x: (prev.point.x + curr.point.x) / 2,
        y: (prev.point.y + curr.point.y) / 2,
      }
    );
  });
};

const buildShape = (
  shapeWidth: number,
  shapeHeight: number,
  leanRight: boolean,
  absTilt: number,
) => {
  const safeWidth = Math.max(shapeWidth, 2);
  const safeHeight = Math.max(shapeHeight, 2);
  const slant = Math.min(Math.tan(degToRad(absTilt)) * safeHeight, safeWidth * 0.2);
  const points: Point[] = [
    { x: leanRight ? 0 : slant, y: 0 },
    { x: leanRight ? safeWidth - slant : safeWidth, y: 0 },
    { x: leanRight ? safeWidth : safeWidth - slant, y: safeHeight },
    { x: leanRight ? slant : 0, y: safeHeight },
  ];
  return { points, slant };
};

export const ParallelogramPanel = ({
  width,
  height,
  tiltDeg = -10,
  strokeColors = ['#FF55D8', '#3FE8FF'],
  fillColors = ['rgba(18, 8, 32, 0.96)', 'rgba(10, 4, 22, 0.9)'],
  padding = 16,
  animated = true,
  innerStrokeColors,
  innerGap = 8,
  children,
}: ParallelogramPanelProps) => {
  const leanRight = tiltDeg >= 0;
  const absTilt = Math.abs(tiltDeg);
  const outerShape = useMemo(
    () => buildShape(width, height, leanRight, absTilt),
    [absTilt, height, leanRight, width],
  );
  const polygonPoints = useMemo(() => pointsToString(outerShape.points), [outerShape.points]);

  const effectiveInnerGap = useMemo(
    () => (innerStrokeColors ? Math.min(innerGap, Math.min(width, height) * 0.25) : 0),
    [height, innerGap, innerStrokeColors, width],
  );

  const innerPoints = useMemo(() => {
    if (!innerStrokeColors || !effectiveInnerGap) {
      return null;
    }
    return insetPolygon(outerShape.points, effectiveInnerGap);
  }, [effectiveInnerGap, innerStrokeColors, outerShape.points]);

  const innerPointsString = useMemo(
    () => (innerPoints ? pointsToString(innerPoints) : undefined),
    [innerPoints],
  );

  const insetLeft =
    (leanRight ? outerShape.slant * 0.25 : padding) + (innerStrokeColors ? effectiveInnerGap : 0);
  const insetRight =
    (leanRight ? padding : outerShape.slant * 0.25) + (innerStrokeColors ? effectiveInnerGap : 0);
  const perimeter = useMemo(() => {
    const topEdge = width - outerShape.slant;
    const sideEdge = Math.sqrt(height * height + outerShape.slant * outerShape.slant);
    return topEdge * 2 + sideEdge * 2;
  }, [height, outerShape.slant, width]);

  const strokeId = useMemo(() => `stroke-${Math.random().toString(36).slice(2)}`, []);
  const fillId = useMemo(() => `fill-${Math.random().toString(36).slice(2)}`, []);
  const innerStrokeId = useMemo(() => `inner-${Math.random().toString(36).slice(2)}`, []);
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
          {innerStrokeColors ? (
            <LinearGradient id={innerStrokeId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={innerStrokeColors[0]} stopOpacity={0.8} />
              <Stop offset="100%" stopColor={innerStrokeColors[1]} stopOpacity={0.8} />
            </LinearGradient>
          ) : null}
        </Defs>
        <Polygon
          points={polygonPoints}
          stroke={`url(#${strokeId})`}
          fill={`url(#${fillId})`}
          strokeWidth={2.4}
        />
        {innerStrokeColors && innerPointsString ? (
          <Polygon
            points={innerPointsString}
            stroke={`url(#${innerStrokeId})`}
            fill="none"
            strokeWidth={1.2}
            opacity={0.65}
          />
        ) : null}
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
          {
            left: insetLeft,
            right: insetRight,
            top: padding + effectiveInnerGap,
            bottom: padding + effectiveInnerGap,
          },
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
