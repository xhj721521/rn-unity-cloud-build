import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@state/hooks';
import { LeaderboardCategory, LeaderboardPeriod } from '@state/leaderboard/leaderboardSlice';
import MyRankBar from '@components/MyRankBar';
import RewardsChips from '@components/RewardsChips';
import RankCard, { RankCardItem } from '@components/RankCard';
import SkeletonCard from '@components/SkeletonCard';
import { buildMockItems, BoardType } from '@mock/leaderboard';
import { translate as t } from '@locale/strings';
import typography from '@theme/typography';

const H_PADDING = 16;
const GRID_GAP = 8;
const isTop3 = (rank?: number) => !!rank && rank >= 1 && rank <= 3;
const fonts = {
  title: typography.heading,
  meta: typography.captionCaps,
  body: typography.body,
};
const neonTitle = { textShadowColor: 'rgba(77,163,255,0.35)', textShadowRadius: 8 };

const CATEGORY_TABS: { key: LeaderboardCategory; labelKey: string; type: BoardType }[] = [
  { key: 'inviter', labelKey: 'lb.invite', type: 'invite' },
  { key: 'team', labelKey: 'lb.team', type: 'team' },
  { key: 'wealth', labelKey: 'lb.wealth', type: 'mining' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; labelKey: string }[] = [
  { key: 'daily', labelKey: 'lb.daily' },
  { key: 'weekly', labelKey: 'lb.weekly' },
  { key: 'monthly', labelKey: 'lb.monthly' },
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

const LeaderboardScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = useWindowDimensions();
  const leaderboard = useAppSelector((state) => state.leaderboard);

  const board = leaderboard?.data?.[category]?.[period];
  const type = CATEGORY_TABS.find((tab) => tab.key === category)?.type ?? 'invite';
  const categoryLabel = CATEGORY_TABS.find((tab) => tab.key === category)?.labelKey ?? 'lb.invite';
  const periodLabel = PERIOD_TABS.find((tab) => tab.key === period)?.labelKey ?? 'lb.daily';
  const cardWidth = (width - H_PADDING * 2 - GRID_GAP * 2) / 3;

  const items: RankCardItem[] = useMemo(() => {
    if (!board || !board.entries?.length) {
      return buildMockItems(type);
    }
    return board.entries.map((entry, idx) => mapEntryToRankItem(type, entry, idx));
  }, [board, type]);

  const pages = useMemo(() => {
    const chunkSize = 6;
    const res: RankCardItem[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      res.push(items.slice(i, i + chunkSize));
    }
    return res;
  }, [items]);

  const contentPadding = { paddingTop: 16, paddingBottom: tabBarHeight ? tabBarHeight + 96 : 120 };
  useEffect(() => {
    setCurrentPage(0);
  }, [category, period]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1020' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={contentPadding}>
        <View style={{ paddingHorizontal: H_PADDING, marginBottom: 12 }}>
          <Text style={[fonts.title, neonTitle, { fontSize: 22 }]}>{t('lb.title')}</Text>
          <Text style={styles.subtitle}>
            {category === 'inviter'
              ? t('lb.desc.invite')
              : category === 'team'
              ? t('lb.desc.team')
              : t('lb.desc.wealth')}
          </Text>
        </View>

        <View style={{ paddingHorizontal: H_PADDING, marginTop: 4 }}>
          <Animated.View entering={FadeInUp} style={styles.tabRow}>
            {CATEGORY_TABS.map((tab) => {
              const active = tab.key === category;
              return (
                <Text key={tab.key} style={[styles.tab, active && styles.tabActive]} onPress={() => setCategory(tab.key)}>
                  {t(tab.labelKey)}
                </Text>
              );
            })}
          </Animated.View>
        </View>

        <View style={{ paddingHorizontal: H_PADDING, marginTop: 8 }}>
          <Animated.View entering={FadeInUp.delay(50)} style={styles.segmentRow}>
            {PERIOD_TABS.map((tab) => {
              const active = tab.key === period;
              return (
                <Text key={tab.key} style={[styles.segment, active && styles.segmentActive]} onPress={() => setPeriod(tab.key)}>
                  {t(tab.labelKey)}
                </Text>
              );
            })}
          </Animated.View>
        </View>

        <View style={{ paddingHorizontal: H_PADDING, marginTop: 10 }}>
          <MyRankBar
            rank={board?.myRank?.rank}
            score={board?.myRank?.score}
            title={t('lb.my_rank')}
            diffLabel={board?.myRank?.rank ? t('lb.my.diff', { value: 59 }) : undefined}
            guideLabel={t('lb.cta.detail')}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.boardIndicator}>
            {t(categoryLabel)} · {t(periodLabel)}
          </Text>
          {pages.length > 0 ? (
            <>
              <FlatList
                data={pages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `page-${index}`}
                onMomentumScrollEnd={(e) => {
                  const page = Math.round(e.nativeEvent.contentOffset.x / width);
                  setCurrentPage(page);
                }}
                renderItem={({ item: pageItems }) => (
                  <View style={{ width }}>
                    <View style={{ paddingHorizontal: H_PADDING, paddingTop: 4 }}>
                      <View style={{ flexDirection: 'row', marginBottom: GRID_GAP }}>
                        {pageItems.slice(0, 3).map((item, idx) => (
                          <View key={item.id ?? `top-${idx}`} style={{ width: cardWidth, marginRight: idx < 2 ? GRID_GAP : 0 }}>
                            <RankCard type={type} item={item} width={cardWidth} enableTexture />
                          </View>
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        {pageItems.slice(3, 6).map((item, idx) => (
                          <View key={item.id ?? `bottom-${idx}`} style={{ width: cardWidth, marginRight: idx < 2 ? GRID_GAP : 0 }}>
                            <RankCard type={type} item={item} width={cardWidth} enableTexture />
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              />
              {pages.length > 1 && (
                <View style={styles.pagination}>
                  {pages.map((_, index) => {
                    const active = index === currentPage;
                    return <View key={index} style={[styles.pageDot, active && styles.pageDotActive]} />;
                  })}
                </View>
              )}
            </>
          ) : (
            <View style={{ marginTop: 32, alignItems: 'center' }}>
              <SkeletonCard width={cardWidth} />
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: H_PADDING, marginTop: 24 }}>
          <Text style={styles.rewardTitle}>
            {(() => {
              const text = t('lb.reward.title');
              return text === 'lb.reward.title' ? t('lb.my_rank') : text;
            })()}
          </Text>
          <View style={styles.rewardPanel}>
            <RewardsChips labels={[t('lb.reward.top1'), t('lb.reward.top2'), t('lb.reward.top3')]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    ...fonts.meta,
    marginTop: 6,
    opacity: 0.9,
  },
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
  boardIndicator: {
    ...fonts.meta,
    textAlign: 'center',
    opacity: 0.85,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    backgroundColor: 'rgba(77,163,255,0.3)',
  },
  pageDotActive: {
    width: 10,
    backgroundColor: '#4DA3FF',
  },
  rewardTitle: {
    ...fonts.meta,
    marginBottom: 8,
    opacity: 0.9,
  },
  rewardPanel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.25)',
    backgroundColor: 'rgba(8,15,32,0.92)',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default LeaderboardScreen;
