import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { LeaderboardEntry } from '@state/leaderboard/leaderboardSlice';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { translate as t } from '@locale/strings';

type HeroCardProps = {
  topEntry?: LeaderboardEntry;
  myRank?: LeaderboardEntry | null;
  onBackToMine: () => void;
};

export const HeroCard = ({ topEntry, myRank, onBackToMine }: HeroCardProps) => (
  <NeonCard
    backgroundSource={leaderboardAssets.background}
    overlayColor="rgba(10,15,43,0.6)"
    borderRadius={leaderboardTokens.radiusCard}
    borderColors={leaderboardTokens.gradientStroke}
    innerBorderColors={leaderboardTokens.gradientInner}
    contentPadding={20}
    style={styles.card}
  >
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>NO.01</Text>
        <Text style={styles.score}>{topEntry ? formatScore(topEntry.score) : '--'}</Text>
        <Text style={styles.name}>{topEntry?.playerName ?? '待更新'}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.rankPill}>
          <Text style={styles.rankPillText}>
            {myRank
              ? `${t('lb.my_rank', undefined, '我的排名')} #${myRank.rank} | ${formatScore(
                  myRank.score,
                )}`
              : t('rank.empty', undefined, '暂无上榜记录')}
          </Text>
        </View>
        <RipplePressable style={styles.backButton} onPress={onBackToMine}>
          <Text style={styles.backButtonText}>{t('lb.back_to_me', undefined, '回到我的排名')}</Text>
        </RipplePressable>
      </View>
    </View>
  </NeonCard>
);

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value);

const styles = StyleSheet.create({
  card: {
    height: 240,
    marginHorizontal: leaderboardTokens.paddingPage,
    marginBottom: 12,
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextSub,
  },
  score: {
    color: leaderboardTokens.colorTextMain,
    fontSize: leaderboardTokens.fsHeroValue,
    fontWeight: '700',
    letterSpacing: leaderboardTokens.trackingNum / 10,
    marginTop: 8,
  },
  name: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextSub,
    marginTop: 8,
  },
  actions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  rankPill: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: leaderboardTokens.colorBgSegOn,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  rankPillText: {
    ...typography.caption,
    color: palette.text,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  backButtonText: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextHigh,
  },
});
