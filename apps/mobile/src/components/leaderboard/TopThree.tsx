import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { LeaderboardEntry } from '@state/leaderboard/leaderboardSlice';
import { typography } from '@theme/typography';

type TopThreeProps = {
  entries: LeaderboardEntry[];
};

const TINTS = {
  1: leaderboardAssets.tintGold,
  2: leaderboardAssets.tintSilver,
  3: leaderboardAssets.tintBronze,
} as const;

export const TopThree = ({ entries }: TopThreeProps) => {
  if (!entries.length) {
    return null;
  }
  const ordered = [...entries].slice(0, 3).sort((a, b) => a.rank - b.rank);
  return (
    <View style={styles.row}>
      {ordered.map((entry) => (
        <NeonCard
          key={entry.userId}
          backgroundSource={leaderboardAssets.background}
          overlayColor="rgba(10,16,41,0.54)"
          borderRadius={leaderboardTokens.radiusCard}
          borderColors={leaderboardTokens.gradientStroke}
          innerBorderColors={leaderboardTokens.gradientInner}
          contentPadding={16}
          style={[styles.card, entry.rank === 1 && styles.cardChampion]}
        >
          <Image
            source={TINTS[entry.rank as 1 | 2 | 3] ?? leaderboardAssets.tintSilver}
            style={styles.tint}
          />
          <View style={styles.cardHeader}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>
                {`NO.${String(entry.rank).padStart(2, '0')}`}
              </Text>
            </View>
            <View style={styles.trendDot} />
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{entry.playerName.slice(0, 1)}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {entry.playerName}
          </Text>
          <Text style={styles.value}>{formatScore(entry.score)}</Text>
        </NeonCard>
      ))}
    </View>
  );
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: leaderboardTokens.paddingPage,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    height: 124,
    overflow: 'hidden',
  },
  cardChampion: {
    transform: [{ translateY: -4 }],
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
    resizeMode: 'cover',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  rankBadgeText: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextMain,
  },
  trendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: leaderboardTokens.colorTextHigh,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  avatarLabel: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
  },
  name: {
    ...typography.caption,
    color: leaderboardTokens.colorTextSub,
    marginTop: 6,
  },
  value: {
    color: leaderboardTokens.colorTextMain,
    fontSize: leaderboardTokens.fsTopValue,
    fontWeight: '700',
    marginTop: 4,
  },
});
