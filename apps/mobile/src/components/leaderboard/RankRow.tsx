import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { LeaderboardEntry } from '@state/leaderboard/leaderboardSlice';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

type RankRowProps = {
  entry: LeaderboardEntry;
  highlight?: boolean;
};

export const RankRow = ({ entry, highlight }: RankRowProps) => (
  <NeonCard
    backgroundSource={leaderboardAssets.background}
    overlayColor="rgba(10,16,41,0.54)"
    borderRadius={leaderboardTokens.radiusCard}
    borderColors={highlight ? ['#00D1C7', '#8A5CFF'] : leaderboardTokens.gradientStroke}
    innerBorderColors={leaderboardTokens.gradientInner}
    contentPadding={16}
    style={[styles.row, highlight && styles.rowHighlight]}
  >
    <View style={styles.rowContent}>
      <View style={styles.rankBadgeOuter}>
        <View style={styles.rankBadgeInner}>
          <Text style={styles.rankBadgeText}>{entry.rank}</Text>
        </View>
      </View>
      <View style={styles.rowMeta}>
        <Text style={styles.rowName} numberOfLines={1}>
          {entry.playerName}
        </Text>
        <Text style={styles.rowId}>{entry.userId}</Text>
      </View>
      <View style={styles.scoreBlock}>
        <Text style={styles.scoreValue}>{formatScore(entry.score)}</Text>
        <Text style={styles.scoreUnit}>{t('lb.score', undefined, '积分')}</Text>
      </View>
    </View>
  </NeonCard>
);

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value);

const styles = StyleSheet.create({
  row: {
    marginHorizontal: leaderboardTokens.paddingPage,
    marginBottom: 12,
  },
  rowHighlight: {
    shadowColor: '#00D1C7',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadgeOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  rankBadgeInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,209,199,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeText: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
  },
  rowMeta: {
    flex: 1,
  },
  rowName: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
  },
  rowId: {
    ...typography.caption,
    color: leaderboardTokens.colorTextSub,
  },
  scoreBlock: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    color: leaderboardTokens.colorTextMain,
    fontSize: leaderboardTokens.fsListValue,
    fontWeight: '700',
  },
  scoreUnit: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextSub,
  },
});
