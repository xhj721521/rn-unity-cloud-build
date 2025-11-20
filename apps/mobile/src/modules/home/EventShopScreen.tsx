import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';

const heroCover = require('../../assets/cards/card_market.webp');
const membershipCover = require('../../assets/cards/card_command_center.webp');
const teamPassCover = require('../../assets/cards/card_forge.webp');
const raffleCover = require('../../assets/cards/card_leaderboard.webp');

type EventStatus = 'live' | 'upcoming' | 'ended';
type CategoryFilter = 'all' | 'member' | 'challenge' | 'raffle' | 'redeem';
type EventFilter = 'live' | 'redeem' | 'upcoming' | 'ended';

type ConfirmConfig = {
  title: string;
  cost: string;
  notice: string;
  detailLines: string[];
  confirmText: string;
} | null;

type HeroEvent = {
  title: string;
  desc: string;
  countdownMs: number;
  stockLeft: number;
  stockTotal: number;
  badges: string[];
  status: EventStatus;
  category: CategoryFilter;
};

type MembershipInfo = {
  status: EventStatus;
  benefits: string[];
  my: { lifetime: boolean; daysLeft?: number };
};

type TeamPassInfo = {
  status: EventStatus;
  benefits: string[];
  daysLeft?: number;
};

type RaffleInfo = {
  status: EventStatus;
  quota: number;
  joined: number;
  drawAt: number;
  myState: 'none' | 'joined' | 'whitelist';
};

const FILTER_TABS: Array<{ key: EventFilter; label: string }> = [
  { key: 'live', label: '进行中' },
  { key: 'redeem', label: '兑换中' },
  { key: 'upcoming', label: '预告' },
  { key: 'ended', label: '已结束' },
];

const heroEvent: HeroEvent = {
  title: '幻像 Arc 盲盒',
  desc: '限时注能 · 稀有掉落概率 +30%，含 Unity 高光粒子套装',
  countdownMs: 1000 * 60 * 60 * 8,
  stockLeft: 42,
  stockTotal: 120,
  badges: ['限时', '掉率提升'],
  status: 'live',
  category: 'challenge',
};

const membershipEvent: MembershipInfo = {
  status: 'live',
  benefits: ['盲盒掉率 +8%', 'Unity 频道加速', '每周 200 ARC 红利'],
  my: {
    lifetime: false,
    daysLeft: 11,
  },
};

const teamPassEvent: TeamPassInfo = {
  status: 'live',
  benefits: ['团队席位 +15', '训练收益 +12%', '战报优先推送'],
  daysLeft: 5,
};

const raffleEvent: RaffleInfo = {
  status: 'live',
  quota: 200,
  joined: 156,
  drawAt: Date.now() + 1000 * 60 * 60 * 24,
  myState: 'joined',
};

export const EventShopScreen = () => {
  const [filter, setFilter] = useState<EventFilter>('live');
  const [membershipSegment, setMembershipSegment] = useState<'monthly' | 'lifetime'>('monthly');
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>(null);
  const [myDrawerVisible, setMyDrawerVisible] = useState(false);

  const matchesFilter = (status: EventStatus, category?: CategoryFilter) => {
    switch (filter) {
      case 'live':
        return status === 'live';
      case 'upcoming':
        return status === 'upcoming';
      case 'ended':
        return status === 'ended';
      case 'redeem':
        return category === 'redeem';
      default:
        return true;
    }
  };

  const heroVisible = matchesFilter(heroEvent.status, heroEvent.category);
  const membershipVisible = matchesFilter(membershipEvent.status, 'member');
  const teamPassVisible = matchesFilter(teamPassEvent.status, 'challenge');
  const raffleVisible = matchesFilter(raffleEvent.status, 'raffle');

  const visibleCount = [heroVisible, membershipVisible, teamPassVisible, raffleVisible].filter(
    Boolean,
  ).length;

  const contentEmpty = visibleCount === 0;

  const openConfirm = (config: ConfirmConfig) => setConfirmConfig(config);
  const closeConfirm = () => setConfirmConfig(null);

  const handleHeroPress = () =>
    openConfirm({
      title: '唤醒幻像盲盒',
      cost: '消耗 120 ARC',
      notice: '保底史诗掉落 · 24 小时内有效 · 可撤销',
      detailLines: ['库存锁定 10 分钟', '奖励自动发放至指挥中心'],
      confirmText: '确认唤醒',
    });

  const handleMembershipPress = () =>
    openConfirm({
      title: membershipSegment === 'monthly' ? '开通月度会员' : '升级永久会员',
      cost: membershipSegment === 'monthly' ? '消耗 300 ARC' : '消耗 1800 ARC',
      notice: '立即生效 · 支持续期 · 可在到期前撤销一次',
      detailLines: ['权益自动叠加', '到期前 3 天提醒'],
      confirmText: membershipSegment === 'monthly' ? '确认开通' : '确认升级',
    });

  const handleTeamPassPress = () =>
    openConfirm({
      title: '激活团队拓展证',
      cost: '消耗 500 ARC',
      notice: '权益有效期 30 天 · 到期需续期 · 不可撤销',
      detailLines: ['战队席位立即扩容', '新增收益直接入账'],
      confirmText: '确认激活',
    });

  const handleRafflePress = () =>
    openConfirm({
      title: raffleEvent.myState === 'none' ? '报名股东 NFT 抽签' : '预约认领',
      cost: raffleEvent.myState === 'whitelist' ? '无需额外消耗' : '消耗 80 ARC',
      notice:
        raffleEvent.myState === 'whitelist'
          ? '白名单用户可直接预约认领'
          : '报名成功后不可撤销 · 抽中自动扣款',
      detailLines: ['开奖时间：24 小时内', '结果同步到我的活动'],
      confirmText: raffleEvent.myState === 'whitelist' ? '预约认领' : '确认报名',
    });

  const myEvents = useMemo(
    () => [
      { title: '幻像盲盒', progress: '2/5 次唤醒', status: '可继续进行' },
      { title: '会员中心', progress: '剩余 11 天', status: '权益生效中' },
      { title: '股东 NFT 抽签', progress: '报名成功', status: '等待开奖' },
    ],
    [],
  );

  return (
    <View style={styles.root}>
      <ScreenContainer scrollable variant="plain" edgeVignette background={<EventsBackground />}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>活动指挥部</Text>
            <Text style={styles.subtitle}>限时挑选 · 注能增益 · 兑换奖励</Text>
          </View>
          <RipplePressable style={styles.myButton} onPress={() => setMyDrawerVisible(true)}>
            <Text style={styles.myButtonText}>我的活动</Text>
          </RipplePressable>
        </View>

        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => {
            const active = tab.key === filter;
            return (
              <RipplePressable
                key={tab.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(tab.key)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{tab.label}</Text>
              </RipplePressable>
            );
          })}
        </View>

        {contentEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>当前筛选暂无活动</Text>
            <Text style={styles.emptyBody}>可前往探索或试炼获取更多资源</Text>
          </View>
        ) : (
          <>
            {heroVisible ? <HeroEventCard data={heroEvent} onPress={handleHeroPress} /> : null}
            {membershipVisible ? (
              <MembershipCard
                data={membershipEvent}
                selected={membershipSegment}
                onSegmentChange={setMembershipSegment}
                onPress={handleMembershipPress}
              />
            ) : null}
            {teamPassVisible ? (
              <TeamPassCard data={teamPassEvent} onPress={handleTeamPassPress} />
            ) : null}
            {raffleVisible ? <RaffleCard data={raffleEvent} onPress={handleRafflePress} /> : null}
          </>
        )}
      </ScreenContainer>
      <ConfirmDrawer config={confirmConfig} onClose={closeConfirm} />
      <MyEventsDrawer
        visible={myDrawerVisible}
        events={myEvents}
        onClose={() => setMyDrawerVisible(false)}
      />
    </View>
  );
};

const STATUS_LABELS: Record<EventStatus, string> = {
  live: '进行中',
  upcoming: '预告',
  ended: '已结束',
};

const HeroEventCard = ({ data, onPress }: { data: HeroEvent; onPress: () => void }) => {
  const progress = data.stockLeft / data.stockTotal;
  const statusLabel = STATUS_LABELS[data.status];
  const stockState = progress < 0.4 ? '稀缺' : '充足';
  return (
    <NeonCard
      backgroundSource={heroCover}
      overlayColor="rgba(6,8,18,0.72)"
      borderColors={['rgba(0,209,199,0.8)', 'rgba(138,92,255,0.8)']}
      glowColor="rgba(0,209,199,0.3)"
      contentPadding={24}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.badgeRow}>
          {data.badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              data.status === 'live'
                ? styles.statusDotLive
                : data.status === 'upcoming'
                ? styles.statusDotUpcoming
                : styles.statusDotEnded,
            ]}
          />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{data.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {data.desc}
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>倒计时</Text>
        <Text style={styles.infoValue}>{formatCountdown(data.countdownMs)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>库存</Text>
        <Text style={styles.infoValue}>
          {data.stockLeft}/{data.stockTotal} · {stockState}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
      <RipplePressable style={styles.primaryCta} onPress={onPress}>
        <Text style={styles.primaryCtaText}>立即唤醒</Text>
      </RipplePressable>
    </NeonCard>
  );
};

const MembershipCard = ({
  data,
  selected,
  onSegmentChange,
  onPress,
}: {
  data: MembershipInfo;
  selected: 'monthly' | 'lifetime';
  onSegmentChange: (value: 'monthly' | 'lifetime') => void;
  onPress: () => void;
}) => {
  let statusText = '尚未开通';
  if (data.my.lifetime) {
    statusText = '永久徽章已激活';
  } else if (data.my.daysLeft) {
    statusText = `剩余 ${data.my.daysLeft} 天`;
  }

  let ctaText = '立即开通';
  if (selected === 'monthly') {
    ctaText = data.my.daysLeft ? '续期' : '立即开通';
  } else {
    ctaText = data.my.lifetime ? '徽章已激活' : '升级永久';
  }

  const statusLabel = STATUS_LABELS[data.status];
  const benefitSummary = data.benefits.join(' · ');

  return (
    <NeonCard
      backgroundSource={membershipCover}
      overlayColor="rgba(8,10,22,0.8)"
      borderColors={['rgba(138,92,255,0.7)', 'rgba(0,209,199,0.7)']}
      glowColor="rgba(138,92,255,0.35)"
      contentPadding={20}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>会员专享</Text>
          </View>
        </View>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              data.status === 'live'
                ? styles.statusDotLive
                : data.status === 'upcoming'
                ? styles.statusDotUpcoming
                : styles.statusDotEnded,
            ]}
          />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardEyebrow}>会员中心</Text>
          <Text style={styles.cardTitle}>月度 / 永久一键切换</Text>
        </View>
        <View style={styles.segmentRow}>
          {(['monthly', 'lifetime'] as const).map((key) => {
            const active = key === selected;
            return (
              <Pressable
                key={key}
                style={[styles.segmentChip, active && styles.segmentChipActive]}
                onPress={() => onSegmentChange(key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {key === 'monthly' ? '月度' : '永久'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {benefitSummary}
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>当前状态</Text>
        <Text style={styles.infoValue}>{statusText}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>权益摘要</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {benefitSummary}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>方案</Text>
        <Text style={styles.infoValue}>{selected === 'monthly' ? '月度会员' : '永久会员'}</Text>
      </View>
      <RipplePressable style={styles.primaryCta} onPress={onPress}>
        <Text style={styles.primaryCtaText}>{ctaText}</Text>
      </RipplePressable>
    </NeonCard>
  );
};

const TeamPassCard = ({ data, onPress }: { data: TeamPassInfo; onPress: () => void }) => {
  const statusLabel = STATUS_LABELS[data.status];
  const benefits = data.benefits.slice(0, 3);
  return (
    <NeonCard
      backgroundSource={teamPassCover}
      overlayColor="rgba(6,10,20,0.85)"
      borderColors={['rgba(0,209,199,0.6)', 'rgba(138,92,255,0.6)']}
      glowColor="rgba(0,209,199,0.25)"
      contentPadding={20}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>团队拓展</Text>
          </View>
        </View>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              data.status === 'live'
                ? styles.statusDotLive
                : data.status === 'upcoming'
                ? styles.statusDotUpcoming
                : styles.statusDotEnded,
            ]}
          />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.cardEyebrow}>团队拓展证</Text>
      <Text style={styles.cardTitle}>月度权益 · 席位扩容</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {benefits.join(' · ')}
      </Text>
      <View style={styles.benefitsList}>
        {benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Text style={styles.benefitBullet}>✦</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>剩余天数</Text>
        <Text style={styles.infoValue}>{data.daysLeft ? `剩余 ${data.daysLeft} 天` : '尚未激活'}</Text>
      </View>
      <RipplePressable style={styles.primaryCta} onPress={onPress}>
        <Text style={styles.primaryCtaText}>{data.daysLeft ? '续期' : '激活权限'}</Text>
      </RipplePressable>
    </NeonCard>
  );
};

const RaffleCard = ({ data, onPress }: { data: RaffleInfo; onPress: () => void }) => {
  const progress = Math.min(data.joined / data.quota, 1);
  let stateLabel = '尚未报名';
  if (data.myState === 'joined') {
    stateLabel = '已报名 · 等待开奖';
  } else if (data.myState === 'whitelist') {
    stateLabel = '白名单资格 · 可预约认领';
  }
  let ctaText = '报名抽签';
  if (data.myState === 'joined') {
    ctaText = '等待开奖';
  } else if (data.myState === 'whitelist') {
    ctaText = '预约认领';
  }
  return (
    <NeonCard
      backgroundSource={raffleCover}
      overlayColor="rgba(8,10,24,0.82)"
      borderColors={['rgba(138,92,255,0.65)', 'rgba(0,209,199,0.65)']}
      glowColor="rgba(138,92,255,0.28)"
      contentPadding={20}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>抽签</Text>
          </View>
        </View>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              data.status === 'live'
                ? styles.statusDotLive
                : data.status === 'upcoming'
                ? styles.statusDotUpcoming
                : styles.statusDotEnded,
            ]}
          />
          <Text style={styles.statusText}>{STATUS_LABELS[data.status]}</Text>
        </View>
      </View>
      <Text style={styles.cardEyebrow}>股东 NFT 抽签</Text>
      <Text style={styles.cardTitle}>传承徽章 · 仅限 200 席</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        稀有徽章加成，支持预约认领
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>报名进度</Text>
        <Text style={styles.infoValue}>
          {data.joined}/{data.quota}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>开奖时间</Text>
        <Text style={styles.infoValue}>{formatCountdown(data.drawAt - Date.now())}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>我的状态</Text>
        <Text style={styles.infoValue}>{stateLabel}</Text>
      </View>
      <RipplePressable style={styles.primaryCta} onPress={onPress}>
        <Text style={styles.primaryCtaText}>{ctaText}</Text>
      </RipplePressable>
    </NeonCard>
  );
};

const ConfirmDrawer = ({ config, onClose }: { config: ConfirmConfig; onClose: () => void }) => (
  <Modal visible={!!config} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.modalBackdrop} onPress={onClose} />
    <View style={styles.drawer}>
      {config ? (
        <>
          <Text style={styles.drawerTitle}>{config.title}</Text>
          <Text style={styles.drawerCost}>{config.cost}</Text>
          <Text style={styles.drawerNotice}>{config.notice}</Text>
          <View style={styles.drawerList}>
            {config.detailLines.map((line) => (
              <Text key={line} style={styles.drawerLine}>
                · {line}
              </Text>
            ))}
          </View>
          <View style={styles.drawerActions}>
            <Pressable style={styles.drawerSecondary} onPress={onClose}>
              <Text style={styles.drawerSecondaryText}>取消</Text>
            </Pressable>
            <Pressable style={styles.drawerPrimary} onPress={onClose}>
              <Text style={styles.drawerPrimaryText}>{config.confirmText}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  </Modal>
);

const MyEventsDrawer = ({
  visible,
  events,
  onClose,
}: {
  visible: boolean;
  events: Array<{ title: string; progress: string; status: string }>;
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.modalBackdrop} onPress={onClose} />
    <View style={styles.drawerLarge}>
      <Text style={styles.drawerTitle}>我的活动</Text>
      {events.map((event) => (
        <View key={event.title} style={styles.myEventRow}>
          <View>
            <Text style={styles.myEventTitle}>{event.title}</Text>
            <Text style={styles.myEventProgress}>{event.progress}</Text>
          </View>
          <Text style={styles.myEventStatus}>{event.status}</Text>
        </View>
      ))}
      <Pressable style={styles.drawerPrimary} onPress={onClose}>
        <Text style={styles.drawerPrimaryText}>返回</Text>
      </Pressable>
    </View>
  </Modal>
);

const EventsBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={styles.backgroundOverlay} />
    <View style={styles.backgroundGlow} />
  </View>
);

const formatCountdown = (ms: number) => {
  if (ms <= 0) {
    return '00:00:00';
  }
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#010112',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.cardGap,
    gap: 12,
  },
  title: {
    ...typography.heading,
    color: palette.text,
    fontSize: 22,
  },
  subtitle: {
    ...typography.body,
    color: palette.sub,
    fontSize: 13,
    marginTop: 4,
  },
  myButton: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(8,12,24,0.6)',
  },
  myButtonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.section,
  },
  filterChip: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,42,68,0.8)',
    backgroundColor: 'rgba(4,8,20,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    borderColor: '#4DA3FF',
    backgroundColor: 'rgba(77,163,255,0.18)',
  },
  filterText: {
    ...typography.captionCaps,
    fontSize: 13,
    color: '#7E8AA6',
  },
  filterTextActive: {
    color: '#EAF2FF',
    fontWeight: '600',
  },
  card: {
    marginBottom: spacing.section,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,209,199,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0,209,199,0.5)',
  },
  badgeText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  cardTitle: {
    ...typography.heading,
    color: palette.text,
    marginTop: 2,
  },
  cardDesc: {
    ...typography.body,
    color: palette.sub,
    marginTop: 6,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  infoLabel: {
    ...typography.caption,
    color: palette.sub,
  },
  infoValue: {
    ...typography.caption,
    color: palette.text,
    textAlign: 'right',
    flexShrink: 1,
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  primaryCta: {
    marginTop: 16,
    borderRadius: shape.capsuleRadius,
    backgroundColor: palette.primary,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    ...typography.captionCaps,
    color: '#0B0F1E',
    fontSize: 14,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardEyebrow: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentChip: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentChipActive: {
    borderColor: palette.accent,
    backgroundColor: 'rgba(138,92,255,0.22)',
  },
  segmentText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  segmentTextActive: {
    color: palette.text,
  },
  benefitsList: {
    marginTop: 16,
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitBullet: {
    color: palette.primary,
  },
  benefitText: {
    ...typography.body,
    color: palette.text,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(8,12,24,0.7)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusDotLive: {
    backgroundColor: '#4DA3FF',
  },
  statusDotUpcoming: {
    backgroundColor: '#FACC15',
  },
  statusDotEnded: {
    backgroundColor: '#64748B',
  },
  statusText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  emptyBody: {
    ...typography.body,
    color: palette.sub,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0F1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  drawerLarge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0F1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 16,
  },
  drawerTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  drawerCost: {
    ...typography.heading,
    color: palette.text,
  },
  drawerNotice: {
    ...typography.caption,
    color: palette.sub,
  },
  drawerList: {
    gap: 6,
  },
  drawerLine: {
    ...typography.caption,
    color: palette.sub,
  },
  drawerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  drawerSecondary: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  drawerSecondaryText: {
    ...typography.subtitle,
    color: palette.sub,
  },
  drawerPrimary: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,209,199,0.24)',
  },
  drawerPrimaryText: {
    ...typography.subtitle,
    color: palette.text,
  },
  myEventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  myEventTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  myEventProgress: {
    ...typography.caption,
    color: palette.sub,
  },
  myEventStatus: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,4,16,0.8)',
  },
  backgroundGlow: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(138,92,255,0.25)',
  },
});

export default EventShopScreen;
