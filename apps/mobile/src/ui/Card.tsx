import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

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
  borderColor: 'rgba(255,255,255,0.05)',
  shadowColor: '#000',
  shadowOpacity: 0.28,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 4 },
  ...(Platform.OS === 'android' ? { elevation: 4 } : null),
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
          <RadialGradient id="vig2" cx="82%" cy="88%" r="68%">
            <Stop offset="0%" stopColor="#000" stopOpacity={0.16} />
            <Stop offset="100%" stopColor="#000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
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
          <RadialGradient id="halo" cx="36%" cy="30%" r="42%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="halo-accent" cx="78%" cy="68%" r="40%">
            <Stop offset="0%" stopColor={colors[1]} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#halo)" />
        <Rect width="100%" height="100%" fill="url(#halo-accent)" />
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
