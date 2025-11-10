import React from 'react';
import { StyleSheet, View } from 'react-native';

export const SkeletonGrid = () => (
  <View style={styles.container}>
    {Array.from({ length: 6 }).map((_, index) => (
      <View key={index} style={styles.row}>
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  skeleton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
