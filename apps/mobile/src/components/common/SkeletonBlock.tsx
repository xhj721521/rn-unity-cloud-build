import React from 'react';
import { StyleSheet, View } from 'react-native';

type SkeletonBlockProps = {
  height: number;
  borderRadius?: number;
  style?: object;
};

export const SkeletonBlock = ({ height, borderRadius = 20, style }: SkeletonBlockProps) => (
  <View style={[styles.shadow, style]}>
    <View style={[styles.block, { height, borderRadius }]} />
  </View>
);

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#00FFD1',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  block: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});

export default SkeletonBlock;
