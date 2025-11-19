import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@state/hooks';
import { LeaderboardCategory, LeaderboardPeriod } from '@state/leaderboard/leaderboardSlice';
import MyRankBar from '@components/MyRankBar';
import RewardsChips from '@components/RewardsChips';
import RankCard, { RankCardItem } from '@components/RankCard';
import SkeletonCard from '@components/SkeletonCard';
import DoubleFrameCard from '@components/DoubleFrameCard';
import Avatar from '@components/Avatar';
import IconCrown from '@components/IconCrown';
import TechTexture from '@components/TechTexture';
import { buildMockItems, BoardType } from '@mock/leaderboard';
import { translate as t } from '@locale/strings';
import typography from '@theme/typography';

const { width } = Dimensions.get('window');
const GAP = 14;
const H_PADDING = 16;
const CARD_WIDTH = (width - H_PADDING * 2 - GAP) / 2;
const HERO_GAP = 12;
const HERO_CARD_WIDTH = (width - H_PADDING * 2 - HERO_GAP * 2) / 3;
const fmt = (value: number) => value.toLocaleString();
const isTop3 = (rank?: number) => !!rank && rank >= 1 && rank <= 3;
const fonts = {
  title: typography.heading,
  meta: typography.captionCaps,
  body: typography.body,
};
const neonTitle = { textShadowColor: 'rgba(77,163,255,0.35)', textShadowRadius: 8 };

const CATEGORY_TABS: { key: LeaderboardCategory; label: string; type: BoardType }[] = [
  { key: 'inviter', label: '命运邀约', type: 'invite' },
  { key: 'team', label: '命运战队', type: 'team' },
  { key: 'wealth', label: '命运秘矿', type: 'mining' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

const mapEntryToRankItem = (type: BoardType, entry: { rank: number; playerName: string; score: number }, index: number): RankCardItem => ({
  id: `${type}-${index}-${entry.playerName}`,
  rank: entry.rank ?? index + 1,
  nickname: entry.playerName,
  score: entry.score,
  avatarUrl: undefined,
  badge: isTop3(entry.rank) ? (entry.rank === 1 ? '命运冠冕' : entry.rank === 2 ? '命运荣光' : '命运星辉') : undefined,
  primaryValue: entry.score,
  secondaryValue: entry.rank,
});

const HeroCard = ({ item }: { item: RankCardItem }) => (
  <Animated.View entering={FadeInDown} style={{ width: HERO_CARD_WIDTH }}>
    <DoubleFrameCard rank={item.rank} width={HERO_CARD_WIDTH} height={150}>
      <TechTexture opacity={0.08} />
      <View style={styles.heroContent}>
        <View style={styles.heroHeader}>
          <Text style={[fonts.meta, styles.heroIndex]}>{`NO.${String(item.rank).padStart(2, '0')}`}</Text>
          <IconCrown size={18} />
        </View>
        <View style={styles.heroBody}>
          <Avatar name={item.nickname} size={48} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.heroName} numberOfLines={1}>
              {item.nickname}
            </Text>
            <Text style={styles.heroScore}>
              {fmt(item.score)} {t('lb.score')}
            </Text>
          </View>
        </View>
      </View>
    </DoubleFrameCard>
  </Animated.View>
);

const LeaderboardScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const leaderboard = useAppSelector((state) => state.leaderboard);

  const board = leaderboard?.data?.[category]?.[period];
  const type = CATEGORY_TABS.find((tab) => tab.key === category)?.type ?? 'invite';

  const items: RankCardItem[] = useMemo(() => {
    if (!board || !board.entries.length) {
      return buildMockItems(type);
    }
    return board.entries.map((entry, idx) => mapEntryToRankItem(type, entry, idx));
  }, [board, type]);
  const topThree = items.slice(0, 3);
  const rest = items.slice(3);

  const listPadding = { paddingBottom: tabBarHeight ? tabBarHeight + 96 : 120 };

  const renderRankCard = ({ item }: { item: RankCardItem }) => (
    <View style={{ width: CARD_WIDTH, marginBottom: GAP }}>
      <RankCard type={type} item={item} width={CARD_WIDTH} enableTexture />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1020' }}>
      <FlatList
        data={rest}
        renderItem={renderRankCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingTop: 16, ...listPadding }}
        columnWrapperStyle={{ paddingHorizontal: H_PADDING, gap: GAP }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: H_PADDING, gap: 12 }}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[fonts.title, neonTitle, { fontSize: 22 }]}>{t('lb.title')}</Text>
                <Text style={styles.subtitle}>
                  {category === 'inviter'
                    ? t('lb.desc.invite')
                    : category === 'team'
                    ? t('lb.desc.team')
                    : t('lb.desc.wealth')}
                </Text>
              </View>
            </View>

            <Animated.View entering={FadeInUp} style={styles.tabRow}>
              {CATEGORY_TABS.map((tab) => {
                const active = tab.key === category;
                return (
                  <Text
                    key={tab.key}
                    onPress={() => setCategory(tab.key)}
                    style={[styles.tab, active && styles.tabActive]}
                  >
                    {tab.key === 'inviter'
                      ? t('lb.invite')
                      : tab.key === 'team'
                      ? t('lb.team')
                      : t('lb.wealth')}
                  </Text>
                );
              })}
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(50)} style={styles.segmentRow}>
              {PERIOD_TABS.map((tab) => {
                const active = tab.key === period;
                return (
                  <Text
                    key={tab.key}
                    onPress={() => setPeriod(tab.key)}
                    style={[styles.segment, active && styles.segmentActive]}
                  >
                    {tab.key === 'daily'
                      ? t('lb.daily')
                      : tab.key === 'weekly'
                      ? t('lb.weekly')
                      : t('lb.monthly')}
                  </Text>
                );
              })}
            </Animated.View>

            <MyRankBar
              rank={board?.myRank?.rank}
              score={board?.myRank?.score}
              diff={board?.myRank?.rank ? 59 : undefined}
              title={t('lb.my_rank')}
              diffLabel={board?.myRank?.rank ? t('lb.my.diff', { value: 59 }) : undefined}
              guideLabel={t('lb.cta.detail')}
            />
            <RewardsChips
              labels={[t('lb.reward.top1'), t('lb.reward.top2'), t('lb.reward.top3')]}
            />

            <View style={styles.heroRow}>
              {topThree.map((item) => (
                <HeroCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: H_PADDING, marginTop: 40 }}>
            <SkeletonCard width={CARD_WIDTH} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  subtitle: { ...fonts.meta, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    textAlign: 'center',
    height: 38,
    lineHeight: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,42,68,0.8)',
    color: 'rgba(159,177,209,1)',
    fontSize: 13,
  },
  tabActive: {
    color: '#EAF2FF',
    borderColor: '#4DA3FF',
    backgroundColor: 'rgba(77,163,255,0.16)',
    fontWeight: '600',
  },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    textAlign: 'center',
    height: 32,
    lineHeight: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31,42,68,0.8)',
    color: '#7E8AA6',
    fontSize: 12,
  },
  segmentActive: {
    color: '#EAF2FF',
    borderColor: '#4DA3FF',
    backgroundColor: 'rgba(77,163,255,0.18)',
    fontWeight: '600',
  },
  heroRow: { flexDirection: 'row', gap: HERO_GAP },
  heroContent: { flex: 1, padding: 12 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroIndex: { fontWeight: '700' },
  heroBody: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  heroName: { ...fonts.body, fontSize: 16, fontWeight: '700' },
  heroScore: { ...fonts.meta, marginTop: 4 },
});

export default LeaderboardScreen;
