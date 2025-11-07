import React from 'react';
import { Image, StyleSheet } from 'react-native';

export type PerfTier = 'low' | 'mid' | 'high';

export interface HomeBackgroundProps {
  tier?: PerfTier;
  showNoise?: boolean;
  showScanlines?: boolean;
  showVaporLayers?: boolean;
}

const skylineTexture = require('../assets/backgrounds/neon_skyline.jpg');

export default function HomeBackground(_: HomeBackgroundProps) {
  return (
    <Image
      pointerEvents="none"
      source={skylineTexture}
      resizeMode="cover"
      style={[StyleSheet.absoluteFill, styles.skylineLayer]}
    />
  );
}

const styles = StyleSheet.create({
  skylineLayer: {
    opacity: 1,
    transform: [{ scale: 1.02 }],
  },
});
