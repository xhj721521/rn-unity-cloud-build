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
  secret: '命运秘矿榜：统计命运试炼塔 / 三重命运玩法产出的秘矿总量，按赛季累计排序。',
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
              <Text style={[styles.rankIndex, rankNumber <= 3 && styles.rankIndexTop3]}>
                NO.{rankNumber.toString().padStart(2, '0')}
              </Text>
              {showMedal ? (
                <View style={styles.medalBadge}>
                  <Text style={styles.medalText}>{medalLabels[rankNumber - 1]}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.rankName}>{record.name}</Text>
            <Text style={styles.rankSubtitle}>{record.score.toLocaleString()} 战报积分</Text>
            {record.inviteCount ? (
              <Text style={styles.rankSubtitleSecondary}>
                有效邀请 {record.inviteCount.toString().padStart(2, '0')} 人
              </Text>
            ) : null}
            {record.memberCount ? (
              <Text style={styles.rankSubtitleSecondary}>
                队员 {record.memberCount} 位 · 活跃 {record.activePoint}%
              </Text>
            ) : null}
            {record.secretOre ? (
              <Text style={styles.rankSubtitleSecondary}>
                秘矿 {record.secretOre.toLocaleString()} 单位
              </Text>
            ) : null}
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
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight ? tabBarHeight + 24 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.pageEyebrow}>命运追踪情报</Text>
          <Text style={styles.pageTitle}>战报中心</Text>
          <Text style={styles.pageSubtitle}>
            跟随命运塔、三重命运、矿场秘矿等玩法的实时战报数据，提取趋势洞察。
          </Text>
        </View>

        <View style={styles.tabRow}>
          {TYPE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, type === tab.key && styles.tabBtnActive]}
              onPress={() => {
                setType(tab.key);
                setCurrentPage(0);
                requestAnimationFrame(() => pagerRef.current?.scrollToIndex({ index: 0, animated: false }));
              }}
            >
              <Text style={[styles.tabText, type === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.tabDescription}>{RANK_DESCRIPTIONS[type]}</Text>

        <View style={styles.filterRow}>
          {RANGE_TABS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.filterBtn, range === item.key && styles.filterBtnActive]}
              onPress={() => setRange(item.key)}
            >
              <Text style={[styles.filterText, range === item.key && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.filterHint}>命运塔服务器 UTC+8 · 每日 05:00 更新日榜数据</Text>

        <View style={styles.myRankCard}>
          <Text style={styles.myRankTitle}>我的赛季战报</Text>
          <Text style={styles.myRankMain}>
            {myRank ? `当前排名 NO.${myRank.toString().padStart(2, '0')}` : '暂未上榜'}
          </Text>
          <Text style={styles.myRankMeta}>累计战报积分 2,480 · 提交 18 份战报材料</Text>
          <TouchableOpacity style={styles.scrollToMine} onPress={handleScrollToMyRank}>
            <Text style={styles.scrollToMineText}>定位我的排名</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={pagerRef}
          data={pages}
          keyExtractor={(_, index) => `${type}-${range}-${index}`}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPage(index);
          }}
        />

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, currentPage === index && styles.paginationDotActive]}
            />
          ))}
        </View>

        <View style={styles.seasonCard}>
          <Text style={styles.seasonTitle}>赛季奖励预告</Text>
          <Text style={styles.seasonDesc}>命运塔 S3 赛季 · 预计 12 月 15 日发放战利</Text>
          <View style={styles.seasonRewards}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>TOP 1-3</Text>
              <Text style={styles.rewardValue}>命运冠冕 + Arc 奖励 3000</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>TOP 4-10</Text>
              <Text style={styles.rewardValue}>Arc 奖励 1200 + 作战增益 7 日</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>TOP 11-20</Text>
              <Text style={styles.rewardValue}>Arc 奖励 600 + 队伍皮肤碎片</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  pageEyebrow: { color: 'rgba(111,198,255,0.95)', fontSize: 12, letterSpacing: 1 },
  pageTitle: { color: '#F9FAFB', fontSize: 24, fontWeight: '700', marginTop: 4 },
  pageSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 8 },
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
  scrollToMine: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  scrollToMineText: { color: '#7FFBFF', fontSize: 12 },
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
