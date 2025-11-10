import React from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressEnergyBarProps = {
  progress: number;
  variant?: 'thin' | 'thick';
};

export const ProgressEnergyBar = ({ progress, variant = 'thin' }: ProgressEnergyBarProps) => {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.base, variant === 'thick' ? styles.thick : styles.thin]}>
      <View
        style={[
          styles.fill,
          variant === 'thick' ? styles.fillThick : styles.fillThin,
          { width: `${clamped * 100}%` },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  thin: {
    height: 6,
  },
  thick: {
    height: 14,
  },
  fill: {
    height: '100%',
  },
  fillThin: {
    backgroundColor: 'rgba(32,224,232,0.8)',
  },
  fillThick: {
    backgroundColor: 'rgba(232,194,106,0.9)',
  },
});

export default ProgressEnergyBar;
