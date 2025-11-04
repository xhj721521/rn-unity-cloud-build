import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';
import { PRESS_SCALE } from '@theme/metrics';

export default function NeonButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}> 
      <Image source={require('../../assets/glow_btn.png')} style={StyleSheet.absoluteFill} resizeMode="stretch" />
      <Text style={styles.btnText}>{title}</Text>
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
