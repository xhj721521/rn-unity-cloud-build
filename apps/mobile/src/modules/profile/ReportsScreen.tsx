import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PAGE_SIZE = 9;
const CURRENT_USER_ID = 'player-5';

type RankType = 'invite' | 'squad' | 'secret';

type RankRecord = {
  id: string;
  name: string;
  score: number;
  inviteCount?: number;
  memberCount?: number;
  activePoint?: number;
  secretOre?: number;
};

const RANK_DESCRIPTIONS: Record<RankType, string> = {
  invite: '命运邀约榜：按赛季累计邀请人数与有效贡献积分进行排名。',
  squad: '命运战队榜：按赛季内战队总积分与团队活跃度进行排名。',
  secret: '命运秘矿榜：只统计【命运试炼塔】与【三重命运】玩法中产出的「秘矿」总量，按赛季累计排序。',
};

const TYPE_TABS = [
  { key: 'invite', label: '命运邀约' },
  { key: 'squad', label: '命运战队' },
  { key: 'secret', label: '命运秘矿' },
] as const;

const RANGE_TABS = [
  { key: 'day', label: '日榜' },
  { key: 'week', label: '周榜' },
  { key: 'month', label: '月榜' },
] as const;

const mockRankData: Record<RankType, RankRecord[]> = {
  invite: Array.from({ length: 24 }).map((_, index) => ({
    id: index === 4 ? CURRENT_USER_ID : `invite-${index + 1}`,
    name: `征召者 ${index + 1}`,
    score: 1200 - index * 35,
    inviteCount: 50 - index,
  })),
  squad: Array.from({ length: 24 }).map((_, index) => ({
    id: index === 4 ? CURRENT_USER_ID : `squad-${index + 1}`,
    name: `战队 ${index + 1}`,
    score: 8200 - index * 40,
    memberCount: 30 - Math.floor(index / 2),
    activePoint: 95 - index,
  })),
  secret: Array.from({ length: 24 }).map((_, index) => ({
    id: index === 4 ? CURRENT_USER_ID : `secret-${index + 1}`,
    name: `秘矿者 ${index + 1}`,
    score: 4200 - index * 55,
    secretOre: 2600 - index * 80,
  })),
};

const medalLabels = ['命运冠冕', '命运荣光', '命运星辉'];
const typeBadge: Record<RankType, string> = {
  invite: '邀',
  squad: '队',
  secret: '矿',
};

const chunkPages = (data: RankRecord[]) => {
  const pages: RankRecord[][] = [];
  for (let i = 0; i < data.length; i += PAGE_SIZE) {
    pages.push(data.slice(i, i + PAGE_SIZE));
  }
  return pages;
};

export const ReportsScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [type, setType] = useState<RankType>('invite');
  const [range, setRange] = useState('day');
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<FlatList<RankRecord[]> | null>(null);

  const rankData = mockRankData[type];
  const pages = useMemo(() => chunkPages(rankData), [rankData]);
  const myRankIndex = rankData.findIndex((r) => r.id === CURRENT_USER_ID);
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : undefined;

  const handleScrollToMyRank = () => {
    if (myRankIndex < 0) {
      return;
    }
    const pageIndex = Math.floor(myRankIndex / PAGE_SIZE);
    setCurrentPage(pageIndex);
    pagerRef.current?.scrollToIndex({ index: pageIndex, animated: true });
  };

  const renderPage = ({ item, index }: { item: RankRecord[]; index: number }) => (
    <View style={styles.rankGridPage}>
      {item.map((record, cardIndex) => {
        const absoluteIndex = index * PAGE_SIZE + cardIndex;
        const rankNumber = absoluteIndex + 1;
        const showMedal = rankNumber <= 3;
        return (
          <View
            key={record.id}
            style={[
              styles.rankCard,
              showMedal && styles.rankCardTop3,
              record.id === CURRENT_USER_ID && styles.rankCardHighlight,
            ]}
          >
            <View style={styles.rankCardHeader}>
              <Text
                style={[
                  styles.rankIndex,
                  rankNumber <= 3 && styles.rankIndexTop3,
                ]}
              >
                NO.{rankNumber.toString().padStart(2, '0')}
              </Text>
              {showMedal ? (
                <View style={styles.medalBadge}>
                  <Text style={styles.medalText}>{medalLabels[rankNumber - 1]}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.rankName} numberOfLines={1}>
              {record.name}
            </Text>
            <Text style={styles.rankSubtitle}>{renderPrimaryInfo(type, record)}</Text>
            <Text style={styles.rankSubtitleSecondary}>{renderSecondaryInfo(type, record)}</Text>
            <View style={styles.rankTypeBadge}>
              <Text style={styles.rankTypeText}>{typeBadge[type]}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

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
          <TouchableOpacity style={styles.topButton} onPress={handleScrollToMyRank}>
            <Text style={styles.topButtonText}>回到我的排名</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {TYPE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, type === tab.key && styles.tabBtnActive]}
              onPress={() => {
                setType(tab.key);
                setCurrentPage(0);
                pagerRef.current?.scrollToIndex({ index: 0, animated: true });
              }}
            >
              <Text style={[styles.tabText, type === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.tabDescription}>{RANK_DESCRIPTIONS[type]}</Text>

        <View style={styles.filterRow}>
          {RANGE_TABS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterBtn, range === filter.key && styles.filterBtnActive]}
              onPress={() => setRange(filter.key)}
            >
              <Text style={[styles.filterText, range === filter.key && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.filterHint}>日榜按当天结算，周榜与月榜按赛季规则定期结算。</Text>

        <View style={styles.myRankCard}>
          <Text style={styles.myRankTitle}>我的排名</Text>
          {typeof myRank === 'number' ? (
            <>
              <Text style={styles.myRankMain}>当前第 {myRank} 名 · {rankData[myRank - 1].score} 积分</Text>
              <Text style={styles.myRankMeta}>保持冲刺节奏，奖励宝藏正在等你领取。</Text>
            </>
          ) : (
            <>
              <Text style={styles.myRankMain}>当前暂未上榜</Text>
              <Text style={styles.myRankMeta}>完成更多命运任务，即可解锁上榜资格。</Text>
            </>
          )}
        </View>

        <FlatList
          ref={pagerRef}
          data={pages}
          keyExtractor={(_, index) => `page-${index}`}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const pageIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPage(pageIndex);
          }}
        />

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.seasonCard}>
          <Text style={styles.seasonTitle}>命运赛季奖励</Text>
          <Text style={styles.seasonDesc}>
            完成赛季任务即可逐级解锁 ARC、秘矿、NFT 等奖励。赛季积分越高，赛季末发放的命运
            NFT 级别越稀有。
          </Text>
          <View style={styles.seasonRewards}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>钻石</Text>
              <Text style={styles.rewardValue}>命运冠冕 + 限定 NFT</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>黄金</Text>
              <Text style={styles.rewardValue}>荣耀称号 + 盲盒券</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>白银</Text>
              <Text style={styles.rewardValue}>额外矿石掉落 + ARC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderPrimaryInfo = (type: RankType, record: RankRecord) => {
  switch (type) {
    case 'invite':
      return `累计积分 ${record.score}`;
    case 'squad':
      return `战队总积分 ${record.score}`;
    case 'secret':
      return `秘矿总量 ${record.secretOre ?? record.score}`;
    default:
      return `${record.score}`;
  }
};

const renderSecondaryInfo = (type: RankType, record: RankRecord) => {
  switch (type) {
    case 'invite':
      return `累计邀请 ${record.inviteCount ?? 0} 人`;
    case 'squad':
      return `成员 ${record.memberCount ?? 0} 人 · 活跃 ${record.activePoint ?? 0}`;
    case 'secret':
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
    width: (SCREEN_WIDTH - 16 * 2 - 8 * 2) / 3,
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
});

export default ReportsScreen;
