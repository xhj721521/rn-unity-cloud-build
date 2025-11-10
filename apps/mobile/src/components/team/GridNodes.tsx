import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  rows: number;
  cols: number;
  cleared: number;
  total: number;
};

export const GridNodes = ({ rows, cols, cleared, total }: Props) => {
  const cells = rows * cols;
  return (
    <View style={styles.grid}>
      {Array.from({ length: cells }).map((_, index) => {
        const state = index < cleared ? 'done' : index < total ? 'active' : 'locked';
        return <View key={index} style={[styles.cell, cellStyle[state]]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
});

const cellStyle = {
  done: { backgroundColor: '#20E0E8', borderColor: '#20E0E8' },
  active: { backgroundColor: 'transparent', borderColor: '#E8C26A' },
  locked: { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.12)' },
};

export default GridNodes;
