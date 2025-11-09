import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
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
  const drift = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 14000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 14000, useNativeDriver: true }),
      ]),
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ]),
    );
    driftLoop.start();
    glowLoop.start();
    return () => {
      driftLoop.stop();
      glowLoop.stop();
    };
  }, [drift, glowPulse]);

  const driftStyle = {
    transform: [
      {
        translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] }),
      },
      {
        translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [4, -4] }),
      },
      {
        scale: drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }),
      },
    ],
  };

  const glowStyle = {
    opacity: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.45] }),
  };

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.Image
        source={skylineTexture}
        resizeMode="contain"
        style={[styles.skylineLayer, driftStyle]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(96, 184, 255, 0.18)', 'rgba(255, 128, 255, 0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalGlow}
      />
      <Animated.View style={[styles.diagonalGlow, glowStyle]} />
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
