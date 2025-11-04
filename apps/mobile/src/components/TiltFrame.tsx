import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { RADIUS } from '@theme/metrics';

type Props = {
  style?: ViewStyle;
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
  const tiltY = tiltDeg * 0.25;
  return (
    <View style={[style, { overflow: 'visible' }]}> 
      <Image source={require('../assets/glow_card.png')} style={StyleSheet.absoluteFill} resizeMode="stretch" />
      <View
        style={[
          styles.skew,
          {
            transform: [{ skewX: `${tiltDeg}deg` }, { skewY: `${tiltY}deg` }],
            borderColor,
            shadowColor: borderColor,
          },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: glass[1] }]} />
        <View style={[StyleSheet.absoluteFill, { opacity: 0.5, backgroundColor: glass[0] }]} />
        <View
          style={{
            transform: [{ skewX: `${-tiltDeg}deg` }, { skewY: `${-tiltY}deg` }],
            padding: 14,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skew: {
    borderRadius: RADIUS,
    borderWidth: 1,
    backgroundColor: 'rgba(10, 12, 28, 0.86)',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
