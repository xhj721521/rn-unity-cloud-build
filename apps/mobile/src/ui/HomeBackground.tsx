import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Line,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export type PerfTier = 'low' | 'mid' | 'high';

export interface HomeBackgroundProps {
  tier?: PerfTier;
  showNoise?: boolean;
  showScanlines?: boolean;
  showVaporLayers?: boolean;
}

const noiseTexture = require('../assets/noise-2px.png');
const skylineTexture = require('../assets/backgrounds/neon_skyline.jpg');

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
  showVaporLayers = true,
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

  const wavePaths = useMemo(() => {
    const first = [
      `M0 ${height * 0.78}`,
      `C${width * 0.2} ${height * 0.72}, ${width * 0.4} ${height * 0.82}, ${width * 0.6} ${
        height * 0.76
      }`,
      `S${width * 0.95} ${height * 0.86}, ${width} ${height * 0.78}`,
      `L${width} ${height}`,
      `L0 ${height} Z`,
    ].join(' ');
    const second = [
      `M0 ${height * 0.86}`,
      `C${width * 0.18} ${height * 0.82}, ${width * 0.38} ${height * 0.9}, ${width * 0.58} ${
        height * 0.84
      }`,
      `S${width * 0.92} ${height * 0.94}, ${width} ${height * 0.88}`,
      `L${width} ${height}`,
      `L0 ${height} Z`,
    ].join(' ');
    return { first, second };
  }, [height, width]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={skylineTexture}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, styles.skylineLayer]}
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
                <Stop offset="0%" stopColor="rgba(138, 99, 246, 0.08)" />
                <Stop offset="70%" stopColor="rgba(138, 99, 246, 0.14)" />
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
                <Stop offset="0%" stopColor="rgba(45, 210, 255, 0.06)" />
                <Stop offset="70%" stopColor="rgba(45, 210, 255, 0.12)" />
                <Stop offset="100%" stopColor="rgba(45, 210, 255, 0)" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#home-fog-b)" />
          </Svg>
        </AnimatedView>
      ) : null}

      {showVaporLayers ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <Defs>
              <SvgLinearGradient id="vapor-sun" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="rgba(255,141,255,0.2)" />
                <Stop offset="100%" stopColor="rgba(255,141,255,0)" />
              </SvgLinearGradient>
              <SvgLinearGradient id="vapor-grid" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="rgba(74, 255, 245, 0.08)" />
                <Stop offset="100%" stopColor="rgba(116, 161, 255, 0.08)" />
              </SvgLinearGradient>
              <SvgLinearGradient id="vapor-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="rgba(114, 239, 255, 0.12)" />
                <Stop offset="100%" stopColor="rgba(255, 135, 255, 0.12)" />
              </SvgLinearGradient>
              <SvgLinearGradient id="vapor-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="rgba(93, 195, 255, 0.12)" />
                <Stop offset="100%" stopColor="rgba(255, 99, 214, 0.12)" />
              </SvgLinearGradient>
            </Defs>
            <Rect
              x="20%"
              y="10%"
              width="60%"
              height="20%"
              rx="120"
              fill="url(#vapor-sun)"
              opacity={0.2}
            />
            <Path
              d={`M0 ${height * 0.72} L${width} ${
                height * 0.58
              } L${width} ${height} L0 ${height} Z`}
              fill="url(#vapor-grid)"
              opacity={0.08}
            />
            <Path d={wavePaths.first} fill="url(#vapor-wave)" opacity={0.12} />
            <Path d={wavePaths.second} fill="url(#vapor-wave-2)" opacity={0.12} />
          </Svg>
        </View>
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
  skylineLayer: {
    opacity: 1,
    transform: [{ scale: 1.02 }],
  },
  noiseLayer: {
    opacity: 0.02,
  },
  scanLayer: {
    position: 'absolute',
    opacity: 0.04,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 3, 10, 0.2)',
  },
});
