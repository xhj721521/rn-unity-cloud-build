import React from 'react';
import { StyleSheet, View } from 'react-native';

const SkeletonCard = ({ width, height = 150 }: { width: number; height?: number }) => (
  <View style={[styles.card, { width, height }]} />
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

export default SkeletonCard;
