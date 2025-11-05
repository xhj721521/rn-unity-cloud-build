import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Line, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

export type PerfTier = 'low' | 'mid' | 'high';

export interface HomeBackgroundProps {
  tier?: PerfTier;
  showNoise?: boolean;
  showScanlines?: boolean;
}

const noiseTexture = require('../assets/noise-2px.png');

function autoTier(): PerfTier {
  const { width, height, scale } = Dimensions.get('window');
  const longerEdge = Math.max(width, height);
  if (scale >= 3 && longerEdge >= 2400) {
    return 'high';
  }
  if (scale <= 2 && longerEdge <= 1600) {
    return 'low';
  }
  return 'mid';
}

const AnimatedView = Animated.View;

export default function HomeBackground({
  tier = autoTier(),
  showNoise = true,
  showScanlines,
}: HomeBackgroundProps) {
  const shouldRenderFog = tier !== 'low';
  const enableScanlines = (showScanlines ?? tier === 'high') && tier === 'high';

  const { width, height } = Dimensions.get('window');
  const horizontalRange = width * (tier === 'high' ? 0.08 : 0.06);
  const verticalRange = height * (tier === 'high' ? 0.08 : 0.06);

  const fogX = useRef(new Animated.Value(0.5)).current;
  const fogY = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    fogX.stopAnimation();
    fogY.stopAnimation();

    if (!shouldRenderFog) {
      fogX.setValue(0.5);
      fogY.setValue(0.5);
      return;
    }

    const startLoop = (value: Animated.Value, duration: number) => {
      value.setValue(0);
      const forward = Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      });
      const backward = Animated.timing(value, {
        toValue: 0,
        duration,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      });
      const loop = Animated.loop(Animated.sequence([forward, backward]), {
        resetBeforeIteration: false,
      });
      loop.start();
      return loop;
    };

    const durationX = tier === 'high' ? 110000 : 95000;
    const durationY = tier === 'high' ? 120000 : 105000;
    const loopX = startLoop(fogX, durationX);
    const loopY = startLoop(fogY, durationY);

    return () => {
      loopX?.stop();
      loopY?.stop();
    };
  }, [fogX, fogY, shouldRenderFog, tier]);

  const fogAStyle = useMemo(() => {
    if (!shouldRenderFog) {
      return undefined;
    }
    return {
      transform: [
        {
          translateX: fogX.interpolate({
            inputRange: [0, 1],
            outputRange: [-horizontalRange, horizontalRange],
          }),
        },
      ],
    };
  }, [fogX, horizontalRange, shouldRenderFog]);

  const fogBStyle = useMemo(() => {
    if (!shouldRenderFog) {
      return undefined;
    }
    return {
      transform: [
        {
          translateY: fogY.interpolate({
            inputRange: [0, 1],
            outputRange: [-verticalRange, verticalRange],
          }),
        },
      ],
    };
  }, [fogY, shouldRenderFog, verticalRange]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#050612', '#0D1327', '#161F35']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {shouldRenderFog ? (
        <AnimatedView style={[StyleSheet.absoluteFill, fogAStyle]}>
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient
                id="home-fog-a"
                cx="78%"
                cy="18%"
                r="36%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0%" stopColor="rgba(138, 99, 246, 0.12)" />
                <Stop offset="70%" stopColor="rgba(138, 99, 246, 0.2)" />
                <Stop offset="100%" stopColor="rgba(138, 99, 246, 0)" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#home-fog-a)" />
          </Svg>
        </AnimatedView>
      ) : null}

      {shouldRenderFog ? (
        <AnimatedView style={[StyleSheet.absoluteFill, fogBStyle]}>
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient
                id="home-fog-b"
                cx="24%"
                cy="80%"
                r="32%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0%" stopColor="rgba(45, 210, 255, 0.1)" />
                <Stop offset="70%" stopColor="rgba(45, 210, 255, 0.18)" />
                <Stop offset="100%" stopColor="rgba(45, 210, 255, 0)" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#home-fog-b)" />
          </Svg>
        </AnimatedView>
      ) : null}

      {showNoise ? (
        <Image
          source={noiseTexture}
          resizeMode="repeat"
          style={[StyleSheet.absoluteFill, styles.noiseLayer]}
        />
      ) : null}

      {enableScanlines ? (
        <Svg width="100%" height="100%" style={styles.scanLayer}>
          <Defs>
            <Pattern id="home-scan" patternUnits="userSpaceOnUse" width="2" height="6">
              <Line x1="0" y1="1" x2="2" y2="1" stroke="#000" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#home-scan)" />
        </Svg>
      ) : null}
      <View pointerEvents="none" style={styles.vignetteOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  noiseLayer: {
    opacity: 0.04,
  },
  scanLayer: {
    position: 'absolute',
    opacity: 0.04,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 3, 10, 0.42)',
  },
});
