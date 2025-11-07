import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export type PerfTier = 'low' | 'mid' | 'high';

export interface HomeBackgroundProps {
  tier?: PerfTier;
  showNoise?: boolean;
  showScanlines?: boolean;
  showVaporLayers?: boolean;
}

const skylineTexture = require('../assets/backgrounds/neon_skyline.png');

export default function HomeBackground(_: HomeBackgroundProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Image source={skylineTexture} resizeMode="contain" style={styles.skylineLayer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050612',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skylineLayer: {
    width: '100%',
    height: '100%',
  },
});
