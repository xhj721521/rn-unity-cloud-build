import React, { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { useAppSelector } from '@state/hooks';
import { useAccountSummary } from '@services/web3/hooks';
import {
  LeaderboardCategory,
  LeaderboardPeriod,
  LeaderboardEntry,
} from '@state/leaderboard/leaderboardSlice';
import { neonPalette } from '@theme/neonPalette';
import { useNeonPulse } from '@theme/animations';

const CATEGORY_TABS: { key: LeaderboardCategory; label: string }[] = [
  { key: 'inviter', label: '\u9080\u8BF7\u8FBE\u4EBA' },
  { key: 'team', label: '\u56E2\u961F\u5EFA\u8BBE' },
  { key: 'wealth', label: '\u8D22\u5BCC\u6392\u884C' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '\u65E5\u699C' },
  { key: 'weekly', label: '\u5468\u699C' },
  { key: 'monthly', label: '\u6708\u699C' },
];

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const leaderboard = useAppSelector((state) => state.leaderboard);
  const { data: account } = useAccountSummary();
  const currentBoard = leaderboard.data[category][period];
  const rewards = leaderboard.rewards[category];
  const scoreboardPulse = useNeonPulse({ duration: 6800 });

  const myRankingLabel = useMemo(() => {
    if (!currentBoard.myRank) {
      return '\u6682\u65E0\u6392\u540D';
    }
    const rankText = currentBoard.myRank.rank <= 10 ? currentBoard.myRank.rank : '10+';
    return `\u5F53\u524D\u6392\u540D\uFF1A${rankText} \u540D \u00B7 \u5F97\u5206 ${currentBoard.myRank.score}`;
  }, [currentBoard.myRank]);

  const renderEntry = (entry: LeaderboardEntry) => {
    const isMe = entry.userId === 'pilot-zero' || account?.displayName === entry.playerName;
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
          <Text style={[styles.entryRank, isTop3 && styles.entryRankTop]}>{entry.rank}</Text>
          <View style={styles.entryInfo}>
            <Text style={[styles.entryName, isMe && styles.entryNameMe]}>{entry.playerName}</Text>
            <Text style={styles.entryScore}>{entry.score}</Text>
          </View>
          {isMe ? <Text style={styles.tagMe}>\u6211\u7684</Text> : null}
        </View>
      </LinearGradient>
    );
  };

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>\u6392\u884C\u699C</Text>
      <Text style={styles.subHeading}>
        \u9080\u8BF7\u8FBE\u4EBA\u3001\u56E2\u961F\u5EFA\u8BBE\u3001\u8D22\u5BCC\u6392\u884C\u4E09\u5927\u699C\u5355\uFF0C\u652F\u6301\u65E5\u699C\u3001\u5468\u699C\u3001\u6708\u699C\u5207\u6362\u3002
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
            secondary
          />
        ))}
      </View>

      <InfoCard
        title={`${CATEGORY_TABS.find((t) => t.key === category)?.label ?? ''} \u00B7 ${
          PERIOD_TABS.find((t) => t.key === period)?.label ?? ''
        }`}
      >
        <View style={styles.scoreboardHeader}>
          <Text style={styles.scoreboardTitle}>{myRankingLabel}</Text>
          <Text style={styles.scoreboardHint}>\u663E\u793A\u524D 10 \u540D</Text>
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
          <ScrollView style={styles.scoreboard} contentContainerStyle={styles.scoreboardContent}>
            {currentBoard.entries.map(renderEntry)}
          </ScrollView>
        </View>
      </InfoCard>

      {period === 'monthly' ? (
        <InfoCard title="\u6708\u699C\u5956\u52B1">
          <View style={styles.rewardRow}>
            <Text style={styles.rewardLabel}>\u7B2C 1 - 3 \u540D</Text>
            <Text style={styles.rewardValue}>{rewards.top1To3}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardLabel}>\u7B2C 4 - 10 \u540D</Text>
            <Text style={styles.rewardValue}>{rewards.top4To10}</Text>
          </View>
        </InfoCard>
      ) : null}
    </ScreenContainer>
  );
};

const TabButton = ({
  label,
  active,
  onPress,
  secondary,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  secondary?: boolean;
}) => {
  const pulse = useNeonPulse({ duration: secondary ? 5200 : 4600 });

  const glowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.22, 0.5],
    }),
  };

  const colors = active
    ? secondary
      ? ['rgba(77, 59, 255, 0.85)', 'rgba(36, 25, 95, 0.95)']
      : ['rgba(124, 92, 255, 0.9)', 'rgba(45, 24, 104, 0.95)']
    : ['rgba(16, 16, 44, 0.92)', 'rgba(16, 16, 44, 0.9)'];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        secondary ? styles.tabButtonSecondary : styles.tabButtonPrimary,
        active ? styles.tabButtonActive : null,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabGradient}
      >
        {active ? <Animated.View pointerEvents="none" style={[styles.tabGlow, glowStyle]} /> : null}
        <Text style={[styles.tabButtonLabel, active && styles.tabButtonLabelActive]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: neonPalette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  subHeading: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  tabRowSecondary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.6)',
  },
  tabButtonPrimary: {
    backgroundColor: 'rgba(11, 11, 32, 0.92)',
  },
  tabButtonSecondary: {
    backgroundColor: 'rgba(14, 14, 40, 0.88)',
  },
  tabButtonActive: {
    borderColor: 'rgba(124, 92, 255, 0.6)',
  },
  tabGradient: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: neonPalette.glowPurple,
  },
  tabButtonLabel: {
    textAlign: 'center',
    color: neonPalette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabButtonLabelActive: {
    color: neonPalette.textPrimary,
  },
  scoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreboardTitle: {
    color: neonPalette.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  scoreboardHint: {
    color: neonPalette.textSecondary,
    fontSize: 12,
  },
  scoreboardWrapper: {
    position: 'relative',
    borderRadius: 18,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 8,
  },
  entryGradient: {
    borderRadius: 14,
  },
  entryGradientMe: {
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 213, 0.55)',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 15, 40, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.5)',
  },
  entryRowMe: {
    backgroundColor: 'rgba(36, 20, 70, 0.85)',
  },
  entryRank: {
    width: 36,
    color: neonPalette.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  entryRankTop: {
    color: neonPalette.accentAmber,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    color: neonPalette.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  entryNameMe: {
    color: neonPalette.accentMagenta,
  },
  entryScore: {
    marginTop: 4,
    color: neonPalette.textSecondary,
    fontSize: 12,
  },
  tagMe: {
    color: neonPalette.accentMagenta,
    fontSize: 12,
    fontWeight: '600',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rewardLabel: {
    color: neonPalette.textSecondary,
    fontSize: 13,
  },
  rewardValue: {
    color: neonPalette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 12,
    textAlign: 'right',
  },
});
