import React, { useMemo, useRef, useState } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph from '@components/QuickGlyph';
import { ScreenContainer } from '@components/ScreenContainer';
import { translate as t } from '@locale/strings';
import { useAppSelector } from '@state/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';
import { palette } from '@theme/colors';
import { shape, spacing } from '@theme/tokens';
import { typography } from '@theme/typography';

const ambientBg = require('../../assets/backgrounds/rank_ambient_bg_9x16.jpg');
const heroBg = require('../../assets/backgrounds/rank_hero_bg_9x16.jpg');

const CATEGORY_TABS: Array<{ key: LeaderboardCategory; label: string }> = [
  { key: 'inviter', label: t('rank.category.invite', undefined, '邀请达人') },
  { key: 'team', label: t('rank.category.team', undefined, '团队排行') },
  { key: 'wealth', label: t('rank.category.wealth', undefined, '财富榜') },
];

const PERIOD_TABS: Array<{ key: LeaderboardPeriod; label: string }> = [
  { key: 'daily', label: t('rank.period.day', undefined, '日榜') },
  { key: 'weekly', label: t('rank.period.week', undefined, '周榜') },
  { key: 'monthly', label: t('rank.period.month', undefined, '月榜') },
];

type ListItem =
  | { type: 'segments' }
  | { type: 'podium' }
  | { type: 'heading' }
  | { type: 'rank'; entry: LeaderboardEntry };

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ListItem>);

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<ListItem>>(null);

  const leaderboard = useAppSelector((state) => state.leaderboard.data);
  const rewards = useAppSelector((state) => state.leaderboard.rewards);

  const { entries, myRank } = leaderboard[category][period];

  const podiumEntries = useMemo(() => entries.filter((item) => item.rank <= 3), [entries]);
  const listEntries = useMemo(() => entries.filter((item) => item.rank > 3), [entries]);

  const listData = useMemo<ListItem[]>(() => {
    const base: ListItem[] = [{ type: 'segments' }];
    if (podiumEntries.length > 0) {
      base.push({ type: 'podium' });
    }
    base.push({ type: 'heading' });
    return [...base, ...listEntries.map((entry) => ({ type: 'rank', entry }))];
  }, [listEntries, podiumEntries]);

  const handleScrollToMine = () => {
    if (!myRank) {
      return;
    }
    if (myRank.rank <= 3) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      setHighlightedId(myRank.userId);
      setTimeout(() => setHighlightedId(null), 1200);
      return;
    }
    const targetIndex = listData.findIndex(
      (item) => item.type === 'rank' && item.entry.userId === myRank.userId,
    );
    if (targetIndex === -1) {
      return;
    }
    try {
      listRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.35,
      });
      setHighlightedId(myRank.userId);
      setTimeout(() => setHighlightedId(null), 1200);
    } catch (error) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
    switch (item.type) {
      case 'segments':
        return (
          <View style={styles.stickyWrapper}>
            <SegmentsBlock
              category={category}
              period={period}
              onCategoryChange={setCategory}
              onPeriodChange={setPeriod}
            />
          </View>
        );
      case 'podium':
        return <PodiumGrid entries={podiumEntries} />;
      case 'heading':
        return (
          <>
            <SectionHeading title={t('rank.list.title', undefined, '榜单明细')} />
            {listEntries.length === 0 && (
              <EmptyState message={t('rank.empty', undefined, '暂无上榜记录')} />
            )}
          </>
        );
      case 'rank':
        return (
          <RankRow
            entry={item.entry}
            highlight={item.entry.userId === highlightedId}
            isMine={item.entry.userId === myRank?.userId}
          />
        );
      default:
        return null;
    }
  };

  const keyExtractor = (item: ListItem, index: number) => {
    if (item.type === 'segments') {
      return 'segments';
    }
    if (item.type === 'podium') {
      return 'podium';
    }
    if (item.type === 'heading') {
      return 'heading';
    }
    return item.entry.userId ?? `rank-${index}`;
  };

  return (
    <ScreenContainer
      variant="plain"
      edgeVignette
      scrollable={false}
      background={<RankAmbientBackground scrollY={scrollY} />}
    >
      <AnimatedFlatList
        ref={listRef}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <PosterHero
            topEntry={podiumEntries[0]}
            myRank={myRank}
            onScrollToMine={handleScrollToMine}
          />
        }
        ListFooterComponent={<SeasonRewards rewards={rewards[category]} />}
        contentContainerStyle={styles.listContent}
        stickyHeaderIndices={[0]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const RankAmbientBackground = ({ scrollY }: { scrollY: Animated.Value }) => (
  <Animated.View style={StyleSheet.absoluteFill}>
    <Animated.Image
      source={ambientBg}
      style={[
        styles.ambientImage,
        { transform: [{ translateY: Animated.multiply(scrollY, 0.15) }] },
      ]}
      resizeMode="cover"
    />
    <View style={styles.ambientOverlay} />
  </Animated.View>
);

const PosterHero = ({
  topEntry,
  myRank,
  onScrollToMine,
}: {
  topEntry?: LeaderboardEntry;
  myRank: LeaderboardEntry | null;
  onScrollToMine: () => void;
}) => {
  const now = new Date();
  const updatedLabel = t(
    'rank.updated',
    { time: formatUpdatedAt(now) },
    `更新时间 ${formatUpdatedAt(now)}`,
  );
  return (
    <NeonCard
      backgroundSource={heroBg}
      overlayColor="rgba(4,6,18,0.65)"
      borderColors={[palette.primary, palette.accent]}
      glowColor="rgba(93, 240, 255, 0.35)"
      contentPadding={20}
      style={styles.heroCard}
    >
      <View style={styles.heroHeaderRow}>
        <View>
          <Text style={styles.heroEyebrow}>{t('rank.title', undefined, '排行榜')}</Text>
          <Text style={styles.heroTitle} numberOfLines={1}>
            {topEntry?.playerName ?? t('rank.empty', undefined, '暂无上榜记录')}
          </Text>
          <Text style={styles.heroSubtitle}>{updatedLabel}</Text>
        </View>
        <RipplePressable style={styles.myRankPill} onPress={onScrollToMine}>
          <QuickGlyph id="leaderboard" size={18} />
          <Text style={styles.myRankText} numberOfLines={1}>
            {myRank
              ? `${t('rank.backToMine', undefined, '回到我的排名')} · #${myRank.rank}`
              : t('rank.backToMine', undefined, '回到我的排名')}
          </Text>
        </RipplePressable>
      </View>
      <View style={styles.heroScoreRow}>
        <View style={styles.heroScoreBlock}>
          <Text style={styles.heroLabel}>{t('rank.podium.no1', undefined, 'NO.01')}</Text>
          <Text style={styles.heroScore}>{topEntry ? formatScore(topEntry.score) : '--'}</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroScoreBlock}>
          <Text style={styles.heroLabel}>{t('rank.my', undefined, '我的排名')}</Text>
          <Text style={styles.heroMyRank}>{myRank ? `#${myRank.rank}` : '--'}</Text>
          <Text style={styles.heroScore}>{myRank ? formatScore(myRank.score) : '--'}</Text>
        </View>
      </View>
    </NeonCard>
  );
};

const SegmentsBlock = ({
  category,
  period,
  onCategoryChange,
  onPeriodChange,
}: {
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  onCategoryChange: (value: LeaderboardCategory) => void;
  onPeriodChange: (value: LeaderboardPeriod) => void;
}) => (
  <View style={styles.segmentsContainer}>
    <SegmentedControl value={category} options={CATEGORY_TABS} onChange={onCategoryChange} />
    <SegmentedControl value={period} options={PERIOD_TABS} onChange={onPeriodChange} />
  </View>
);

const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ key: T; label: string }>;
  onChange: (value: T) => void;
}) => (
  <View style={styles.segmentedRow}>
    {options.map((option) => {
      const active = option.key === value;
      return (
        <RipplePressable
          key={option.key}
          style={[styles.segmentButton, active && styles.segmentButtonActive]}
          onPress={() => onChange(option.key)}
        >
          <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
            {option.label}
          </Text>
        </RipplePressable>
      );
    })}
  </View>
);

const PodiumGrid = ({ entries }: { entries: LeaderboardEntry[] }) => {
  if (!entries.length) {
    return null;
  }
  return (
    <View style={styles.podiumGrid}>
      {entries.map((entry) => (
        <PodiumCard key={entry.userId} entry={entry} />
      ))}
    </View>
  );
};

const PodiumCard = ({ entry }: { entry: LeaderboardEntry }) => {
  const tones = getTone(entry.rank);
  const labels: Record<number, string> = {
    1: t('rank.podium.no1', undefined, 'NO.01'),
    2: t('rank.podium.no2', undefined, 'NO.02'),
    3: t('rank.podium.no3', undefined, 'NO.03'),
  };
  return (
    <NeonCard
      overlayColor="rgba(8,12,30,0.55)"
      borderColors={tones.border}
      glowColor={tones.glow}
      contentPadding={18}
      style={[styles.podiumCard, entry.rank === 1 && styles.podiumCardChampion]}
    >
      <View style={styles.podiumHeader}>
        <View style={[styles.rankBadge, { borderColor: tones.accent }]}>
          <Text style={[styles.rankBadgeText, { color: tones.accent }]}>
            {labels[entry.rank] ?? `#${entry.rank}`}
          </Text>
        </View>
        <View style={[styles.rankAura, { backgroundColor: tones.aura }]} />
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>
        {entry.playerName}
      </Text>
      <Text style={styles.podiumScore}>{formatScore(entry.score)}</Text>
    </NeonCard>
  );
};

const RankRow = ({
  entry,
  highlight,
  isMine,
}: {
  entry: LeaderboardEntry;
  highlight: boolean;
  isMine: boolean;
}) => {
  const tones = getTone(entry.rank);
  return (
    <NeonCard
      overlayColor="rgba(5,8,18,0.7)"
      contentPadding={16}
      glowColor={highlight ? tones.glow : undefined}
      style={[styles.rankRow, highlight && styles.rankRowHighlight]}
    >
      <View style={styles.rankRowContent}>
        <View style={[styles.rankCircle, { borderColor: tones.accent }]}>
          <Text style={styles.rankCircleText}>{entry.rank}</Text>
        </View>
        <View style={styles.rankMeta}>
          <Text style={[styles.rankName, isMine && styles.rankNameActive]} numberOfLines={1}>
            {entry.playerName}
          </Text>
          <Text style={styles.rankDesc} numberOfLines={1}>
            {entry.userId}
          </Text>
        </View>
        <View style={styles.rankScoreBlock}>
          <Text style={styles.rankScore}>{formatScore(entry.score)}</Text>
          <Text style={styles.rankScoreHint}>{t('rank.points', undefined, '积分')}</Text>
        </View>
      </View>
    </NeonCard>
  );
};

const SeasonRewards = ({
  rewards,
}: {
  rewards: { top1To3: string; top4To10: string; top11To20: string };
}) => {
  const cards = [
    { key: 'top', title: t('rank.rewards.top', undefined, '巅峰荣耀'), body: rewards.top1To3 },
    { key: 'pro', title: t('rank.rewards.pro', undefined, '进阶嘉奖'), body: rewards.top4To10 },
    { key: 'keep', title: t('rank.rewards.keep', undefined, '持续激励'), body: rewards.top11To20 },
  ];
  return (
    <>
      <SectionHeading title={t('rank.rewards.section', undefined, '赛季奖励')} />
      <View style={styles.rewardGrid}>
        {cards.map((card, index) => (
          <NeonCard
            key={card.key}
            backgroundSource={heroBg}
            overlayColor={index === 0 ? 'rgba(10,18,40,0.65)' : 'rgba(6,10,22,0.7)'}
            contentPadding={18}
            glowColor="rgba(82,131,255,0.2)"
            style={styles.rewardCard}
          >
            <Text style={styles.rewardTitle}>{card.title}</Text>
            <Text style={styles.rewardBody}>{card.body}</Text>
          </NeonCard>
        ))}
      </View>
    </>
  );
};

const SectionHeading = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionAccent} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const getTone = (rank: number) => {
  if (rank === 1) {
    return {
      accent: '#FFC95C',
      border: ['#FFC95C', '#FF719A'] as [string, string],
      glow: '#FF9D66',
      aura: 'rgba(255,201,92,0.18)',
    };
  }
  if (rank === 2) {
    return {
      accent: '#7DD3FC',
      border: ['#7DD3FC', '#4A6DFF'] as [string, string],
      glow: '#7DD3FC',
      aura: 'rgba(125,211,252,0.14)',
    };
  }
  if (rank === 3) {
    return {
      accent: '#FF9DEA',
      border: ['#FF9DEA', '#FF6D6D'] as [string, string],
      glow: '#FF9DEA',
      aura: 'rgba(255,157,234,0.12)',
    };
  }
  return {
    accent: '#7F8CFF',
    border: ['#7F8CFF', '#5C6AFF'] as [string, string],
    glow: '#6E8BFF',
    aura: 'rgba(127,140,255,0.08)',
  };
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('zh-CN', { useGrouping: true }).format(value);

const formatUpdatedAt = (date: Date) =>
  date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.section * 2,
  },
  ambientImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  ambientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3,4,12,0.7)',
  },
  heroCard: {
    marginHorizontal: spacing.pageHorizontal,
    marginTop: spacing.section,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroEyebrow: {
    ...typography.captionCaps,
    color: palette.muted,
  },
  heroTitle: {
    ...typography.title,
    color: palette.text,
    marginTop: 6,
  },
  heroSubtitle: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
  myRankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: shape.capsuleRadius,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(6,10,18,0.4)',
  },
  myRankText: {
    ...typography.caption,
    color: palette.text,
  },
  heroScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  heroScoreBlock: {
    flex: 1,
  },
  heroLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  heroScore: {
    ...typography.numeric,
    color: palette.text,
    marginTop: 6,
  },
  heroMyRank: {
    ...typography.subtitle,
    color: palette.accent,
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 24,
  },
  segmentsContainer: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.cardGap,
    paddingBottom: spacing.cardGap / 2,
    backgroundColor: 'rgba(8,10,20,0.82)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  stickyWrapper: {
    backgroundColor: 'rgba(8,10,20,0.9)',
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: spacing.cardGap,
  },
  segmentButton: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(7,10,18,0.6)',
  },
  segmentButtonActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.15)',
  },
  segmentLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  segmentLabelActive: {
    color: palette.text,
  },
  podiumGrid: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    paddingHorizontal: spacing.pageHorizontal,
    marginTop: spacing.section,
  },
  podiumCard: {
    flex: 1,
  },
  podiumCardChampion: {
    transform: [{ translateY: -8 }],
  },
  podiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  rankBadgeText: {
    ...typography.captionCaps,
  },
  rankAura: {
    width: 34,
    height: 34,
    borderRadius: 17,
    opacity: 0.6,
  },
  podiumName: {
    ...typography.subtitle,
    color: palette.text,
    marginTop: 16,
  },
  podiumScore: {
    ...typography.numeric,
    color: palette.text,
    marginTop: 6,
  },
  rankRow: {
    marginHorizontal: spacing.pageHorizontal,
    marginBottom: spacing.cardGap,
  },
  rankRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankRowHighlight: {
    borderColor: palette.accent,
  },
  rankCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankCircleText: {
    ...typography.subtitle,
    color: palette.text,
  },
  rankMeta: {
    flex: 1,
  },
  rankName: {
    ...typography.subtitle,
    color: palette.text,
  },
  rankNameActive: {
    color: palette.primary,
  },
  rankDesc: {
    ...typography.captionCaps,
    color: palette.sub,
    marginTop: 2,
  },
  rankScoreBlock: {
    alignItems: 'flex-end',
  },
  rankScore: {
    ...typography.numeric,
    color: palette.text,
  },
  rankScoreHint: {
    ...typography.captionCaps,
    color: palette.sub,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.pageHorizontal,
    marginTop: spacing.section,
    marginBottom: spacing.cardGap / 2,
    gap: 10,
  },
  sectionAccent: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.primary,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  rewardGrid: {
    flexDirection: 'column',
    gap: spacing.cardGap,
    paddingHorizontal: spacing.pageHorizontal,
    marginTop: spacing.cardGap,
  },
  rewardCard: {
    minHeight: 110,
  },
  rewardTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  rewardBody: {
    ...typography.body,
    color: palette.sub,
    marginTop: 6,
  },
  emptyState: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: spacing.cardGap,
  },
  emptyText: {
    ...typography.caption,
    color: palette.sub,
    textAlign: 'center',
  },
});
