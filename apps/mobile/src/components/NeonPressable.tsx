import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type NeonPressableProps = PressableProps & {
  scale?: number;
  activeOpacity?: number;
};

export const NeonPressable: React.FC<NeonPressableProps> = ({
  children,
  style,
  scale = 0.97,
  activeOpacity = 0.9,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo<Animated.WithAnimatedObject<ViewStyle>>(
    () => ({
      transform: [
        {
          scale: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, scale],
          }),
        },
      ],
      opacity: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [1, activeOpacity],
      }),
    }),
    [activeOpacity, animated, scale],
  );

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    Animated.spring(animated, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 8,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    Animated.spring(animated, {
      toValue: 0,
      useNativeDriver: true,
      speed: 28,
      bounciness: 8,
    }).start();
    onPressOut?.(event);
  };

  const composedStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const base = Array.isArray(style) ? style : style ? [style] : [];
    return [...base, animatedStyle];
  }, [animatedStyle, style]);

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={composedStyle}
    >
      {children}
    </AnimatedPressable>
  );
};
