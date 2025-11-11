import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import KpiCard from '@components/invite/KpiCard';
import RewardProgress from '@components/invite/RewardProgress';
import GlassCard from '@components/shared/GlassCard';
import { FilterBar, InviteFilterTab } from '@components/invite/FilterBar';
import { Invitee, InviteeItem } from '@components/invite/InviteeItem';
import NeonButton from '@components/NeonButton';
import statsData from '@mock/invite.stats.json';
import membersData from '@mock/invite.members.json';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@app/navigation/types';

type InviteStats = {
  totalInvites: number;
  weeklyInvites: number;
  pending: number;
  totalRewards: Array<{ type: string; qty: number }>;
  nextReward: { threshold: number; current: number; reward: { type: string; qty: number } };
  thresholds: number[];
};

const stats = statsData as InviteStats;
const invitees = membersData as Invitee[];

export const InviteHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [activeTab, setActiveTab] = useState<InviteFilterTab>('all');
  const [searchValue, setSearchValue] = useState('');
  const [sortLabel, setSortLabel] = useState('今日贡献↓');
  const { height } = useWindowDimensions();
  const listHeight = Math.min(height * 0.56, 460);
  const listRef = useRef<FlatList<Invitee>>(null);

  const kpis = useMemo(
    () => [
      { label: '累计邀请', value: stats.totalInvites, tab: 'all' as InviteFilterTab },
      { label: '本周邀请', value: stats.weeklyInvites, tab: 'all' as InviteFilterTab },
      { label: '待确认', value: stats.pending, tab: 'pending' as InviteFilterTab },
    ],
    [],
  );

  const handleKpiPress = (tab: InviteFilterTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  };

  const renderInvitee = ({ item }: ListRenderItemInfo<Invitee>) => (
    <InviteeItem data={item} onPressMenu={() => console.log('menu', item.id)} />
  );

  return (
    <ScreenContainer variant="plain" scrollable>
      <View style={styles.headerRow}>
        <Text style={styles.title}>我的邀请</Text>
        <Pressable style={styles.helpButton} onPress={() => console.log('help')}>
          <Text style={styles.helpText}>帮助</Text>
        </Pressable>
      </View>

      <View style={styles.kpiRow}>
        {kpis.map((item) => (
          <KpiCard
            key={item.label}
            label={item.label}
            value={item.value}
            onPress={() => handleKpiPress(item.tab)}
            active={activeTab === item.tab}
            style={styles.kpiCard}
          />
        ))}
      </View>

      <GlassCard style={styles.rewardCard}>
        <View style={styles.rewardLeft}>
          <Text style={styles.rewardLabel}>总奖励（占位）</Text>
          <Pressable style={styles.rewardButton} onPress={() => console.log('rewards')}>
            <Text style={styles.rewardButtonText}>查看奖励</Text>
          </Pressable>
        </View>
        <RewardProgress
          current={stats.nextReward.current}
          target={stats.nextReward.threshold}
          rewardLabel="满 10 人 赠盲盒券 ×1（占位）"
        />
      </GlassCard>

      <GlassCard style={styles.memberCard} padding={16}>
        <Text style={styles.sectionTitle}>成员列表</Text>
        <Text style={styles.sectionHint}>头像 · 名字 · 职务 · 今日情报</Text>
        <FilterBar
          value={activeTab}
          onChange={setActiveTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortLabel={sortLabel}
          onPressSort={() => {
            console.log('sort');
            setSortLabel((prev) => (prev === '今日贡献↓' ? '今日贡献↑' : '今日贡献↓'));
          }}
        />
        <View style={[styles.listWrapper, { height: listHeight }]}>
          <LinearGradient
            pointerEvents="none"
            colors={['#040814', 'transparent']}
            style={[styles.fade, styles.fadeTop]}
          />
          <FlatList
            ref={listRef}
            data={invitees}
            keyExtractor={(item) => item.id}
            renderItem={renderInvitee}
            showsVerticalScrollIndicator={false}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['transparent', '#040814']}
            style={[styles.fade, styles.fadeBottom]}
          />
        </View>
      </GlassCard>

      <View style={styles.ctaWrapper}>
        <NeonButton title="去设计邀请海报" onPress={() => navigation.navigate('PosterWorkshop')} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.heading,
    color: palette.text,
  },
  helpButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  helpText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: '30%',
  },
  rewardCard: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  rewardLeft: {
    width: 140,
    gap: 8,
  },
  rewardLabel: {
    ...typography.subtitle,
    color: palette.text,
  },
  rewardButton: {
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
  },
  rewardButtonText: {
    ...typography.captionCaps,
    color: '#00E5FF',
  },
  memberCard: {
    marginTop: 24,
    gap: 10,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  sectionHint: {
    ...typography.caption,
    color: palette.sub,
  },
  listWrapper: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 28,
    zIndex: 1,
  },
  fadeTop: {
    top: 0,
  },
  fadeBottom: {
    bottom: 0,
  },
  ctaWrapper: {
    marginTop: 24,
  },
});

export default InviteHomeScreen;
