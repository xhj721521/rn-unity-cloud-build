import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { crownColors } from '../utils';
import { T } from '../tokens';

type Props = {
  rank?: number;
  width: number;
  height?: number;
  children: React.ReactNode;
};

const DoubleFrameCard: React.FC<Props> = ({ rank, width, height = 150, children }) => {
  const colors = crownColors(rank ?? 0);
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
    borderRadius: T.radius.outer,
    padding: 1,
  },
  shell: {
    flex: 1,
    borderRadius: T.radius.lg,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: T.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.color.stroke,
    backgroundColor: T.color.card,
    overflow: 'hidden',
  },
  frost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

export default DoubleFrameCard;
