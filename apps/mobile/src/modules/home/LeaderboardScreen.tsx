import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import GradientBorderCard from '@components/GradientBorderCard';
import Avatar from '@components/Avatar';
import { useAppSelector } from '@state/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 14;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const COLORS = {
  bg: '#0B1020',
  card: '#121A2C',
  stroke: '#1F2A44CC',
  textPri: '#EAF2FF',
  textSec: '#9FB1D1',
  textMeta: '#7E8AA6',
  primary: '#4DA3FF',
  gold: ['#FFD66B', '#FFE8A8'],
  silver: ['#C7D2FF', '#E2E7FF'],
  bronze: ['#B794F6', '#D8C2FF'],
  normal: ['#2A3C67', '#3D5B9A'],
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

const badgeMap: Record<LeaderboardCategory, string> = {
  inviter: '邀',
  team: '队',
  wealth: '矿',
};

const medalGradients = [COLORS.gold, COLORS.silver, COLORS.bronze];

const formatScore = (score: number) => `${score.toLocaleString()} 积分`;

const HeroCard = ({
  entry,
  rank,
  badge,
}: {
  entry: LeaderboardEntry;
  rank: number;
  badge: string;
}) => {
  const colors = medalGradients[rank - 1] ?? COLORS.normal;
  return (
    <Animated.View entering={FadeInDown.delay(rank * 60)} style={[styles.heroCard, rank === 1 ? styles.heroFirst : styles.heroOther]}>
      <GradientBorderCard colors={colors} radius={18} stroke={1}>
        <View style={styles.heroInner}>
          <View style={styles.heroHeader}>
            <Text style={[styles.heroNo, { color: colors[0] }]}>{`NO.${String(rank).padStart(2, '0')}`}</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{badge}</Text>
            </View>
          </View>
          <View style={styles.heroBody}>
            <Avatar name={entry.playerName} size={48} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.heroName} numberOfLines={1}>
                {entry.playerName}
              </Text>
              <Text style={styles.heroScore}>{formatScore(entry.score)}</Text>
            </View>
          </View>
        </View>
      </GradientBorderCard>
    </Animated.View>
  );
};

const RankCard = ({
  entry,
  rank,
  badge,
  variant,
}: {
  entry: LeaderboardEntry;
  rank: number;
  badge: string;
  variant: LeaderboardCategory;
}) => (
  <Animated.View entering={FadeIn.delay((rank % 6) * 30)} style={styles.rankCard}>
    <GradientBorderCard
      radius={16}
      stroke={1}
      colors={
        rank <= 3
          ? medalGradients[rank - 1]
          : COLORS.normal
      }
    >
      <View style={styles.rankCardInner}>
        <View style={styles.rankHeader}>
          <Text style={styles.rankIndex}>{`NO.${String(rank).padStart(2, '0')}`}</Text>
          <View style={styles.rankTag}>
            <Text style={styles.rankTagText}>{variant === 'inviter' ? '邀约指挥官' : variant === 'team' ? '命运战队' : '命运秘矿'}</Text>
          </View>
        </View>
        <View style={styles.rankMiddle}>
          <Avatar name={entry.playerName} size={42} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rankName} numberOfLines={1}>
              {entry.playerName}
            </Text>
            <Text style={styles.rankMeta} numberOfLines={1}>
              {badge}
            </Text>
          </View>
        </View>
        <View style={styles.rankBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rankPrimary}>{formatScore(entry.score)}</Text>
            <Text style={styles.rankSecondary}>实时积分</Text>
          </View>
          <TouchableOpacity style={styles.rankCta}>
            <Text style={styles.rankCtaText}>详</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBorderCard>
  </Animated.View>
);

export const LeaderboardScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [myExpanded, setMyExpanded] = useState(true);
  const leaderboard = useAppSelector((state) => state.leaderboard);
  const board = leaderboard.data[category][period];

  const entries = useMemo(() => board.entries.slice(0, 30), [board.entries]);
  const top3 = entries.slice(0, 3);
  const gridEntries = entries.slice(3);
  const myRank = board.myRank;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>命运战报</Text>
            <Text style={styles.pageSubtitle}>
              {CATEGORY_TABS.find((i) => i.key === category)?.desc ?? '命运榜单实时更新'}
            </Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setMyExpanded(true)}>
            <Text style={styles.headerBtnText}>回到我的排名</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={styles.tabRow} entering={FadeInUp}>
          {CATEGORY_TABS.map((tab) => {
            const active = category === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => {
                  setCategory(tab.key);
                  setMyExpanded(true);
                }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Animated.View style={styles.segmentRow} entering={FadeInUp.delay(50)}>
          {PERIOD_TABS.map((tab) => {
            const active = period === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setPeriod(tab.key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown}>
          <LinearGradient
            colors={['#4DA3FF', '#173056']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.myCard, !myExpanded && styles.myCardCollapsed]}
          >
            <View style={{ flex: 1, opacity: myExpanded ? 1 : 0.6 }}>
              <Text style={styles.myTitle}>我的排名</Text>
              <Text style={styles.myMain} numberOfLines={2}>
                {myRank ? `当前 NO.${String(myRank.rank).padStart(2, '0')} · ${formatScore(myRank.score)}` : '暂未上榜'}
              </Text>
              <Text style={styles.myMeta}>距离前一名还差 59 分</Text>
              <TouchableOpacity>
                <Text style={styles.myLink}>冲榜攻略</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.collapseBtn} onPress={() => setMyExpanded((v) => !v)}>
              <Text style={styles.collapseBtnText}>{myExpanded ? '收起' : '展开'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <View style={styles.heroRow}>
          {top3.map((entry, idx) => (
            <HeroCard key={entry.userId} entry={entry} rank={idx + 1} badge={badgeMap[category]} />
          ))}
        </View>

        <View style={styles.grid}>
          {gridEntries.map((entry, idx) => {
            const rankNumber = idx + 4;
            return (
              <RankCard
                key={entry.userId + rankNumber}
                entry={entry}
                rank={rankNumber}
                badge={badgeMap[category]}
                variant={category}
              />
            );
          })}
        </View>

        <View style={styles.rewardsCard}>
          <Text style={styles.rewardsTitle}>赛季奖励</Text>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(255,214,107,0.16)', color: COLORS.gold[0] }]}>
              TOP 1-3
            </Text>
            <Text style={styles.rewardText}>{leaderboard.rewards[category].top1To3}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(199,210,255,0.12)', color: COLORS.silver[0] }]}>
              TOP 4-10
            </Text>
            <Text style={styles.rewardText}>{leaderboard.rewards[category].top4To10}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Text style={[styles.rewardBadge, { backgroundColor: 'rgba(183,148,246,0.12)', color: COLORS.bronze[0] }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myCardCollapsed: { height: 64, paddingVertical: 10 },
  myTitle: { color: COLORS.textSec, fontSize: 12 },
  myMain: { color: COLORS.textPri, fontSize: 16, fontWeight: '700', marginTop: 4 },
  myMeta: { color: COLORS.textMeta, fontSize: 12, marginTop: 6 },
  myLink: { color: COLORS.primary, fontSize: 12, marginTop: 4, fontWeight: '600' },
  collapseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  collapseBtnText: { color: COLORS.textPri, fontSize: 12 },
  heroRow: { flexDirection: 'row', gap: 12 },
  heroCard: { flex: 1 },
  heroFirst: { flex: 1.2 },
  heroOther: { flex: 0.9 },
  heroInner: { padding: 12, backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden' },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroNo: { fontSize: 12, fontWeight: '700' },
  heroBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroBadgeText: { color: COLORS.textPri, fontSize: 10 },
  heroBody: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  heroName: { color: COLORS.textPri, fontSize: 15, fontWeight: '700' },
  heroScore: { color: COLORS.textSec, fontSize: 12, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  rankCard: { width: CARD_WIDTH },
  rankCardInner: {
    padding: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    minHeight: 170,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  rankHeader: { flexDirection: 'row', alignItems: 'center' },
  rankIndex: { color: COLORS.textSec, fontSize: 12, fontWeight: '700' },
  rankTag: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1A2440',
  },
  rankTagText: { color: COLORS.textMeta, fontSize: 12 },
  rankMiddle: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  rankName: { color: COLORS.textPri, fontSize: 15, fontWeight: '700' },
  rankMeta: { color: COLORS.textMeta, fontSize: 12, marginTop: 2 },
  rankBottom: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  rankPrimary: { color: COLORS.textPri, fontSize: 15, fontWeight: '700' },
  rankSecondary: { color: COLORS.textMeta, fontSize: 12, marginTop: 2 },
  rankCta: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#173056',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankCtaText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
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
