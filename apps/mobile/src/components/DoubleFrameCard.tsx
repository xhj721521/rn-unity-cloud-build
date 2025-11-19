import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  rank?: number;
  width: number;
  height?: number;
  children: React.ReactNode;
};

const gradientForRank = (rank?: number) => {
  if (rank === 1) return ['#FFD66B', '#FFE8A8'];
  if (rank === 2) return ['#C7D2FF', '#E2E7FF'];
  if (rank === 3) return ['#B794F6', '#D8C2FF'];
  return ['#2A3C67', '#3D5B9A'];
};

const DoubleFrameCard: React.FC<Props> = ({ rank, width, height = 150, children }) => {
  const colors = gradientForRank(rank);
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.outer, { width, height }]}
    >
      <View style={styles.shell}>
        <View style={styles.card}>
          <View style={styles.frost} />
          {children}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 18,
    padding: 1,
  },
  shell: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(31,42,68,0.8)',
    backgroundColor: '#121A2C',
    overflow: 'hidden',
  },
  frost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

export default DoubleFrameCard;
