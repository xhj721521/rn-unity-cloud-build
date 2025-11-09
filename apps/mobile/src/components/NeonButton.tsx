import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';
import { PRESS_SCALE } from '@theme/metrics';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function NeonButton({ title, onPress }: { title: string; onPress: () => void }) {
  const glow = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoop.start();
    pulseLoop.start();
    return () => {
      glowLoop.stop();
      pulseLoop.stop();
    };
  }, [glow, pulse]);

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
        <AnimatedImage
          source={require('../assets/glow_btn.png')}
          style={[StyleSheet.absoluteFill, { opacity: glowOpacity }]}
          resizeMode="stretch"
        />
        <Text style={styles.btnText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(124, 92, 255, 0.28)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  btnPressed: {
    transform: [{ scale: PRESS_SCALE }],
    opacity: 0.9,
  },
  btnText: {
    color: '#F8FAFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
