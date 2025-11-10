import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { LeaderboardEntry } from '@state/leaderboard/leaderboardSlice';
import { typography } from '@theme/typography';

type RankGridProps = {
  entries: LeaderboardEntry[];
};

export const RankGrid = ({ entries }: RankGridProps) => {
  if (!entries.length) {
    return null;
  }
  const rows: LeaderboardEntry[][] = [];
  for (let i = 0; i < entries.length; i += 3) {
    rows.push(entries.slice(i, i + 3));
  }
  return (
    <View style={styles.wrapper}>
      {rows.map((row, rowIndex) => (
        <View
          key={`grid-row-${rowIndex}`}
          style={[styles.row, rowIndex === rows.length - 1 && styles.rowLast]}
        >
          {row.map((entry, colIndex) => (
            <NeonCard
              key={entry.userId}
              backgroundSource={leaderboardAssets.background}
              overlayColor="rgba(10,16,41,0.54)"
              borderRadius={leaderboardTokens.radiusCard}
              borderColors={leaderboardTokens.gradientStroke}
              innerBorderColors={leaderboardTokens.gradientInner}
              contentPadding={12}
              style={[styles.card, colIndex < 2 && styles.cardSpacing]}
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
          {row.length < 3
            ? Array.from({ length: 3 - row.length }).map((_, index) => (
                <View
                  key={`placeholder-${rowIndex}-${index}`}
                  style={[styles.placeholder, row.length + index < 2 && styles.cardSpacing]}
                />
              ))
            : null}
        </View>
      ))}
    </View>
  );
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: leaderboardTokens.paddingPage,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rowLast: {
    marginBottom: 0,
  },
  card: {
    flex: 1,
    height: 120,
  },
  cardSpacing: {
    marginRight: 12,
  },
  placeholder: {
    flex: 1,
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
