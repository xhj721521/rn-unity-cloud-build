import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
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
import { neonPalette } from '@theme/neonPalette';
import { spacing } from '@theme/tokens';

const CATEGORY_TABS: { key: LeaderboardCategory; label: string }[] = [
  { key: 'inviter', label: '命运邀约' },
  { key: 'team', label: '命运战队' },
  { key: 'wealth', label: '命运财富' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

const PODIUM_ORDER = [2, 1, 3];

const PODIUM_GRADIENTS: Record<number, string[]> = {
  1: ['#FFE29F', '#FFA99F', '#FF719A'],
  2: ['#72E4FF', '#4A6DFF'],
  3: ['#FF9DEA', '#FF6D6D'],
};

const RANK_TONES = {
  top1: {
    accent: '#FFC861',
    stroke: 'rgba(255, 200, 97, 0.35)',
    avatar: ['rgba(255, 200, 152, 0.65)', 'rgba(255, 128, 164, 0.25)'],
  },
  top2: {
    accent: '#7DD3FC',
    stroke: 'rgba(125, 211, 252, 0.28)',
    avatar: ['rgba(194, 231, 255, 0.45)', 'rgba(120, 138, 255, 0.38)'],
  },
  top3: {
    accent: '#FACC15',
    stroke: 'rgba(250, 204, 21, 0.3)',
    avatar: ['rgba(255, 209, 163, 0.42)', 'rgba(255, 145, 116, 0.34)'],
  },
  default: {
    accent: '#9AA7FF',
    stroke: 'rgba(111, 128, 255, 0.28)',
    avatar: ['rgba(149, 136, 255, 0.32)', 'rgba(79, 53, 185, 0.34)'],
  },
};

type RankToneKey = keyof typeof RANK_TONES;

const getRankTone = (rank: number): RankToneKey => {
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

const formatScore = (value: number) => `${value.toLocaleString()} 积分`;

const getInitial = (name: string) => {
  const trimmed = name?.trim();
  if (!trimmed) {
    return '指';
  }
  return trimmed.slice(0, 1).toUpperCase();
};

const MedalBadge = ({ rank }: { rank: number }) => {
  const palette: Record<number, string> = {
    1: '#FFC95C',
    2: '#9DD9FF',
    3: '#FFAA8A',
  };
  const label: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };
  return (
    <View style={[styles.medalBadge, { borderColor: palette[rank] ?? '#9AA7FF' }]}>
      <Text style={[styles.medalLabel, { color: palette[rank] ?? neonPalette.accentViolet }]}>
        {label[rank] ?? '✦'}
      </Text>
    </View>
  );
};

type ChampionShowcaseProps = {
  entries: LeaderboardEntry[];
  accountName?: string;
};

const ChampionShowcase = ({ entries, accountName }: ChampionShowcaseProps) => {
  const pulse = useNeonPulse({ duration: 5200 });
  const podiumEntries = useMemo(
    () =>
      PODIUM_ORDER.map((rank) => entries.find((item) => item.rank === rank)).filter(
        (entry): entry is LeaderboardEntry => Boolean(entry),
      ),
    [entries],
  );

  if (podiumEntries.length === 0) {
    return null;
  }

  return (
    <View style={styles.podiumRow}>
      {podiumEntries.map((entry) => {
        const tone = RANK_TONES[getRankTone(entry.rank)];
        const glowScale = entry.rank === 1 ? 1.18 : 1.06;
        const isMine = entry.userId === 'pilot-zero' || entry.playerName === accountName;
        const cardAnimatedStyle = getPodiumCardAnimatedStyle({
          pulse,
          glowScale,
          accent: tone.accent,
          isChampion: entry.rank === 1,
        });
        const glowAnimatedStyle = getPodiumGlowStyle({
          pulse,
          accent: tone.accent,
        });
        return (
          <Animated.View
            key={entry.userId}
            style={[
              styles.podiumCard,
              entry.rank === 1 && styles.podiumCardChampion,
              cardAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={PODIUM_GRADIENTS[entry.rank] ?? ['#261E55', '#0E162D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.podiumGradient}
            >
              <Animated.View pointerEvents="none" style={[styles.podiumGlow, glowAnimatedStyle]} />
              <View style={styles.podiumHeader}>
                <MedalBadge rank={entry.rank} />
                <View style={[styles.rankPill, { borderColor: tone.accent }]}>
                  <Text style={[styles.rankPillText, { color: tone.accent }]}>{`NO.${String(
                    entry.rank,
                  ).padStart(2, '0')}`}</Text>
                </View>
              </View>
              <LinearGradient
                colors={tone.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.podiumAvatar, { borderColor: tone.accent }]}
              >
                <Text style={styles.podiumAvatarLabel}>{getInitial(entry.playerName)}</Text>
              </LinearGradient>
              <Text
                style={[styles.podiumName, isMine && styles.podiumNameHighlight]}
                numberOfLines={1}
              >
                {entry.playerName}
              </Text>
              <Text style={styles.podiumScore}>{formatScore(entry.score)}</Text>
            </LinearGradient>
          </Animated.View>
        );
      })}
    </View>
  );
};

const RewardCard = ({
  icon,
  title,
  description,
  gradient,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string[];
}) => (
  <LinearGradient
    colors={gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.rewardCard}
  >
    <View style={styles.rewardIconWrap}>
      <Text style={styles.rewardIcon}>{icon}</Text>
    </View>
    <View style={styles.rewardContent}>
      <Text style={styles.rewardTitle}>{title}</Text>
      <Text style={styles.rewardDescription}>{description}</Text>
    </View>
  </LinearGradient>
);

const MyRankCard = ({ summary }: { summary: string }) => (
  <LinearGradient
    colors={['rgba(25, 42, 88, 0.92)', 'rgba(14, 20, 44, 0.85)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.myRankCard}
  >
    <View style={styles.myRankBadge}>
      <Text style={styles.myRankLabel}>我的排名</Text>
    </View>
    <Text style={styles.myRankSummary}>{summary}</Text>
    <Text style={styles.myRankHint}>保持冲刺节奏，奖励宝藏正在等你领取。</Text>
  </LinearGradient>
);

const LeaderboardRow = ({ item, isMine }: { item: LeaderboardEntry; isMine: boolean }) => {
  const tone = RANK_TONES[getRankTone(item.rank)];
  return (
    <LinearGradient
      colors={['rgba(16, 20, 48, 0.92)', 'rgba(12, 16, 36, 0.9)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.rowCard, isMine && styles.rowCardActive]}
    >
      <View
        style={[styles.rowRankBadge, { borderColor: tone.accent, backgroundColor: tone.stroke }]}
      >
        <Text style={[styles.rowRankLabel, { color: tone.accent }]}>{item.rank}</Text>
      </View>
      <LinearGradient
        colors={tone.avatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rowAvatar}
      >
        <Text style={styles.rowAvatarLabel}>{getInitial(item.playerName)}</Text>
      </LinearGradient>
      <View style={styles.rowInfo}>
        <View style={styles.rowInfoHeader}>
          <Text style={[styles.rowName, isMine && styles.rowNameHighlight]} numberOfLines={1}>
            {item.playerName}
          </Text>
          {isMine && <Text style={styles.rowChip}>我的战绩</Text>}
        </View>
        <Text style={styles.rowScore}>{formatScore(item.score)}</Text>
      </View>
    </LinearGradient>
  );
};

const RewardShowcase = ({
  rewards,
}: {
  rewards: { top1To3: string; top4To10: string; top11To20: string };
}) => {
  const rewardItems = [
    {
      icon: '🗝️',
      title: '巅峰荣耀',
      description: rewards.top1To3,
      gradient: ['rgba(255, 181, 116, 0.36)', 'rgba(255, 87, 146, 0.28)'],
    },
    {
      icon: '💎',
      title: '进阶嘉奖',
      description: rewards.top4To10,
      gradient: ['rgba(132, 210, 255, 0.34)', 'rgba(92, 120, 255, 0.32)'],
    },
    {
      icon: '🎖️',
      title: '持续激励',
      description: rewards.top11To20,
      gradient: ['rgba(255, 149, 255, 0.32)', 'rgba(255, 199, 132, 0.28)'],
    },
  ];

  return (
    <View style={styles.rewardGrid}>
      {rewardItems.map((item) => (
        <RewardCard key={item.title} {...item} />
      ))}
    </View>
  );
};

const TabBar = <T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}) => (
  <View style={styles.tabSegment}>
    {tabs.map((tab) => {
      const isActive = tab.key === active;
      return (
        <Pressable
          key={tab.key}
          style={[styles.tabItem, isActive && styles.tabItemActive]}
          android_ripple={{ color: 'rgba(111, 204, 255, 0.16)' }}
          onPress={() => onChange(tab.key)}
        >
          <LinearGradient
            colors={
              isActive
                ? ['rgba(143, 92, 255, 0.85)', 'rgba(66, 225, 255, 0.76)']
                : ['rgba(10, 16, 40, 0.76)', 'rgba(8, 12, 30, 0.7)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tabGradient}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </LinearGradient>
        </Pressable>
      );
    })}
  </View>
);

type LeaderboardHeaderProps = {
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  onSelectCategory: (key: LeaderboardCategory) => void;
  onSelectPeriod: (key: LeaderboardPeriod) => void;
  onScrollToMine: () => void;
  mySummary: string;
  championEntries: LeaderboardEntry[];
  accountName?: string;
};

const LeaderboardHeader = ({
  category,
  period,
  onSelectCategory,
  onSelectPeriod,
  onScrollToMine,
  mySummary,
  championEntries,
  accountName,
}: LeaderboardHeaderProps) => (
  <View style={styles.headerBlock}>
    <View style={styles.headerRow}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>命运战报</Text>
        <Text style={styles.subtitle}>
          命运邀约、战队、财富三大榜单实时更新，让你的命运矿场数据随时在线。
        </Text>
      </View>
      <Pressable
        style={styles.jumpButton}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        onPress={onScrollToMine}
      >
        <LinearGradient
          colors={['rgba(66, 225, 255, 0.8)', 'rgba(143, 92, 255, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.jumpGradient}
        >
          <Text style={styles.jumpLabel}>回到我的排名</Text>
        </LinearGradient>
      </Pressable>
    </View>
    <TabBar tabs={CATEGORY_TABS} active={category} onChange={onSelectCategory} />
    <TabBar tabs={PERIOD_TABS} active={period} onChange={onSelectPeriod} />
    <MyRankCard summary={mySummary} />
    <ChampionShowcase entries={championEntries} accountName={accountName} />
    <View style={styles.listHeadingRow}>
      <Text style={styles.listTitle}>榜单明细</Text>
    </View>
  </View>
);

const RewardSection = ({
  rewards,
}: {
  rewards: { top1To3: string; top4To10: string; top11To20: string };
}) => (
  <View style={styles.rewardSection}>
    <Text style={styles.sectionTitle}>赛季奖励</Text>
    <RewardShowcase rewards={rewards} />
  </View>
);

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const listRef = useRef<FlatList<LeaderboardEntry>>(null);
  const leaderboard = useAppSelector((state) => state.leaderboard);
  const { data: account } = useAccountSummary();

  const board = leaderboard.data[category][period];
  const rewards = leaderboard.rewards[category];

  const mySummary = useMemo(() => {
    if (!board.myRank) {
      return '暂未上榜，继续冲刺挑战。';
    }
    const rankLabel = board.myRank.rank <= 20 ? `当前第 ${board.myRank.rank} 名` : '暂列 20 名之外';
    return `${rankLabel} ｜ ${formatScore(board.myRank.score)}`;
  }, [board.myRank]);

  const championEntries = useMemo(
    () => board.entries.filter((item) => item.rank <= 3),
    [board.entries],
  );

  const listEntries = useMemo(() => board.entries.filter((item) => item.rank > 3), [board.entries]);

  const renderItem = ({ item }: ListRenderItemInfo<LeaderboardEntry>) => (
    <LeaderboardRow
      item={item}
      isMine={item.userId === 'pilot-zero' || item.playerName === account?.displayName}
    />
  );

  const handleScrollToMine = () => {
    const mineIndex = listEntries.findIndex(
      (entry) => entry.userId === 'pilot-zero' || entry.playerName === account?.displayName,
    );
    if (mineIndex >= 0) {
      listRef.current?.scrollToIndex({ index: mineIndex, animated: true });
      return;
    }
    const mineInTop = championEntries.some(
      (entry) => entry.userId === 'pilot-zero' || entry.playerName === account?.displayName,
    );
    if (mineInTop) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleSelectCategory = (next: LeaderboardCategory) => {
    if (next === category) {
      return;
    }
    setCategory(next);
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  };

  const handleSelectPeriod = (next: LeaderboardPeriod) => {
    if (next === period) {
      return;
    }
    setPeriod(next);
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  };

  return (
    <ScreenContainer edgeVignette>
      <FlatList
        ref={listRef}
        data={listEntries}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={
          <LeaderboardHeader
            category={category}
            period={period}
            onSelectCategory={handleSelectCategory}
            onSelectPeriod={handleSelectPeriod}
            onScrollToMine={handleScrollToMine}
            mySummary={mySummary}
            championEntries={championEntries}
            accountName={account?.displayName}
          />
        }
        ListFooterComponent={<RewardSection rewards={rewards} />}
        contentContainerStyle={styles.listWrapper}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          requestAnimationFrame(() =>
            listRef.current?.scrollToIndex({ index: info.index, animated: true }),
          );
        }}
      />
    </ScreenContainer>
  );
};

type PodiumCardAnimatedInput = {
  pulse: Animated.Value;
  glowScale: number;
  accent: string;
  isChampion: boolean;
};

const getPodiumCardAnimatedStyle = ({
  pulse,
  glowScale,
  accent,
  isChampion,
}: PodiumCardAnimatedInput) => ({
  shadowColor: accent,
  shadowOpacity: isChampion ? 0.45 : 0.28,
  transform: [
    {
      scale: pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.98, glowScale],
      }),
    },
  ],
});

const getPodiumGlowStyle = ({ pulse, accent }: { pulse: Animated.Value; accent: string }) => ({
  backgroundColor: accent,
  opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.14, 0.32] }),
  transform: [
    {
      scale: pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1.05],
      }),
    },
  ],
});

function ListSeparator() {
  return <View style={styles.rowSeparator} />;
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingBottom: spacing.section * 2,
    gap: spacing.section,
  },
  headerBlock: {
    gap: spacing.section * 1.25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.section,
  },
  titleWrap: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: neonPalette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: 'rgba(226, 231, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  jumpButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  jumpGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  jumpLabel: {
    color: '#04010F',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  tabSegment: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  tabItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderColor: 'rgba(89, 92, 255, 0.22)',
  },
  tabItemActive: {
    borderColor: 'rgba(116, 205, 255, 0.65)',
    shadowColor: 'rgba(79, 120, 255, 0.55)',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  tabGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: neonPalette.textPrimary,
    textShadowColor: 'rgba(111, 204, 255, 0.65)',
    textShadowRadius: 12,
  },
  myRankCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(66, 225, 255, 0.25)',
    gap: 10,
  },
  myRankBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(66, 225, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(64, 205, 255, 0.16)',
  },
  myRankLabel: {
    color: '#60F2FF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  myRankSummary: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  myRankHint: {
    color: 'rgba(226, 231, 255, 0.68)',
    fontSize: 13,
  },
  podiumRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    alignItems: 'flex-end',
  },
  podiumCard: {
    flex: 1,
    borderRadius: 26,
    padding: 2,
    backgroundColor: 'rgba(59, 72, 140, 0.22)',
  },
  podiumCardChampion: {
    flex: 1.1,
    paddingBottom: 6,
  },
  podiumGradient: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    minHeight: 220,
  },
  podiumGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  podiumHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medalBadge: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(8, 12, 32, 0.48)',
  },
  medalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  rankPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(8, 12, 32, 0.38)',
  },
  rankPillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  podiumAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarLabel: {
    color: neonPalette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  podiumName: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  podiumNameHighlight: {
    color: '#FFE29F',
  },
  podiumScore: {
    color: 'rgba(226, 231, 255, 0.82)',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  listHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  rowSeparator: {
    height: spacing.cardGap,
  },
  rowCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardGap,
    borderWidth: 1,
    borderColor: 'rgba(56, 62, 120, 0.32)',
    backgroundColor: 'rgba(16, 18, 38, 0.76)',
    shadowColor: 'rgba(0, 0, 0, 0.55)',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 3,
  },
  rowCardActive: {
    borderColor: 'rgba(64, 205, 255, 0.65)',
    shadowColor: 'rgba(64, 205, 255, 0.45)',
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  rowRankBadge: {
    width: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(38, 54, 128, 0.35)',
  },
  rowRankLabel: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  rowAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarLabel: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    gap: 6,
  },
  rowInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowName: {
    color: neonPalette.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  rowNameHighlight: {
    color: '#5CFAFF',
  },
  rowChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(92, 250, 255, 0.4)',
    color: '#5CFAFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  rowScore: {
    color: '#9EAFFF',
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  rewardSection: {
    gap: 14,
  },
  sectionTitle: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  rewardGrid: {
    gap: spacing.cardGap,
  },
  rewardCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: spacing.cardGap,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(6, 10, 24, 0.65)',
  },
  rewardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIcon: {
    fontSize: 26,
  },
  rewardContent: {
    flex: 1,
    gap: 6,
  },
  rewardTitle: {
    color: neonPalette.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  rewardDescription: {
    color: 'rgba(226, 231, 255, 0.78)',
    fontSize: 13,
    lineHeight: 18,
  },
});
