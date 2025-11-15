import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import GlassCard from '@components/shared/GlassCard';
import RewardProgress from '@components/invite/RewardProgress';
import { Invitee, InviteeItem } from '@components/invite/InviteeItem';
import { InviteFilterTab } from '@components/invite/FilterBar';
import ExpandablePanel from '@components/team/ExpandablePanel';
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
const FILTER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'joined', label: '已加入' },
  { key: 'pending', label: '待确认' },
  { key: 'expired', label: '已过期' },
  { key: 'weekly', label: '本周' },
] as const;

export const InviteHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [activeTab, setActiveTab] = useState<InviteFilterTab>('all');
  const [selectedFilter, setSelectedFilter] = useState(FILTER_TABS[0].key);
  const [searchValue, setSearchValue] = useState('');
  const [rewardExpanded, setRewardExpanded] = useState(false);

  const statItems = useMemo(
    () => [
      { label: '累计邀请', value: `${stats.totalInvites} 人`, tab: 'all' as InviteFilterTab },
      { label: '本周邀请', value: `${stats.weeklyInvites} 人`, tab: 'all' as InviteFilterTab },
      { label: '待确认', value: `${stats.pending} 人`, tab: 'pending' as InviteFilterTab },
    ],
    [],
  );

  const filteredList = useMemo(() => {
    const byTab =
      activeTab === 'all' ? invitees : invitees.filter((item) => item.status === activeTab);
    if (!searchValue.trim()) {
      return byTab;
    }
    return byTab.filter((item) =>
      item.nickname.toLowerCase().includes(searchValue.trim().toLowerCase()),
    );
  }, [activeTab, searchValue]);

  const handleStatPress = (tab: InviteFilterTab) => {
    setActiveTab(tab);
  };

  const renderInvitee = ({ item }: ListRenderItemInfo<Invitee>) => (
    <InviteeItem data={item} onPressMenu={() => console.log('menu', item.id)} />
  );

  return (
    <ScreenContainer variant="plain" scrollable>
      <View style={styles.pageContent}>
        <View style={styles.headerRow}>
        <Text style={styles.title}>我的邀请</Text>
        <Pressable style={styles.helpButton} onPress={() => console.log('help')}>
          <Text style={styles.helpText}>帮助</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.statsCard} padding={18}>
        <View style={styles.statsRow}>
          {statItems.map((item) => (
            <Pressable
              key={item.label}
              style={[styles.statPill, activeTab === item.tab && styles.statPillActive]}
              onPress={() => handleStatPress(item.tab)}
            >
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.rewardCard}>
        <View style={styles.rewardHeader}>
          <View>
            <Text style={styles.rewardTitle}>总奖励</Text>
            <Text style={styles.rewardSubtitle}>当前进度</Text>
          </View>
          <Pressable
            style={styles.rewardGhostButton}
            onPress={() => setRewardExpanded((prev) => !prev)}
          >
            <Text style={styles.rewardGhostText}>{rewardExpanded ? '收起奖励' : '查看奖励'}</Text>
          </Pressable>
        </View>
        <RewardProgress
          current={stats.nextReward.current}
          target={stats.nextReward.threshold}
          rewardLabel="满 10 人 赠盲盒券 ×1（占位）"
        />
        <View style={styles.rewardFooter}>
          <Text style={styles.rewardDelta}>
            差 {Math.max(stats.nextReward.threshold - stats.nextReward.current, 0)} 人
          </Text>
          <Pressable
            style={styles.designButton}
            onPress={() => navigation.navigate('PosterWorkshop')}
          >
            <Text style={styles.designText}>去设计邀请海报</Text>
          </Pressable>
        </View>
      </GlassCard>

      {rewardExpanded ? (
        <ExpandablePanel>
          {stats.totalRewards.map((reward, index) => (
            <Text key={`${reward.type}-${index}`} style={styles.rewardRow}>
              · 奖励 {reward.type} ×{reward.qty}
            </Text>
          ))}
        </ExpandablePanel>
      ) : null}

        <GlassCard style={styles.memberCard} padding={16}>
        <Text style={styles.sectionTitle}>成员列表</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsRow}
          contentContainerStyle={styles.filterChipsContent}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = tab.key === selectedFilter;
            return (
              <Pressable
                key={tab.key}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab.key)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderInvitee}
          scrollEnabled={false}
          contentContainerStyle={styles.memberList}
        />
        </GlassCard>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: 120,
  },
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
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    columnGap: 10,
  },
  statPill: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.15)',
    backgroundColor: 'rgba(5,8,18,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statPillActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  statLabel: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  statValue: {
    ...typography.heading,
    fontSize: 18,
    color: '#FFFFFF',
  },
  rewardCard: {
    gap: 12,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  rewardSubtitle: {
    ...typography.caption,
    color: palette.sub,
  },
  rewardGhostButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  rewardGhostText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardDelta: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  designButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#00E5FF',
  },
  designText: {
    ...typography.captionCaps,
    color: '#041016',
  },
  rewardRow: {
    ...typography.caption,
    color: palette.text,
    marginBottom: 6,
  },
  memberCard: {
    marginTop: 24,
    gap: 12,
  },
  filterChipsRow: {
    marginTop: 8,
  },
  filterChipsContent: {
    columnGap: 10,
    paddingRight: 6,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(5,8,20,0.4)',
  },
  filterChipActive: {
    borderColor: '#33F5FF',
    backgroundColor: 'rgba(51,245,255,0.22)',
    shadowColor: '#33F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.35,
    elevation: 6,
  },
  filterChipText: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.72)',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  memberList: {
    marginTop: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
});

export default InviteHomeScreen;
