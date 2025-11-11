import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type RewardProgressProps = {
  current: number;
  target: number;
  rewardLabel: string;
};

export const RewardProgress = ({ current, target, rewardLabel }: RewardProgressProps) => {
  const percent = Math.min(1, current / target);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.value}>
          {current}/{target}
        </Text>
        <Text style={styles.delta}>差 {Math.max(target - current, 0)} 人</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percent * 100}%` }]} />
      </View>
      <Text style={styles.reward}>{rewardLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    ...typography.subtitle,
    color: palette.text,
  },
  delta: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  bar: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  reward: {
    ...typography.caption,
    color: palette.sub,
  },
});

export default RewardProgress;
