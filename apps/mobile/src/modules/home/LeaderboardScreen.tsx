import React, { useMemo, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { useAppSelector } from '@state/hooks';
import { useAccountSummary } from '@services/web3/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';
import { useNeonPulse } from '@theme/animations';

const CATEGORY_TABS: { key: LeaderboardCategory; label: string }[] = [
  { key: 'inviter', label: '邀请达人' },
  { key: 'team', label: '团队排行' },
  { key: 'wealth', label: '财富榜' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

const TOP_GRADIENTS = [
  ['rgba(255, 186, 90, 0.45)', 'rgba(227, 132, 255, 0.35)'],
  ['rgba(132, 210, 255, 0.34)', 'rgba(96, 120, 255, 0.38)'],
  ['rgba(255, 149, 149, 0.28)', 'rgba(255, 199, 132, 0.32)'],
];

const RANK_BADGE_COLORS = {
  top1: '#FFB86C',
  top2: '#7DD3FC',
  top3: '#FACC15',
  default: '#A07CFF',
};

const RANK_STYLE_MAP = {
  top1: {
    accent: '#FFB86C',
    badgeBackground: 'rgba(255, 184, 108, 0.18)',
    avatarGradient: ['rgba(255, 200, 136, 0.42)', 'rgba(236, 108, 255, 0.3)'],
  },
  top2: {
    accent: '#7DD3FC',
    badgeBackground: 'rgba(125, 211, 252, 0.18)',
    avatarGradient: ['rgba(168, 219, 255, 0.32)', 'rgba(106, 142, 255, 0.36)'],
  },
  top3: {
    accent: '#FACC15',
    badgeBackground: 'rgba(250, 204, 21, 0.18)',
    avatarGradient: ['rgba(252, 211, 116, 0.28)', 'rgba(255, 159, 118, 0.34)'],
  },
  default: {
    accent: '#A07CFF',
    badgeBackground: 'rgba(160, 124, 255, 0.16)',
    avatarGradient: ['rgba(155, 125, 255, 0.24)', 'rgba(58, 48, 130, 0.34)'],
  },
};

const getPeriodLabel = (key: LeaderboardPeriod) =>
  PERIOD_TABS.find((tab) => tab.key === key)?.label ?? '';

const getCategoryLabel = (key: LeaderboardCategory) =>
  CATEGORY_TABS.find((tab) => tab.key === key)?.label ?? '';

const formatScore = (score: number) => `${score.toLocaleString()} 积分`;

const getInitials = (name: string) => {
  if (!name) {
    return '指';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return '指';
  }
  return trimmed.slice(0, 1).toUpperCase();
};

const getRankTone = (rank: number) => {
  if (rank === 1) {
    return 'top1';
  }
  if (rank === 2) {
    return 'top2';
  }
  if (rank === 3) {
    return 'top3';
  }
  return 'default';
};

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const leaderboard = useAppSelector((state) => state.leaderboard);
  const { data: account } = useAccountSummary();

  const board = leaderboard.data[category][period];
  const rewards = leaderboard.rewards[category];

  const topThree = useMemo(() => board.entries.slice(0, 3), [board.entries]);
  const others = useMemo(() => board.entries.slice(3, 20), [board.entries]);

  const summaryLabel = useMemo(() => {
    if (!board.myRank) {
      return '暂未上榜，继续冲刺！';
    }
    const rankLabel = board.myRank.rank <= 20 ? `第 ${board.myRank.rank} 名` : '20 名以外';
    return `${rankLabel} ｜ ${formatScore(board.myRank.score)}`;
  }, [board]);

  return (
    <ScreenContainer scrollable>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>排行榜</Text>
          <Text style={styles.subHeading}>
            邀请达人、团队排行、财富榜三大榜单，支持日/周/月快速切换。
          </Text>
        </View>

        <View style={styles.tabGroup}>
          <View style={styles.tabRow}>
            {CATEGORY_TABS.map((tab) => {
              const active = tab.key === category;
              return (
                <Pressable
                  key={tab.key}
                  style={[styles.categoryTab, active && styles.categoryTabActive]}
                  android_ripple={{ color: 'rgba(124, 92, 255, 0.24)' }}
                  onPress={() => setCategory(tab.key)}
                >
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.periodRow}>
            {PERIOD_TABS.map((tab) => {
              const active = tab.key === period;
              return (
                <Pressable
                  key={tab.key}
                  style={[styles.periodTab, active && styles.periodTabActive]}
                  android_ripple={{ color: 'rgba(96, 165, 250, 0.24)' }}
                  onPress={() => setPeriod(tab.key)}
                >
                  <Text style={[styles.periodLabel, active && styles.periodLabelActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <LinearGradient
          colors={['rgba(40, 24, 72, 0.94)', 'rgba(18, 26, 52, 0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View>
            <Text style={styles.summaryTitle}>{getCategoryLabel(category)}</Text>
            <Text style={styles.summarySubtitle}>{getPeriodLabel(period)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatus}>
            <Text style={styles.summaryHint}>我的成绩</Text>
            <Text style={styles.summaryValue}>{summaryLabel}</Text>
          </View>
          {board.myRank?.playerName && (
            <Text style={styles.summaryPlayer}>指挥官：{board.myRank.playerName}</Text>
          )}
        </LinearGradient>

        {topThree.length > 0 && <TopThree entries={topThree} accountName={account?.displayName} />}

        <View style={styles.listSection}>
          {others.map((entry) => (
            <RankingRow
              key={entry.userId}
              entry={entry}
              highlight={entry.userId === 'pilot-zero' || account?.displayName === entry.playerName}
            />
          ))}
          {others.length === 0 && <Text style={styles.emptyText}>暂无更多记录</Text>}
        </View>

        <RewardPanel rewards={rewards} />
      </ScrollView>
    </ScreenContainer>
  );
};

type TopThreeProps = {
  entries: LeaderboardEntry[];
  accountName?: string;
};

const TopThree = ({ entries, accountName }: TopThreeProps) => {
  const pulse = useNeonPulse({ duration: 6200 });
  const ordered = useMemo(() => {
    if (entries.length < 3) {
      return entries;
    }
    return [entries[1], entries[0], entries[2]];
  }, [entries]);

  return (
    <View style={styles.topThreeRow}>
      {ordered.map((entry) => {
        const originalIndex = entries.findIndex((item) => item.userId === entry.userId);
        const medal = MEDALS[originalIndex] ?? '';
        const isCenter = originalIndex === 0;
        const isMe = entry.userId === 'pilot-zero' || entry.playerName === accountName;
        const gradient = TOP_GRADIENTS[originalIndex] ?? [
          'rgba(46, 44, 112, 0.52)',
          'rgba(16, 18, 52, 0.86)',
        ];
        const floatRange = isCenter ? 10 : 6;
        const tone = getRankTone(entry.rank);
        const accent =
          RANK_BADGE_COLORS[tone as keyof typeof RANK_BADGE_COLORS] ?? RANK_BADGE_COLORS.default;
        const floatStyle = {
          shadowColor: accent,
          shadowOpacity: isCenter ? 0.45 : 0.28,
          transform: [
            {
              translateY: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [floatRange * -1, floatRange],
              }),
            },
          ],
        };
        return (
          <Animated.View
            key={entry.userId}
            style={[styles.topCardContainer, isCenter && styles.topCardContainerCenter, floatStyle]}
          >
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.topCard, isCenter && styles.topCardCenter]}
            >
              <AnimatedGlow
                animated={pulse}
                style={styles.topCardGlow}
                intensity={isCenter ? 0.32 : 0.2}
              />
              <View style={styles.topBadgeRow}>
                <Text style={styles.topMedal}>{medal}</Text>
                <View style={[styles.topRankBadge, { borderColor: accent }]}>
                  <Text style={[styles.topRank, { color: accent }]}>{`NO.${String(
                    entry.rank,
                  ).padStart(2, '0')}`}</Text>
                </View>
              </View>
              <View style={[styles.topAvatar, { borderColor: accent }]}>
                <Text style={styles.topAvatarLabel}>{getInitials(entry.playerName)}</Text>
              </View>
              <Text style={[styles.topName, isMe && styles.topNameHighlight]} numberOfLines={1}>
                {entry.playerName}
              </Text>
              <Text style={styles.topScore}>{formatScore(entry.score)}</Text>
            </LinearGradient>
          </Animated.View>
        );
      })}
    </View>
  );
};

type AnimatedGlowProps = {
  animated: Animated.Value;
  style: StyleProp<ViewStyle>;
  intensity: number;
};

const AnimatedGlow = ({ animated, style, intensity }: AnimatedGlowProps) => (
  <Animated.View
    pointerEvents="none"
    style={[
      style,
      {
        opacity: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [intensity / 2, intensity],
        }),
        transform: [
          {
            scale: animated.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] }),
          },
        ],
      },
    ]}
  />
);

type RankingRowProps = {
  entry: LeaderboardEntry;
  highlight: boolean;
};

const RankingRow = ({ entry, highlight }: RankingRowProps) => {
  const tone = getRankTone(entry.rank) as keyof typeof RANK_STYLE_MAP;
  const rankStyle = RANK_STYLE_MAP[tone] ?? RANK_STYLE_MAP.default;
  const isTop = entry.rank <= 3;
  return (
    <View
      style={[
        styles.listRow,
        highlight && styles.listRowActive,
        isTop && styles.listRowTop,
        { borderColor: rankStyle.badgeBackground },
      ]}
    >
      <View
        style={[
          styles.listRankBadge,
          { borderColor: rankStyle.accent, backgroundColor: rankStyle.badgeBackground },
        ]}
      >
        <Text style={[styles.listRankText, { color: rankStyle.accent }]}>{entry.rank}</Text>
      </View>
      <LinearGradient
        colors={rankStyle.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.listAvatar}
      >
        <Text style={styles.listAvatarLabel}>{getInitials(entry.playerName)}</Text>
      </LinearGradient>
      <View style={styles.listInfo}>
        <View style={styles.listInfoHeader}>
          <Text style={[styles.listName, highlight && styles.listNameActive]} numberOfLines={1}>
            {entry.playerName}
          </Text>
          {highlight && <Text style={styles.listTag}>我的战绩</Text>}
        </View>
        <Text style={styles.listScore}>{formatScore(entry.score)}</Text>
      </View>
    </View>
  );
};

type RewardPanelProps = {
  rewards: {
    top1To3: string;
    top4To10: string;
    top11To20: string;
  };
};

const RewardPanel = ({ rewards }: RewardPanelProps) => {
  const rewardRanges = [
    { label: '1 - 3 名', value: rewards.top1To3, accent: '#FFB86C' },
    { label: '4 - 10 名', value: rewards.top4To10, accent: '#7DD3FC' },
    { label: '11 - 20 名', value: rewards.top11To20, accent: '#F472B6' },
  ];

  const parseItems = (text: string) => text.split('+').map((item) => item.trim());

  return (
    <LinearGradient
      colors={['rgba(32, 44, 88, 0.9)', 'rgba(20, 28, 60, 0.94)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.rewardPanel}
    >
      <Text style={styles.rewardTitle}>赛季奖励</Text>
      {rewardRanges.map((range, index) => (
        <View key={range.label}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardRange}>{range.label}</Text>
            <View style={[styles.rewardAccentDot, { backgroundColor: range.accent }]} />
          </View>
          <View style={styles.rewardItems}>
            {parseItems(range.value).map((item) => (
              <View key={item} style={styles.rewardItem}>
                <Text style={[styles.rewardBullet, { color: range.accent }]}>✦</Text>
                <Text style={styles.rewardText}>{item}</Text>
              </View>
            ))}
          </View>
          {index < rewardRanges.length - 1 && <View style={styles.rewardDivider} />}
        </View>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  heading: {
    color: '#F8FAFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subHeading: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  tabGroup: {
    gap: 12,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryTab: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(110, 116, 255, 0.32)',
    backgroundColor: 'rgba(18, 22, 44, 0.82)',
    paddingVertical: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryTabActive: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(124, 92, 255, 0.22)',
    shadowColor: 'rgba(124, 92, 255, 0.66)',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: '#F8FAFF',
    textShadowColor: 'rgba(139, 92, 246, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  periodTab: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(95, 205, 255, 0.26)',
    backgroundColor: 'rgba(16, 23, 48, 0.86)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  periodTabActive: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.24)',
    shadowColor: 'rgba(96, 165, 250, 0.6)',
    shadowOpacity: 0.26,
    shadowRadius: 10,
  },
  periodLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
    fontWeight: '600',
  },
  periodLabelActive: {
    color: '#F7FAFF',
  },
  summaryCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(138, 92, 255, 0.28)',
    backgroundColor: 'rgba(20, 24, 56, 0.9)',
    gap: 14,
  },
  summaryTitle: {
    color: '#F8FAFF',
    fontSize: 18,
    fontWeight: '700',
  },
  summarySubtitle: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 13,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryStatus: {
    gap: 6,
  },
  summaryHint: {
    color: 'rgba(226, 231, 255, 0.64)',
    fontSize: 12,
  },
  summaryValue: {
    color: '#F7FAFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryPlayer: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
  },
  topThreeRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  topCardContainer: {
    flex: 1,
    borderRadius: 26,
    padding: 2,
  },
  topCardContainerCenter: {
    flex: 1.2,
  },
  topCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  topCardCenter: {
    paddingVertical: 24,
  },
  topCardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 92, 255, 0.35)',
  },
  topBadgeRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMedal: {
    fontSize: 24,
  },
  topRank: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  topRankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  topAvatar: {
    width: 78,
    height: 78,
    borderRadius: 40,
    borderWidth: 1.4,
    backgroundColor: 'rgba(6, 8, 24, 0.6)',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAvatarLabel: {
    color: '#F8FAFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  topName: {
    marginTop: 14,
    color: '#F8FAFF',
    fontSize: 15,
    fontWeight: '700',
  },
  topNameHighlight: {
    color: '#FDE68A',
  },
  topScore: {
    marginTop: 8,
    color: 'rgba(226, 231, 255, 0.78)',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  listSection: {
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: 'rgba(12, 16, 38, 0.86)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  listRowTop: {
    backgroundColor: 'rgba(24, 22, 62, 0.92)',
    borderWidth: 1.2,
  },
  listRowActive: {
    borderColor: 'rgba(240, 196, 255, 0.48)',
    shadowColor: 'rgba(140, 92, 255, 0.6)',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 3,
  },
  listRankBadge: {
    width: 48,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  listRankText: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAvatarLabel: {
    color: '#F8FAFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  listInfo: {
    flex: 1,
    gap: 6,
  },
  listInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listName: {
    color: '#F8FAFF',
    fontSize: 15,
    fontWeight: '600',
  },
  listNameActive: {
    color: '#FDE68A',
  },
  listTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 204, 255, 0.18)',
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  listScore: {
    color: '#A5B4FF',
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  emptyText: {
    textAlign: 'center',
    color: 'rgba(226, 231, 255, 0.6)',
    fontSize: 12,
  },
  rewardPanel: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(103, 123, 255, 0.3)',
    gap: 10,
  },
  rewardTitle: {
    color: '#F8FAFF',
    fontSize: 16,
    fontWeight: '700',
  },
  rewardRange: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 13,
    fontWeight: '600',
    width: 76,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rewardAccentDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  rewardItems: {
    gap: 8,
    marginBottom: 14,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardBullet: {
    fontSize: 12,
  },
  rewardText: {
    flex: 1,
    color: '#F8FAFF',
    fontSize: 13,
    lineHeight: 20,
  },
  rewardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
