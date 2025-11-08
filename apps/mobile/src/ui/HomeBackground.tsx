import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(96, 184, 255, 0.18)', 'rgba(255, 128, 255, 0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalGlow}
      />
      <View style={styles.bottomFade}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.65)', 'rgba(0, 0, 0, 0.2)', 'transparent']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
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
  diagonalGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 170,
  },
});
