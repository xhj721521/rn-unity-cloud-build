import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type NeonPulseOptions = {
  duration?: number;
};

export const useNeonPulse = ({ duration = 4200 }: NeonPulseOptions = {}) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animated, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animated, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [animated, duration]);

  return animated;
};

export const getGlowStyle = ({
  animated,
  minOpacity = 0.35,
  maxOpacity = 0.75,
  minScale = 0.95,
  maxScale = 1.18,
}: {
  animated: Animated.Value;
  minOpacity?: number;
  maxOpacity?: number;
  minScale?: number;
  maxScale?: number;
}) => ({
  opacity: animated.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity],
  }),
  transform: [
    {
      scale: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [minScale, maxScale],
      }),
    },
  ],
});
