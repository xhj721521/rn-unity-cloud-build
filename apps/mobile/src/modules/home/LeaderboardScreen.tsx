import React, { useMemo, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { useAppSelector } from '@state/hooks';
import { useAccountSummary } from '@services/web3/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';
import { useNeonPulse } from '@theme/animations';
import { neonPalette } from '@theme/neonPalette';
import { NeonPressable } from '@components/NeonPressable';
import { designTokens } from '@theme/designTokens';

const CATEGORY_TABS: { key: LeaderboardCategory; label: string }[] = [
  { key: 'inviter', label: '邀请榜' },
  { key: 'team', label: '战队榜' },
  { key: 'wealth', label: '财富榜' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const leaderboard = useAppSelector((state) => state.leaderboard);
  const { data: account } = useAccountSummary();
  const currentBoard = leaderboard.data[category][period];
  const rewards = leaderboard.rewards[category];
  const scoreboardPulse = useNeonPulse({ duration: 6800 });
  const categoryLabel =
    CATEGORY_TABS.find((tab) => tab.key === category)?.label ?? '';
  const periodLabel =
    PERIOD_TABS.find((tab) => tab.key === period)?.label ?? '';

  const myRankingLabel = useMemo(() => {
    if (!currentBoard.myRank) {
      return '尚未进入榜单';
    }
    const rankText =
      currentBoard.myRank.rank <= 10
        ? `#${currentBoard.myRank.rank}`
        : 'TOP 10+';
    return `当前排名 ${rankText} · 积分 ${currentBoard.myRank.score}`;
  }, [currentBoard.myRank]);

  const renderEntry = (entry: LeaderboardEntry) => {
    const isMe =
      entry.userId === 'pilot-zero' ||
      account?.displayName === entry.playerName;
    const isTop3 = entry.rank <= 3;

    return (
      <LinearGradient
        key={`${entry.userId}-${entry.rank}`}
        colors={
          isTop3
            ? ['rgba(255, 106, 213, 0.35)', 'rgba(79, 46, 173, 0.45)']
            : ['rgba(11, 11, 32, 0.92)', 'rgba(11, 11, 32, 0.9)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.entryGradient, isMe && styles.entryGradientMe]}
      >
        <View style={[styles.entryRow, isMe && styles.entryRowMe]}>
          <Text style={[styles.entryRank, isTop3 && styles.entryRankTop]}>
            #{entry.rank}
          </Text>
          <View style={styles.entryInfo}>
            <Text style={[styles.entryName, isMe && styles.entryNameMe]}>
              {entry.playerName}
            </Text>
            <Text style={styles.entryScore}>{entry.score} 分</Text>
          </View>
          {isMe ? <Text style={styles.tagMe}>我的</Text> : null}
        </View>
      </LinearGradient>
    );
  };

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>排行榜</Text>
      <Text style={styles.subHeading}>
        邀请、战队、财富三大榜单，支持日/周/月维度筛选。
      </Text>

      <View style={styles.tabRow}>
        {CATEGORY_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            active={category === tab.key}
            onPress={() => setCategory(tab.key)}
          />
        ))}
      </View>

      <View style={styles.tabRowSecondary}>
        {PERIOD_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            active={period === tab.key}
            onPress={() => setPeriod(tab.key)}
            variant="secondary"
          />
        ))}
      </View>

      <InfoCard title={`${categoryLabel} · ${periodLabel}`}>
        <View style={styles.scoreboardHeader}>
          <Text style={styles.scoreboardTitle}>{myRankingLabel}</Text>
          <Text style={styles.scoreboardHint}>显示前 10 名</Text>
        </View>
        <View style={styles.scoreboardWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.scoreboardGlow,
              {
                opacity: scoreboardPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.16, 0.32],
                }),
                transform: [
                  {
                    scale: scoreboardPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.94, 1.05],
                    }),
                  },
                ],
              },
            ]}
          />
          <ScrollView
            style={styles.scoreboard}
            contentContainerStyle={styles.scoreboardContent}
          >
            {currentBoard.entries.map(renderEntry)}
          </ScrollView>
        </View>
      </InfoCard>

      <View style={styles.rewardPanel}>
        <Text style={styles.rewardTitle}>奖励说明</Text>
        <View style={styles.rewardRow}>
          <Text style={styles.rewardLabel}>TOP 1-3</Text>
          <Text style={styles.rewardValue}>{rewards.top1To3}</Text>
        </View>
        <View style={styles.rewardDivider} />
        <View style={styles.rewardRow}>
          <Text style={styles.rewardLabel}>TOP 4-10</Text>
          <Text style={styles.rewardValue}>{rewards.top4To10}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

type TabButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

const TabButton = ({
  label,
  active,
  onPress,
  variant = 'primary',
}: TabButtonProps) => (
  <NeonPressable
    onPress={onPress}
    style={[
      styles.tabButton,
      variant === 'secondary' && styles.tabButtonSecondary,
      active && styles.tabButtonActive,
    ]}
  >
    <LinearGradient
      colors={
        active
          ? ['rgba(124, 92, 255, 0.4)', 'rgba(52, 34, 118, 0.65)']
          : ['rgba(20, 18, 48, 0.9)', 'rgba(12, 14, 32, 0.8)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tabGradient}
    >
      <Text
        style={[styles.tabButtonLabel, active && styles.tabButtonLabelActive]}
      >
        {label}
      </Text>
    </LinearGradient>
  </NeonPressable>
);

const styles = StyleSheet.create({
  heading: {
    color: designTokens.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: designTokens.spacing.sm,
  },
  subHeading: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: designTokens.spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
    gap: designTokens.spacing.sm,
  },
  tabRowSecondary: {
    flexDirection: 'row',
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.md,
  },
  tabButton: {
    flex: 1,
    borderRadius: designTokens.radii.lg,
    overflow: 'hidden',
  },
  tabButtonSecondary: {
    opacity: 0.9,
  },
  tabButtonActive: {
    borderWidth: 1,
    borderColor: designTokens.colors.borderStrong,
  },
  tabGradient: {
    paddingVertical: designTokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonLabel: {
    textAlign: 'center',
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  tabButtonLabelActive: {
    color: designTokens.colors.textPrimary,
  },
  scoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  scoreboardTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  scoreboardHint: {
    color: designTokens.colors.textSecondary,
    fontSize: 12,
  },
  scoreboardWrapper: {
    position: 'relative',
    borderRadius: designTokens.radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.6)',
    backgroundColor: 'rgba(9, 10, 32, 0.9)',
  },
  scoreboardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: neonPalette.glowCyan,
  },
  scoreboard: {
    maxHeight: 360,
  },
  scoreboardContent: {
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  entryGradient: {
    borderRadius: designTokens.radii.md,
  },
  entryGradientMe: {
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 213, 0.55)',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.radii.md,
    backgroundColor: 'rgba(15, 15, 40, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.5)',
  },
  entryRowMe: {
    backgroundColor: 'rgba(36, 20, 70, 0.85)',
  },
  entryRank: {
    width: 40,
    color: designTokens.colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  entryRankTop: {
    color: designTokens.colors.accentAmber,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    color: designTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  entryNameMe: {
    color: designTokens.colors.accentPink,
  },
  entryScore: {
    marginTop: designTokens.spacing.xs,
    color: designTokens.colors.textSecondary,
    fontSize: 12,
  },
  tagMe: {
    color: designTokens.colors.accentPink,
    fontSize: 12,
    fontWeight: '600',
  },
  rewardPanel: {
    marginTop: designTokens.spacing.xl,
    borderRadius: designTokens.radii.xl,
    padding: designTokens.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(66, 46, 132, 0.4)',
    backgroundColor: 'rgba(12, 14, 34, 0.9)',
    gap: designTokens.spacing.sm,
  },
  rewardTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: designTokens.spacing.md,
  },
  rewardLabel: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  rewardValue: {
    flex: 1,
    color: designTokens.colors.textPrimary,
    fontSize: 13,
    textAlign: 'right',
  },
  rewardDivider: {
    height: 1,
    backgroundColor: 'rgba(86, 64, 160, 0.35)',
  },
});
