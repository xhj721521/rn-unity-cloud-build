import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

type RipplePressableProps = PressableProps & {
  rippleColor?: string;
};

const RipplePressable = React.forwardRef<Pressable, RipplePressableProps>(
  (
    { children, rippleColor = 'rgba(255,255,255,0.18)', style, onPressIn, onLayout, ...rest },
    ref,
  ) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [size, setSize] = useState(0);

    const trigger = useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [anim]);

    const handlePressIn: PressableProps['onPressIn'] = (event) => {
      trigger();
      onPressIn?.(event);
    };

    const handleLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setSize(Math.max(width, height));
      onLayout?.(event);
    };

    const rippleSize = useMemo(() => (size ? size * 0.8 : 0), [size]);

    const rippleStyle = {
      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0] }),
      transform: [{ scale: anim }],
    };

    return (
      <Pressable
        ref={ref}
        {...rest}
        onPressIn={handlePressIn}
        onLayout={handleLayout}
        style={style}
      >
        <View style={styles.rippleContainer}>
          {children}
          {rippleSize > 0 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ripple,
                rippleStyle,
                {
                  backgroundColor: rippleColor,
                  width: rippleSize,
                  height: rippleSize,
                  borderRadius: rippleSize / 2,
                  marginLeft: -rippleSize / 2,
                  marginTop: -rippleSize / 2,
                },
              ]}
            />
          ) : null}
        </View>
      </Pressable>
    );
  },
);

RipplePressable.displayName = 'RipplePressable';

const styles = StyleSheet.create({
  rippleContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default RipplePressable;
