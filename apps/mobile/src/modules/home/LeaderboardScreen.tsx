import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@state/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

const COLORS = {
  bg: '#0B1020',
  card: '#121A2C',
  stroke: '#1F2A44',
  textPri: '#EAF2FF',
  textSec: '#9FB1D1',
  textMeta: '#7E8AA6',
  primary: '#4DA3FF',
  success: '#4EE29B',
  gold: '#FFD66B',
  silver: '#C7D2FF',
  bronze: '#B794F6',
};

const CATEGORY_TABS: { key: LeaderboardCategory; label: string; desc: string }[] = [
  { key: 'inviter', label: '命运邀约', desc: '按赛季累计邀请人数与贡献积分排名' },
  { key: 'team', label: '命运战队', desc: '赛季内战队总积分与活跃度排名' },
  { key: 'wealth', label: '命运秘矿', desc: '试炼塔/三重命运秘矿产出累计排名' },
];

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: '日榜' },
  { key: 'weekly', label: '周榜' },
  { key: 'monthly', label: '月榜' },
];

const medalStyle = [
  { color: COLORS.gold, text: 'NO.01' },
  { color: COLORS.silver, text: 'NO.02' },
  { color: COLORS.bronze, text: 'NO.03' },
];

const typeBadges: Record<LeaderboardCategory, string> = {
  inviter: '邀',
  team: '队',
  wealth: '矿',
};

const formatScore = (score: number) => `${score.toLocaleString()} 积分`;

export const LeaderboardScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [myCardExpanded, setMyCardExpanded] = useState(true);

  const leaderboard = useAppSelector((state) => state.leaderboard);
  const board = leaderboard.data[category][period];
  const entries = useMemo(() => board.entries.slice(0, 30), [board.entries]);
  const top3 = entries.slice(0, 3);
  const gridEntries = entries.slice(3);
  const myRank = board.myRank;

  const filterDesc =
    CATEGORY_TABS.find((c) => c.key === category)?.desc ?? '命运榜单实时更新';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>排行榜</Text>
            <Text style={styles.pageSubtitle}>{filterDesc}</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setMyCardExpanded(true)}>
            <Text style={styles.headerBtnText}>回到我的排名</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {CATEGORY_TABS.map((tab) => {
            const active = category === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setCategory(tab.key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.segmentRow}>
          {PERIOD_TABS.map((tab) => {
            const active = period === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setPeriod(tab.key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {myRank ? (
          <TouchableOpacity
            style={[styles.myCard, myCardExpanded ? styles.myCardExpanded : styles.myCardCollapsed]}
            activeOpacity={0.9}
            onPress={() => setMyCardExpanded((v) => !v)}
          >
            <Text style={styles.myTitle}>我的排名</Text>
            <Text style={styles.myMain} numberOfLines={myCardExpanded ? 2 : 1}>
              当前 NO.{myRank.rank.toString().padStart(2, '0')} · {formatScore(myRank.score)}
            </Text>
            {myCardExpanded ? (
              <Text style={styles.myMeta}>距离前一名还差 {(myRank.score * 0.06).toFixed(0)} 积分</Text>
            ) : null}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, myRank.rank * 4)}%` }]} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.myCard, styles.myCardExpanded]}>
            <Text style={styles.myTitle}>我的排名</Text>
            <Text style={styles.myMain}>暂未上榜，快去冲刺吧</Text>
          </View>
        )}

        <View style={styles.podiumSection}>
          {top3.map((entry, idx) => (
            <View
              key={entry.userId}
              style={[
                styles.podiumCard,
                idx === 0 ? styles.podiumFirst : styles.podiumOthers,
                { borderColor: medalStyle[idx].color },
              ]}
            >
              <View style={styles.podiumHeader}>
                <Text style={[styles.podiumNo, { color: medalStyle[idx].color }]}>
                  {medalStyle[idx].text}
                </Text>
                <View style={styles.podiumBadge}>
                  <Text style={styles.podiumBadgeText}>{typeBadges[category]}</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {entry.playerName}
              </Text>
              <Text style={styles.podiumScore}>{formatScore(entry.score)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {gridEntries.map((entry, idx) => {
            const rankNumber = idx + 4;
            return (
              <View key={entry.userId + rankNumber} style={styles.rankCard}>
                <View style={styles.rankCardHeader}>
                  <Text style={styles.rankIndex}>NO.{rankNumber.toString().padStart(2, '0')}</Text>
                  <View style={styles.rankTag}>
                    <Text style={styles.rankTagText}>{typeBadges[category]}</Text>
                  </View>
                </View>
                <Text style={styles.rankName} numberOfLines={1}>
                  {entry.playerName}
                </Text>
                <Text style={styles.rankScore}>{formatScore(entry.score)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.rewardsCard}>
          <Text style={styles.rewardsTitle}>赛季奖励</Text>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(255,214,107,0.16)', color: COLORS.gold }]}>
              TOP 1-3
            </Text>
            <Text style={styles.rewardText}>{leaderboard.rewards[category].top1To3}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(199,210,255,0.12)', color: COLORS.silver }]}>
              TOP 4-10
            </Text>
            <Text style={styles.rewardText}>{leaderboard.rewards[category].top4To10}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(183,148,246,0.12)', color: COLORS.bronze }]}>
              TOP 11-20
            </Text>
            <Text style={styles.rewardText}>{leaderboard.rewards[category].top11To20}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: GRID_PADDING, paddingTop: 16, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  pageTitle: { color: COLORS.textPri, fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: COLORS.textSec, fontSize: 12, marginTop: 4 },
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(77,163,255,0.12)',
  },
  headerBtnText: { color: COLORS.textPri, fontSize: 12 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: '#1A2E52', borderColor: 'rgba(77,163,255,0.6)' },
  tabText: { color: COLORS.textSec, fontSize: 13 },
  tabTextActive: { color: COLORS.textPri, fontWeight: '600' },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(77,163,255,0.16)' },
  segmentText: { color: COLORS.textSec, fontSize: 12 },
  segmentTextActive: { color: COLORS.textPri, fontWeight: '600' },
  myCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  myCardExpanded: { height: 112 },
  myCardCollapsed: { height: 64, justifyContent: 'center' },
  myTitle: { color: COLORS.textSec, fontSize: 12, marginBottom: 4 },
  myMain: { color: COLORS.textPri, fontSize: 16, fontWeight: '700' },
  myMeta: { color: COLORS.textMeta, fontSize: 12, marginTop: 6 },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: COLORS.primary },
  podiumSection: { flexDirection: 'row', gap: 12 },
  podiumCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: COLORS.card,
  },
  podiumFirst: { flex: 1.2 },
  podiumOthers: { flex: 0.9 },
  podiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  podiumNo: { fontSize: 12, fontWeight: '700' },
  podiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  podiumBadgeText: { color: COLORS.textPri, fontSize: 10 },
  podiumName: { color: COLORS.textPri, fontSize: 15, fontWeight: '700', marginTop: 8 },
  podiumScore: { color: COLORS.textSec, fontSize: 12, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginTop: 4,
  },
  rankCard: {
    width: CARD_WIDTH,
    height: 118,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    padding: 10,
    backgroundColor: COLORS.card,
  },
  rankCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankIndex: { color: COLORS.textSec, fontSize: 11 },
  rankTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.4)',
  },
  rankTagText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  rankName: { color: COLORS.textPri, fontSize: 13, fontWeight: '600', marginTop: 8 },
  rankScore: { color: COLORS.textSec, fontSize: 12, marginTop: 4 },
  rewardsCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    gap: 10,
  },
  rewardsTitle: { color: COLORS.textPri, fontSize: 15, fontWeight: '700' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rewardBadge: {
    minWidth: 72,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '700',
  },
  rewardText: { color: COLORS.textSec, fontSize: 12, flex: 1 },
});

export default LeaderboardScreen;
