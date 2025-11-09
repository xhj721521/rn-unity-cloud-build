import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export type PerfTier = 'low' | 'mid' | 'high';

export interface HomeBackgroundProps {
  tier?: PerfTier;
  showNoise?: boolean;
  showScanlines?: boolean;
  showVaporLayers?: boolean;
}

const skylineTexture = require('../assets/backgrounds/neon_skyline.png');

export default function HomeBackground(_props: HomeBackgroundProps) {
  const drift = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => ({
        id: `particle-${index}`,
        size: Math.random() * 1.2 + 0.4,
        left: Math.random() * width,
        startY: Math.random() * height,
        duration: 10000 + Math.random() * 4000,
        delay: Math.random() * 6000,
      })),
    [height, width],
  );
  const particleAnim = useRef(particles.map(() => new Animated.Value(0))).current;

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
    const scanLoop = Animated.loop(
      Animated.timing(scan, { toValue: 1, duration: 30000, useNativeDriver: true }),
    );
    const particleLoops = particleAnim.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(particles[index].delay),
          Animated.timing(value, {
            toValue: 1,
            duration: particles[index].duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );

    driftLoop.start();
    glowLoop.start();
    scanLoop.start();
    particleLoops.forEach((loop) => loop.start());
    return () => {
      driftLoop.stop();
      glowLoop.stop();
      scanLoop.stop();
      particleLoops.forEach((loop) => loop.stop());
    };
  }, [drift, glowPulse, particleAnim, particles, scan]);

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
  const scanStyle = {
    transform: [
      {
        translateY: scan.interpolate({
          inputRange: [0, 1],
          outputRange: [height, -height],
        }),
      },
    ],
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
      <View pointerEvents="none" style={styles.particleLayer}>
        {particles.map((particle, index) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                left: particle.left,
                opacity: 0.08 + particle.size * 0.08,
                transform: [
                  {
                    translateY: particleAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [particle.startY, particle.startY - height - 60],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
      <Animated.View style={[styles.scanLine, scanStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.02)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
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
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#8AF0FF',
    borderRadius: 2,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    opacity: 0.05,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 170,
  },
});
