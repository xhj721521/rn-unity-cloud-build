import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, G, Line, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

const withAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const microFrame = (radius: number) => ({
  borderRadius: radius,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(255,255,255,0.08)',
  shadowColor: '#000',
  shadowOpacity: 0.35,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 6 },
  ...(Platform.OS === 'android' ? { elevation: 6 } : null),
});

const TopHighlight = ({ r }: { r: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      left: 1,
      right: 1,
      top: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderTopLeftRadius: r - 1,
      borderTopRightRadius: r - 1,
    }}
  />
);

type CardProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

type FeatureCardProps = CardProps & {
  colors?: [string, string];
};

export function SurfaceCard({ style, children }: CardProps) {
  const radius = 20;
  return (
    <View style={[styles.surfaceBase, microFrame(radius), style]}>
      <TopHighlight r={radius} />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <Line x1="0" y1="0" x2="14" y2="0" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
            <Line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
          </Pattern>
          <RadialGradient id="vig2" cx="100%" cy="100%" r="70%">
            <Stop offset="0%" stopColor="#000" stopOpacity={0.18} />
            <Stop offset="100%" stopColor="#000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="45%" height="42%" fill="url(#grid)" />
        <Rect width="100%" height="100%" fill="url(#vig2)" />
      </Svg>
      {children}
    </View>
  );
}

export function FeatureCard({ style, children, colors = ['#7B5CFF', '#2D87FF'] }: FeatureCardProps) {
  const radius = 18;
  const shaded = [withAlpha(colors[0], 0.32), withAlpha(colors[1], 0.58)];
  return (
    <LinearGradient colors={shaded} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.featureBase, microFrame(radius), style]}>
      <TopHighlight r={radius} />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="halo" cx="28%" cy="24%" r="46%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#halo)" />
        <G opacity={0.08} stroke={colors[1]} strokeWidth={1.4}>
          <Line x1="72%" y1="16%" x2="94%" y2="16%" />
          <Line x1="94%" y1="16%" x2="94%" y2="38%" />
          <Circle cx="72%" cy="16%" r="2" />
          <Circle cx="94%" cy="38%" r="2" />
        </G>
      </Svg>
      <View pointerEvents="none" style={styles.featureTone} />
      {children}
    </LinearGradient>
  );
}

export function CapsuleCard({ style, children }: CardProps) {
  const radius = 14;
  return (
    <View style={[styles.capsuleBase, microFrame(radius), style]}>
      <TopHighlight r={radius} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.capsuleInset]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surfaceBase: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(16,18,38,0.86)',
    overflow: 'hidden',
  },
  featureBase: {
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
  },
  featureTone: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,10,26,0.32)',
  },
  capsuleBase: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(20,22,40,0.78)',
    overflow: 'hidden',
  },
  capsuleInset: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.18)',
  },
});
