import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { LeaderboardEntry } from '@state/leaderboard/leaderboardSlice';
import { typography } from '@theme/typography';

type RankGridProps = {
  entries: LeaderboardEntry[];
};

export const RankGrid = ({ entries }: RankGridProps) => {
  const { width } = useWindowDimensions();
  const gap = 12;
  const cardWidth = (width - leaderboardTokens.paddingPage * 2 - gap * 2) / 3;

  return (
    <View style={[styles.grid, { columnGap: gap, rowGap: gap }]}>
      {entries.map((entry) => (
        <NeonCard
          key={entry.userId}
          backgroundSource={leaderboardAssets.background}
          overlayColor="rgba(10,16,41,0.54)"
          borderRadius={leaderboardTokens.radiusCard}
          borderColors={leaderboardTokens.gradientStroke}
          innerBorderColors={leaderboardTokens.gradientInner}
          contentPadding={12}
          style={[styles.card, { width: cardWidth }]}
        >
          <View style={styles.gridRank}>
            <Text style={styles.gridRankText}>{entry.rank}</Text>
          </View>
          <View style={styles.gridAvatar}>
            <Text style={styles.gridAvatarLabel}>{entry.playerName.slice(0, 1)}</Text>
          </View>
          <Text style={styles.gridName} numberOfLines={1}>
            {entry.playerName}
          </Text>
          <Text style={styles.gridScore}>{formatScore(entry.score)}</Text>
        </NeonCard>
      ))}
    </View>
  );
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: leaderboardTokens.paddingPage,
    marginBottom: 20,
  },
  card: {
    height: 120,
  },
  gridRank: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridRankText: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextMain,
  },
  gridAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridAvatarLabel: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
  },
  gridName: {
    ...typography.caption,
    color: leaderboardTokens.colorTextSub,
  },
  gridScore: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
    marginTop: 4,
  },
});
