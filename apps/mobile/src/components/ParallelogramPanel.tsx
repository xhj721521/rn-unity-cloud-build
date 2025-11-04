import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

type ParallelogramPanelProps = PropsWithChildren<{
  width: number;
  height: number;
  tiltDeg?: number;
  strokeColors?: [string, string];
  fillColors?: [string, string];
  padding?: number;
}>;

const degToRad = (deg: number) => (deg * Math.PI) / 180;

export const ParallelogramPanel = ({
  width,
  height,
  tiltDeg = -10,
  strokeColors = ['#FF55D8', '#3FE8FF'],
  fillColors = ['rgba(18, 8, 32, 0.96)', 'rgba(10, 4, 22, 0.9)'],
  padding = 16,
  children,
}: ParallelogramPanelProps) => {
  const leanRight = tiltDeg >= 0;
  const absTilt = Math.abs(tiltDeg);
  const slant = Math.min(Math.tan(degToRad(absTilt)) * height, width * 0.35);

  const polygonPoints = useMemo(() => {
    const p1X = leanRight ? 0 : slant;
    const p2X = leanRight ? width - slant : width;
    const p3X = leanRight ? width : width - slant;
    const p4X = leanRight ? slant : 0;
    return `${p1X},0 ${p2X},0 ${p3X},${height} ${p4X},${height}`;
  }, [height, leanRight, slant, width]);

  const insetLeft = leanRight ? slant * 0.3 : padding;
  const insetRight = leanRight ? padding : slant * 0.3;

  const strokeId = useMemo(() => `stroke-${Math.random().toString(36).slice(2)}`, []);
  const fillId = useMemo(() => `fill-${Math.random().toString(36).slice(2)}`, []);

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
      </Svg>
      <View style={[styles.inner, { left: insetLeft, right: insetRight, top: padding, bottom: padding }]}>
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
