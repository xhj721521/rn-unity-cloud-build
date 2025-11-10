import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import { GlowButton } from '@components/common/GlowButton';
import { leaderboardAssets, leaderboardTokens } from '@modules/home/leaderboardTokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

type RewardCard = {
  key: string;
  title: string;
  body: string;
  claimable?: boolean;
};

type SeasonRewardsProps = {
  rewards: RewardCard[];
};

export const SeasonRewards = ({ rewards }: SeasonRewardsProps) => {
  if (!rewards.length) {
    return null;
  }
  return (
    <View style={styles.wrapper}>
      {rewards.map((reward) => (
        <NeonCard
          key={reward.key}
          backgroundSource={leaderboardAssets.background}
          overlayColor="rgba(10,16,41,0.54)"
          borderRadius={leaderboardTokens.radiusCard}
          borderColors={leaderboardTokens.gradientStroke}
          innerBorderColors={leaderboardTokens.gradientInner}
          contentPadding={16}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardBadge}>SEASON</Text>
            <Text style={styles.cardTitle}>{reward.title}</Text>
          </View>
          <Text style={styles.cardBody}>{reward.body}</Text>
          <GlowButton
            label={t('lb.claim_now', undefined, '立即领取')}
            disabledLabel={t('lb.insufficient', undefined, '进度不足')}
            disabled={!reward.claimable}
            onPress={() => {}}
          />
        </NeonCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: leaderboardTokens.paddingPage,
    gap: 12,
    marginBottom: 40,
  },
  card: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardBadge: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextHigh,
  },
  cardTitle: {
    ...typography.subtitle,
    color: leaderboardTokens.colorTextMain,
  },
  cardBody: {
    ...typography.body,
    color: leaderboardTokens.colorTextSub,
  },
});
