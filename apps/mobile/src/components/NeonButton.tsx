import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/colors';
import { PRESS_SCALE, RADIUS } from '../theme/metrics';

const glowBtn = require('../../assets/glow_btn.png');

type Props = {
  title: string;
  onPress: () => void;
};

export default function NeonButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.pressable} accessibilityRole="button">
      {({ pressed }) => (
        <View style={[styles.body, { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] }]}
        >
          <Image source={glowBtn} resizeMode="stretch" style={[styles.glow, { opacity: pressed ? 0.6 : 0.9 }]} />
          <Text style={styles.label}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
  },
  body: {
    minWidth: 168,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: palette.magenta,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  glow: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: -18,
    bottom: -18,
  },
  label: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
});
