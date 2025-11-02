import React, { useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { useNeonPulse, getGlowStyle } from '@theme/animations';
import { neonPalette } from '@theme/neonPalette';
import { NeonPressable } from '@components/NeonPressable';
import { designTokens } from '@theme/designTokens';

type EventHighlight = {
  id: string;
  title: string;
  subtitle: string;
  reward: string;
  deadline: string;
  tag: string;
  gradient: [string, string];
};

type ShopItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  currency: string;
  cadence: string;
  endsIn: string;
  highlight?: string;
  perks: string[];
  gradient: [string, string];
};

const EVENT_HIGHLIGHTS: EventHighlight[] = [
  {
    id: 'neon-circuit',
    title: '霓虹巡回赛·第七站',
    subtitle: '完成 5 场链上挑战，获取全息涂装与 AR 铭牌。',
    reward: '大奖：稀有 AR 载具 + Arc 能量 ×300',
    deadline: '剩余 2 天 11 小时',
    tag: '新赛季',
    gradient: ['rgba(126, 96, 255, 0.55)', 'rgba(10, 14, 40, 0.94)'],
  },
  {
    id: 'forge-festival',
    title: '铸造节·锻造连击',
    subtitle: '组建 3 人小队通关锻造试炼，解锁节奏稀有武器。',
    reward: '通关奖励：史诗武器芯片 + 团队经验 ×2',
    deadline: '剩余 5 天 6 小时',
    tag: '联机活动',
    gradient: ['rgba(47, 217, 255, 0.45)', 'rgba(16, 34, 68, 0.92)'],
  },
  {
    id: 'market-week',
    title: '链鉴市集周·特卖',
    subtitle: '精选 NFT 降价 30%，每日轮换 12 件限量收藏。',
    reward: '首单返还：霓虹碎片 ×150',
    deadline: '剩余 18 小时',
    tag: '限时折扣',
    gradient: ['rgba(255, 143, 81, 0.45)', 'rgba(30, 18, 48, 0.92)'],
  },
];

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'vip-pass',
    title: '璀璨指挥官通行证',
    subtitle: '解锁全平台特权、每周开箱加成。',
    price: '79',
    currency: 'USDT',
    cadence: '一次性解锁',
    endsIn: '剩余 48 小时',
    highlight: '推荐',
    perks: ['专属霓虹渐变头像框', '资源收益 +20%', '每周神秘盲盒 ×1'],
    gradient: ['rgba(255, 106, 213, 0.45)', 'rgba(34, 18, 68, 0.95)'],
  },
  {
    id: 'shareholder-nft',
    title: '股权凭证 NFT',
    subtitle: '解锁 DAO 投票权与链上分红席位。',
    price: '1000',
    currency: 'USDT',
    cadence: '限量 200 枚',
    endsIn: '剩余 3 天 12 小时',
    highlight: '限量',
    perks: ['Protocol 分红 ≥ 12% 年化', 'DAO 投票权 +3', '全息门户访问权限'],
    gradient: ['rgba(63, 242, 255, 0.38)', 'rgba(18, 29, 74, 0.94)'],
  },
  {
    id: 'arc-box',
    title: '幻彩 Arc 盲盒',
    subtitle: '全新能量共鸣主题，史诗掉率翻倍。',
    price: '9.9',
    currency: 'USDT',
    cadence: '每日限购 3 次',
    endsIn: '剩余 12 小时',
    perks: ['100% 获得限定装饰', '5% 概率掉落传说核心', '累计 10 次赠史诗皮肤'],
    gradient: ['rgba(140, 114, 255, 0.45)', 'rgba(28, 16, 62, 0.95)'],
  },
  {
    id: 'team-expansion',
    title: '战队扩编凭证',
    subtitle: '扩容战队上限并解锁高级战报。',
    price: '299',
    currency: 'USDT',
    cadence: '季度更新',
    endsIn: '剩余 1 天 6 小时',
    perks: ['战队人数上限 +50%', '战术加成 +10%', '团队专属任务线'],
    gradient: ['rgba(255, 200, 97, 0.42)', 'rgba(40, 22, 70, 0.92)'],
  },
];

export const EventShopScreen = () => {
  const [tab, setTab] = useState<'events' | 'store'>('events');

  return (
    <ScreenContainer scrollable>
      <LinearGradient
        colors={['#211343', '#0B101F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroHeader}>
          <Text style={styles.heroEyebrow}>NEON EVENTS HUB</Text>
          <Text style={styles.heroTitle}>活动商城</Text>
          <Text style={styles.heroSubtitle}>
            把握限时活动节奏，抢先兑换稀缺资产。
          </Text>
        </View>
        <View style={styles.heroStats}>
          <HeroStat label="进行中" value="06" />
          <View style={styles.heroDivider} />
          <HeroStat label="限量商品" value="12" />
          <View style={styles.heroDivider} />
          <HeroStat label="累计奖励" value="4.6K" unit="USDT" />
        </View>
      </LinearGradient>

      <View style={styles.tabSwitcher}>
        <SwitchButton
          label="活动中心"
          active={tab === 'events'}
          onPress={() => setTab('events')}
        />
        <SwitchButton
          label="商城特供"
          active={tab === 'store'}
          onPress={() => setTab('store')}
        />
      </View>

      {tab === 'events' ? (
        <View style={styles.eventList}>
          {EVENT_HIGHLIGHTS.map((event) => (
            <EventCard key={event.id} highlight={event} />
          ))}
        </View>
      ) : (
        <View style={styles.shopList}>
          {SHOP_ITEMS.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
};

const SwitchButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <NeonPressable
    onPress={onPress}
    style={[styles.switchButton, active && styles.switchButtonActive]}
  >
    <Text style={[styles.switchLabel, active && styles.switchLabelActive]}>
      {label}
    </Text>
  </NeonPressable>
);

const HeroStat = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) => (
  <View style={styles.heroStat}>
    <Text style={styles.heroStatValue}>{value}</Text>
    {unit ? <Text style={styles.heroStatUnit}>{unit}</Text> : null}
    <Text style={styles.heroStatLabel}>{label}</Text>
  </View>
);

const EventCard = ({ highlight }: { highlight: EventHighlight }) => {
  const pulse = useNeonPulse({ duration: 5400 });

  return (
    <LinearGradient
      colors={highlight.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.eventCard}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.eventGlow,
          getGlowStyle({
            animated: pulse,
            minOpacity: 0.12,
            maxOpacity: 0.28,
            minScale: 0.9,
            maxScale: 1.12,
          }),
        ]}
      />
      <View style={styles.eventTag}>
        <Text style={styles.eventTagText}>{highlight.tag}</Text>
      </View>
      <Text style={styles.eventTitle}>{highlight.title}</Text>
      <Text style={styles.eventSubtitle}>{highlight.subtitle}</Text>
      <View style={styles.eventFooter}>
        <View style={styles.eventReward}>
          <Text style={styles.eventRewardLabel}>奖励</Text>
          <Text style={styles.eventRewardValue}>{highlight.reward}</Text>
        </View>
        <View style={styles.eventCountdown}>
          <Text style={styles.eventCountdownLabel}>倒计时</Text>
          <Text style={styles.eventCountdownValue}>{highlight.deadline}</Text>
        </View>
      </View>
      <NeonPressable style={styles.eventButton}>
        <Text style={styles.eventButtonText}>立即参与</Text>
      </NeonPressable>
    </LinearGradient>
  );
};

const ShopCard = ({ item }: { item: ShopItem }) => (
  <LinearGradient
    colors={item.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.shopCard}
  >
    <View style={styles.shopHeader}>
      <View style={styles.shopTitleRow}>
        <Text style={styles.shopTitle}>{item.title}</Text>
        {item.highlight ? (
          <View style={styles.shopTag}>
            <Text style={styles.shopTagText}>{item.highlight}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.shopTimer}>{item.endsIn}</Text>
    </View>
    <Text style={styles.shopSubtitle}>{item.subtitle}</Text>
    <View style={styles.shopPriceRow}>
      <Text style={styles.shopPrice}>
        <Text style={styles.shopCurrency}>{item.currency}</Text> {item.price}
      </Text>
      <Text style={styles.shopCadence}>{item.cadence}</Text>
    </View>
    <View style={styles.shopPerks}>
      {item.perks.map((perk) => (
        <View key={perk} style={styles.perkRow}>
          <View style={styles.perkDot} />
          <Text style={styles.perkText}>{perk}</Text>
        </View>
      ))}
    </View>
    <NeonPressable style={styles.shopButton}>
      <Text style={styles.shopButtonText}>立即兑换</Text>
    </NeonPressable>
  </LinearGradient>
);

const styles = StyleSheet.create({
  heroBanner: {
    borderRadius: designTokens.radii.xl,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(94, 68, 176, 0.45)',
    gap: designTokens.spacing.lg,
    overflow: 'hidden',
  },
  heroHeader: {
    gap: designTokens.spacing.xs,
  },
  heroEyebrow: {
    color: designTokens.colors.textSecondary,
    fontSize: 11,
    letterSpacing: 2,
  },
  heroTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroSubtitle: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(113, 95, 202, 0.35)',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heroStatValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  heroStatUnit: {
    color: designTokens.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  heroStatLabel: {
    color: designTokens.colors.textMuted,
    fontSize: 11,
  },
  tabSwitcher: {
    flexDirection: 'row',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.lg,
  },
  switchButton: {
    flex: 1,
    borderRadius: designTokens.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(86, 68, 180, 0.35)',
    backgroundColor: 'rgba(12, 14, 30, 0.88)',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
  },
  switchButtonActive: {
    borderColor: designTokens.colors.borderStrong,
    backgroundColor: 'rgba(76, 42, 180, 0.28)',
  },
  switchLabel: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  switchLabelActive: {
    color: designTokens.colors.textPrimary,
  },
  eventList: {
    gap: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.xxl,
  },
  eventCard: {
    borderRadius: designTokens.radii.xl,
    padding: designTokens.spacing.lg,
    minHeight: 220,
    borderWidth: 1,
    borderColor: 'rgba(78, 48, 140, 0.45)',
    overflow: 'hidden',
    gap: designTokens.spacing.md,
  },
  eventGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: designTokens.radii.xl,
    backgroundColor: neonPalette.glowPurple,
  },
  eventTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.radii.pill,
    backgroundColor: 'rgba(14, 16, 36, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(236, 241, 255, 0.28)',
  },
  eventTagText: {
    color: designTokens.colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  eventTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  eventSubtitle: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: designTokens.spacing.md,
  },
  eventReward: {
    flex: 1,
  },
  eventRewardLabel: {
    color: designTokens.colors.textMuted,
    fontSize: 11,
    marginBottom: designTokens.spacing.xs,
  },
  eventRewardValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 13,
  },
  eventCountdown: {
    alignItems: 'flex-end',
  },
  eventCountdownLabel: {
    color: designTokens.colors.textMuted,
    fontSize: 11,
  },
  eventCountdownValue: {
    color: designTokens.colors.accentAmber,
    fontSize: 13,
    fontWeight: '600',
    marginTop: designTokens.spacing.xs,
  },
  eventButton: {
    alignSelf: 'flex-start',
    marginTop: designTokens.spacing.xs,
    borderRadius: designTokens.radii.md,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(236, 241, 255, 0.32)',
    backgroundColor: 'rgba(13, 15, 32, 0.82)',
  },
  eventButtonText: {
    color: designTokens.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  shopList: {
    gap: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.xxl,
  },
  shopCard: {
    borderRadius: designTokens.radii.xl,
    padding: designTokens.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(82, 52, 140, 0.4)',
    backgroundColor: designTokens.colors.card,
    gap: designTokens.spacing.md,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  shopTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  shopTag: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  shopTagText: {
    color: designTokens.colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  shopTimer: {
    color: designTokens.colors.accentAmber,
    fontSize: 12,
    fontWeight: '600',
  },
  shopSubtitle: {
    color: designTokens.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  shopPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  shopPrice: {
    color: designTokens.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  shopCurrency: {
    color: designTokens.colors.accentCyan,
    fontSize: 16,
    fontWeight: '700',
  },
  shopCadence: {
    color: designTokens.colors.textMuted,
    fontSize: 12,
  },
  shopPerks: {
    gap: designTokens.spacing.sm,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  perkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: designTokens.colors.accentCyan,
  },
  perkText: {
    flex: 1,
    color: designTokens.colors.textPrimary,
    fontSize: 13,
  },
  shopButton: {
    marginTop: designTokens.spacing.xs,
    borderRadius: designTokens.radii.md,
    paddingVertical: designTokens.spacing.sm,
    alignItems: 'center',
    backgroundColor: designTokens.colors.accentPink,
  },
  shopButtonText: {
    color: '#170624',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
