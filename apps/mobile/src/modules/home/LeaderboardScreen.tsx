import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@state/hooks';
import { useAccountSummary } from '@services/web3/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PAGE_SIZE = 9;

const CATEGORY_TABS: { key: LeaderboardCategory; label: string }[] = [
  { key: 'inviter', label: '命运邀约' },
  { key: 'team', label: '命运战队' },
  { key: 'wealth', label: '命运秘矿' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

const RANK_DESCRIPTIONS: Record<LeaderboardCategory, string> = {
  inviter: '命运邀约榜：按赛季累计邀请人数与有效贡献积分进行排名。',
  team: '命运战队榜：按赛季内战队总积分与团队活跃度进行排名。',
  wealth:
    '命运秘矿榜：只统计【命运试炼塔】与【三重命运】玩法中产出的「秘矿」总量，按赛季累计排序。',
};

const typeBadges: Record<LeaderboardCategory, string> = {
  inviter: '邀',
  team: '队',
  wealth: '矿',
};

const medalLabels = ['命运冠冕', '命运荣光', '命运星辉'];

const chunkEntries = (list: LeaderboardEntry[]): LeaderboardEntry[][] => {
  const pages: LeaderboardEntry[][] = [];
  for (let i = 0; i < list.length; i += PAGE_SIZE) {
    pages.push(list.slice(i, i + PAGE_SIZE));
  }
  return pages;
};

const formatScore = (score: number) => `${score.toLocaleString()} 积分`;

export const LeaderboardScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<FlatList<LeaderboardEntry[]> | null>(null);

  const leaderboard = useAppSelector((state) => state.leaderboard);
  const { data: account } = useAccountSummary();

  const board = leaderboard.data[category][period];
  const entries = useMemo(() => board.entries.slice(0, 24), [board.entries]);
  const pages = useMemo(() => chunkEntries(entries), [entries]);
  const myRank = board.myRank;

  const handleSelectCategory = (next: LeaderboardCategory) => {
    if (next === category) {
      return;
    }
    setCategory(next);
    setCurrentPage(0);
    requestAnimationFrame(() => pagerRef.current?.scrollToIndex({ index: 0, animated: false }));
  };

  const handleSelectPeriod = (next: LeaderboardPeriod) => {
    if (next === period) {
      return;
    }
    setPeriod(next);
    setCurrentPage(0);
    requestAnimationFrame(() => pagerRef.current?.scrollToIndex({ index: 0, animated: false }));
  };

  const handleScrollToMine = () => {
    if (!myRank) {
      return;
    }
    const targetIndex = entries.findIndex((entry) => entry.userId === myRank.userId);
    if (targetIndex < 0) {
      return;
    }
    const pageIndex = Math.floor(targetIndex / PAGE_SIZE);
    setCurrentPage(pageIndex);
    requestAnimationFrame(() => pagerRef.current?.scrollToIndex({ index: pageIndex, animated: true }));
  };

  const renderPage = ({ item, index }: { item: LeaderboardEntry[]; index: number }) => (
    <View style={styles.rankGridPage}>
      {item.map((entry, cardIdx) => {
        const absoluteIndex = index * PAGE_SIZE + cardIdx;
        const rankNumber = absoluteIndex + 1;
        const showMedal = rankNumber <= 3;
        const isMine = myRank && entry.userId === myRank.userId;

        return (
          <View
            key={entry.userId + rankNumber}
            style={[
              styles.rankCard,
              showMedal && styles.rankCardTop3,
              isMine && styles.rankCardHighlight,
            ]}
          >
            <View style={styles.rankCardHeader}>
              <Text style={[styles.rankIndex, showMedal && styles.rankIndexTop3]}>
                NO.{rankNumber.toString().padStart(2, '0')}
              </Text>
              {showMedal ? (
                <View style={styles.medalBadge}>
                  <Text style={styles.medalText}>{medalLabels[rankNumber - 1]}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.rankName} numberOfLines={1}>
              {entry.playerName}
            </Text>
            <Text style={styles.rankSubtitle}>{renderPrimaryInfo(category, entry)}</Text>
            <Text style={styles.rankSubtitleSecondary}>
              {renderSecondaryInfo(category, entry)}
            </Text>
            <View style={styles.rankTypeBadge}>
              <Text style={styles.rankTypeText}>{typeBadges[category]}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const rewards = leaderboard.rewards[category];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight ? tabBarHeight + 24 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>命运战报</Text>
            <Text style={styles.pageSubtitle}>
              命运邀约、战队、秘矿三大榜单实时更新，让你的命运矿场数据随时在线。
            </Text>
          </View>
          <TouchableOpacity style={styles.topButton} onPress={handleScrollToMine}>
            <Text style={styles.topButtonText}>回到我的排名</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {CATEGORY_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, category === tab.key && styles.tabBtnActive]}
              onPress={() => handleSelectCategory(tab.key)}
            >
              <Text style={[styles.tabText, category === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.tabDescription}>{RANK_DESCRIPTIONS[category]}</Text>

        <View style={styles.filterRow}>
          {PERIOD_TABS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterBtn, period === filter.key && styles.filterBtnActive]}
              onPress={() => handleSelectPeriod(filter.key)}
            >
              <Text style={[styles.filterText, period === filter.key && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.filterHint}>日榜按当天结算，周榜与月榜按赛季规则定期结算。</Text>

        <View style={styles.myRankCard}>
          <Text style={styles.myRankTitle}>我的排名</Text>
          {myRank ? (
            <>
              <Text style={styles.myRankMain}>
                当前第 {myRank.rank} 名 · {formatScore(myRank.score)}
              </Text>
              <Text style={styles.myRankMeta}>保持冲刺节奏，奖励宝藏正在等你领取。</Text>
            </>
          ) : (
            <>
              <Text style={styles.myRankMain}>当前暂未上榜</Text>
              <Text style={styles.myRankMeta}>完成更多命运任务，即可解锁上榜资格。</Text>
            </>
          )}
        </View>

        {pages.length > 0 ? (
          <FlatList
            ref={pagerRef}
            data={pages}
            keyExtractor={(_, index) => `rank-page-${index}`}
            renderItem={renderPage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const pageIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentPage(pageIndex);
            }}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暂时没有排行榜数据</Text>
          </View>
        )}

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.paginationDot, index === currentPage && styles.paginationDotActive]}
            />
          ))}
        </View>

        <View style={styles.seasonCard}>
          <Text style={styles.seasonTitle}>命运赛季奖励</Text>
          <Text style={styles.seasonDesc}>
            完成赛季任务即可逐级解锁 ARC、秘矿、NFT 等奖励。赛季积分越高，赛季末发放的命运 NFT
            级别越稀有。
          </Text>
          <View style={styles.seasonRewards}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>前三名</Text>
              <Text style={styles.rewardValue}>{rewards.top1To3}</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>第 4 - 10 名</Text>
              <Text style={styles.rewardValue}>{rewards.top4To10}</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>第 11 - 20 名</Text>
              <Text style={styles.rewardValue}>{rewards.top11To20}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderPrimaryInfo = (type: LeaderboardCategory, entry: LeaderboardEntry) => {
  switch (type) {
    case 'inviter':
      return `累计积分 ${entry.score.toLocaleString()}`;
    case 'team':
      return `战队总积分 ${entry.score.toLocaleString()}`;
    case 'wealth':
      return `秘矿总量 ${entry.score.toLocaleString()}`;
    default:
      return formatScore(entry.score);
  }
};

const renderSecondaryInfo = (type: LeaderboardCategory, entry: LeaderboardEntry) => {
  switch (type) {
    case 'inviter': {
      const invites = Math.max(1, Math.floor(entry.score / 60));
      return `累计邀请 ${invites} 人`;
    }
    case 'team': {
      const members = Math.max(10, 30 - entry.rank + 3);
      const active = Math.max(10, 100 - entry.rank * 2);
      return `成员 ${members} 人 · 活跃 ${active}`;
    }
    case 'wealth':
      return '试炼塔 + 三重命运产出';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  pageTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 4 },
  topButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.6)',
    alignSelf: 'flex-start',
  },
  topButtonText: { color: '#7FFBFF', fontSize: 12 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  tabBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
  },
  tabBtnActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.18)',
  },
  tabText: { color: 'rgba(148,163,184,0.85)', fontSize: 13 },
  tabTextActive: { color: '#F9FAFB', fontWeight: '600' },
  tabDescription: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  filterRow: { flexDirection: 'row', marginTop: 12 },
  filterBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
  },
  filterBtnActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.2)',
  },
  filterText: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  filterTextActive: { color: '#F9FAFB', fontWeight: '600' },
  filterHint: { color: 'rgba(148,163,184,0.8)', fontSize: 11, marginTop: 4 },
  myRankCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    backgroundColor: 'rgba(8,18,40,0.92)',
  },
  myRankTitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginBottom: 4 },
  myRankMain: { color: '#F9FAFB', fontSize: 16, fontWeight: '600' },
  myRankMeta: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 4 },
  rankGridPage: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rankCard: {
    width: (SCREEN_WIDTH - 16 * 2) / 3,
    height: 110,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(8,18,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.16)',
  },
  rankCardTop3: { borderColor: 'rgba(0,255,200,0.7)' },
  rankCardHighlight: { borderColor: '#38BDF8' },
  rankCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankIndex: { fontSize: 12, color: '#A8CFFF' },
  rankIndexTop3: { color: '#FFFFFF', fontWeight: '600' },
  medalBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,215,0,0.18)',
  },
  medalText: { fontSize: 10, color: '#FFD76A' },
  rankName: { fontSize: 14, color: '#FFFFFF', marginBottom: 2 },
  rankSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  rankSubtitleSecondary: { fontSize: 10, color: 'rgba(255,255,255,0.55)' },
  rankTypeBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.6)',
  },
  rankTypeText: { fontSize: 10, color: '#7FFBFF' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(148,163,184,0.4)',
  },
  paginationDotActive: { backgroundColor: '#7FFBFF' },
  seasonCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(14,24,54,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.28)',
    marginTop: 8,
  },
  seasonTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600', marginBottom: 6 },
  seasonDesc: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  seasonRewards: { marginTop: 12, gap: 8 },
  rewardChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(5,8,18,0.85)',
  },
  rewardLabel: { color: '#7FFBFF', fontSize: 12, marginBottom: 4 },
  rewardValue: { color: '#E5F2FF', fontSize: 13 },
  emptyState: {
    borderRadius: 18,
    padding: 24,
    backgroundColor: 'rgba(5,8,18,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    alignItems: 'center',
  },
  emptyText: { color: 'rgba(148,163,184,0.9)', fontSize: 13 },
});

export default LeaderboardScreen;
