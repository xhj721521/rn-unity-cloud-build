import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { RADIUS } from '../theme/metrics';

const glowCard = require('../../assets/glow_card.png');

type Props = {
  style?: StyleProp<ViewStyle>;
  tiltDeg: number;
  borderColor: string;
  glass?: [string, string];
  children?: React.ReactNode;
};

export default function TiltFrame({
  style,
  tiltDeg,
  borderColor,
  glass = ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'],
  children,
}: Props) {
  return (
    <View style={[style, styles.root]}>
      <Image source={glowCard} resizeMode="stretch" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.frame,
          {
            borderColor,
            transform: [{ skewX: `${tiltDeg}deg` }],
          },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: glass[1] }]} />
        <View style={[StyleSheet.absoluteFill, styles.glassTop, { backgroundColor: glass[0] }]} />
        <View style={[styles.content, { transform: [{ skewX: `${-tiltDeg}deg` }] }]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'visible',
  },
  frame: {
    borderWidth: 1,
    borderRadius: RADIUS,
    backgroundColor: 'rgba(10, 10, 20, 0.6)',
    overflow: 'hidden',
  },
  glassTop: {
    opacity: 0.5,
  },
  content: {
    padding: 14,
  },
});
