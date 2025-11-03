import React, { useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { useNeonPulse } from '@theme/animations';

type ShopTone = 'magenta' | 'cyan' | 'amber' | 'violet';
type ShopFilter = 'all' | 'limited' | 'subscription' | 'permanent' | 'nft';

type ShopItem = {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  price: string;
  currency: string;
  type: ShopFilter;
  tone: ShopTone;
  ctaLabel: string;
  highlight?: string;
  countdown?: string;
  stock?: {
    label: string;
    level: 'low' | 'normal';
  };
  perks: string[];
};

const FILTERS: { key: ShopFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'limited', label: '限时' },
  { key: 'subscription', label: '订阅' },
  { key: 'permanent', label: '永久' },
  { key: 'nft', label: 'NFT' },
];

const TONE_PRESET: Record<
  ShopTone,
  {
    shell: string[];
    border: string;
    backdrop: string;
    accent: string;
    accentSoft: string;
    button: string[];
    ripple: string;
    bullet: string;
    badge: string[];
  }
> = {
  magenta: {
    shell: ['rgba(255, 106, 213, 0.22)', 'rgba(108, 60, 255, 0.22)'],
    border: 'rgba(255, 106, 213, 0.55)',
    backdrop: 'rgba(18, 12, 42, 0.92)',
    accent: '#FF6AD5',
    accentSoft: 'rgba(255, 106, 213, 0.16)',
    button: ['#FF6AD5', '#A855F7'],
    ripple: 'rgba(255, 106, 213, 0.24)',
    bullet: '#FFB4F3',
    badge: ['rgba(255, 106, 213, 0.8)', 'rgba(168, 85, 247, 0.8)'],
  },
  cyan: {
    shell: ['rgba(110, 217, 255, 0.2)', 'rgba(45, 110, 255, 0.24)'],
    border: 'rgba(96, 165, 250, 0.55)',
    backdrop: 'rgba(10, 24, 42, 0.9)',
    accent: '#3FF2FF',
    accentSoft: 'rgba(63, 242, 255, 0.16)',
    button: ['#3FF2FF', '#2563EB'],
    ripple: 'rgba(96, 165, 250, 0.24)',
    bullet: '#8CEBFF',
    badge: ['rgba(63, 242, 255, 0.85)', 'rgba(37, 99, 235, 0.85)'],
  },
  amber: {
    shell: ['rgba(255, 196, 105, 0.25)', 'rgba(242, 148, 61, 0.22)'],
    border: 'rgba(251, 191, 36, 0.55)',
    backdrop: 'rgba(32, 20, 20, 0.92)',
    accent: '#F8B04B',
    accentSoft: 'rgba(251, 191, 36, 0.16)',
    button: ['#F8B04B', '#F97316'],
    ripple: 'rgba(251, 191, 36, 0.22)',
    bullet: '#FCD34D',
    badge: ['rgba(251, 191, 36, 0.85)', 'rgba(249, 115, 22, 0.85)'],
  },
  violet: {
    shell: ['rgba(203, 160, 255, 0.22)', 'rgba(124, 92, 255, 0.24)'],
    border: 'rgba(167, 139, 250, 0.5)',
    backdrop: 'rgba(15, 16, 46, 0.92)',
    accent: '#A07CFF',
    accentSoft: 'rgba(160, 124, 255, 0.18)',
    button: ['#A07CFF', '#7C3AED'],
    ripple: 'rgba(167, 139, 250, 0.24)',
    bullet: '#CABDFF',
    badge: ['rgba(160, 124, 255, 0.85)', 'rgba(124, 58, 237, 0.78)'],
  },
};

const STOCK_PROGRESS = {
  low: 0.35,
  normal: 0.75,
};

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'fantasy-arc-box',
    title: '幻想 Arc 盲盒',
    subtitle: '含稀有掉落和必得皮肤奖励，适合快速补充奇遇资源。',
    tagline: '限定光谱掉落 · 10 连保底史诗',
    price: '9.9',
    currency: 'USDT',
    type: 'limited',
    tone: 'magenta',
    ctaLabel: '立即唤醒',
    highlight: '限时',
    countdown: '剩余 12 小时',
    stock: {
      label: '库存 42 / 100',
      level: 'low',
    },
    perks: ['稀有掉落概率 5%', '累计 10 次赠史诗皮肤', '追加霓虹粒子背景特效'],
  },
  {
    id: 'team-expansion',
    title: '团队拓展证',
    subtitle: '扩容团队人数上限，解锁进阶团本与训练计划。',
    tagline: '战队席位扩容 + 周度训练加成',
    price: '299',
    currency: 'USDT',
    type: 'subscription',
    tone: 'cyan',
    ctaLabel: '激活权益',
    highlight: '月度权益',
    perks: ['团队人数上限 +50%', '战斗收益 +10%', '专属团队任务线'],
  },
  {
    id: 'permanent-member',
    title: '永久会员',
    subtitle: '一次性解锁尊享特权，享受资源加成与专属奖励。',
    tagline: '一次升级 · 全局增益终身有效',
    price: '79',
    currency: 'USDT',
    type: 'permanent',
    tone: 'violet',
    ctaLabel: '立即升级',
    highlight: '热门',
    perks: ['专属霓虹头像框', '副本奖励 +20%', '每周盲盒补给'],
  },
  {
    id: 'shareholder-nft',
    title: '股东 NFT',
    subtitle: '稀缺治理凭证，绑定 DAO 投票与收益分红权益。',
    tagline: '治理投票 + 收益分红双通道',
    price: '1000',
    currency: 'USDT',
    type: 'nft',
    tone: 'amber',
    ctaLabel: '立即预定',
    highlight: '限量 200',
    stock: {
      label: '剩余 12 枚',
      level: 'low',
    },
    perks: ['协议收益分红 ≥12%', 'DAO 投票权 +3', '全新 3D 场景优先体验'],
  },
];

export const EventShopScreen = () => {
  const [filter, setFilter] = useState<ShopFilter>('all');

  const displayedItems = useMemo(() => {
    if (filter === 'all') {
      return SHOP_ITEMS;
    }
    return SHOP_ITEMS.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.heading}>活动商城</Text>
        <Text style={styles.subHeading}>
          限时特卖、订阅特权与传奇 NFT 汇集于此，留意倒计时和库存提示。
        </Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const selected = item.key === filter;
          return (
            <Pressable
              key={item.key}
              style={[styles.filterChip, selected && styles.filterChipActive]}
              android_ripple={{ color: 'rgba(96, 165, 250, 0.18)' }}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[styles.filterLabel, selected && styles.filterLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.cardList}>
        {displayedItems.map((item) => (
          <ShopCard key={item.id} item={item} />
        ))}
      </View>
    </ScreenContainer>
  );
};

type ShopCardProps = {
  item: ShopItem;
};

const ShopCard = ({ item }: ShopCardProps) => {
  const tone = TONE_PRESET[item.tone];
  const pulse = useNeonPulse({ duration: 5200 });
  const isLowStock = item.stock?.level === 'low';
  const countdownUrgent = Boolean(item.countdown && item.countdown.includes('剩余'));
  const ctaGlowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 0.85],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1.06],
        }),
      },
    ],
  };

  const stockProgress = item.stock ? STOCK_PROGRESS[item.stock.level] ?? 0.6 : 0.8;

  return (
    <LinearGradient
      colors={tone.shell}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardShell}
    >
      <View
        style={[
          styles.cardBody,
          {
            borderColor: tone.border,
            backgroundColor: tone.backdrop,
            shadowColor: tone.accent,
          },
        ]}
      >
        <LinearGradient
          colors={[tone.accentSoft, 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.cardHalo}
        />

        <View style={styles.cardHeader}>
          <View style={styles.cardTitleWrapper}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.highlight ? (
              <LinearGradient
                colors={tone.badge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardHighlight}
              >
                <Text style={styles.cardHighlightText}>{item.highlight}</Text>
              </LinearGradient>
            ) : null}
          </View>
          {item.countdown ? (
            <Text style={[styles.countdownText, countdownUrgent && styles.countdownTextDanger]}>
              {item.countdown}
            </Text>
          ) : null}
        </View>

        {item.tagline ? (
          <Text style={[styles.cardTagline, { color: tone.accent }]}>{item.tagline}</Text>
        ) : null}

        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceValue}>
              {item.price}
              <Text style={styles.priceCurrency}> {item.currency}</Text>
            </Text>
            <Text style={styles.priceHint}>
              {item.type === 'subscription' ? '月度结算' : '一次性结算'}
            </Text>
          </View>
          <Pressable style={styles.previewLink} android_ripple={{ color: tone.ripple }}>
            <Text style={[styles.previewText, { color: tone.accent }]}>权益详情</Text>
          </Pressable>
        </View>

        <View style={styles.perkList}>
          {item.perks.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <Text style={[styles.perkBullet, { color: tone.bullet }]}>✦</Text>
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        {item.stock ? (
          <View style={styles.stockWrapper}>
            <View style={styles.stockRow}>
              <Text style={[styles.stockLabel, isLowStock && styles.stockLabelWarning]}>
                {item.stock.label}
              </Text>
              {isLowStock ? (
                <Text style={styles.stockAlert}>库存告急</Text>
              ) : (
                <Text style={styles.stockSteady}>现货充足</Text>
              )}
            </View>
            <View style={styles.stockBar}>
              <View style={styles.stockBarTrack} />
              <View
                style={[
                  styles.stockBarFill,
                  { width: `${Math.round(stockProgress * 100)}%`, backgroundColor: tone.accent },
                ]}
              />
            </View>
          </View>
        ) : null}

        <Pressable style={styles.buyButtonShell} android_ripple={{ color: tone.ripple }}>
          <LinearGradient
            colors={tone.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buyButton}
          >
            <Animated.View
              style={[styles.buyButtonGlow, { backgroundColor: tone.accent }, ctaGlowStyle]}
            />
            <Text style={styles.buyButtonText}>{item.ctaLabel}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  heading: {
    color: '#F7FAFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subHeading: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(94, 106, 255, 0.26)',
    backgroundColor: 'rgba(18, 24, 50, 0.8)',
  },
  filterChipActive: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124, 92, 237, 0.28)',
    shadowColor: 'rgba(124, 92, 237, 0.6)',
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  filterLabel: {
    color: 'rgba(226, 231, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  cardList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  cardShell: {
    borderRadius: 26,
    padding: 2,
  },
  cardBody: {
    position: 'relative',
    borderRadius: 24,
    borderWidth: 1.2,
    padding: 20,
    gap: 18,
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 4,
  },
  cardHalo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardTitle: {
    color: '#F7FAFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardHighlightText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  countdownText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '600',
  },
  countdownTextDanger: {
    color: '#F97316',
  },
  cardTagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  cardSubtitle: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 13,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceBlock: {
    gap: 6,
  },
  priceValue: {
    color: '#F8FAFF',
    fontSize: 28,
    fontWeight: '700',
  },
  priceCurrency: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '700',
  },
  priceHint: {
    color: 'rgba(226, 231, 255, 0.64)',
    fontSize: 12,
  },
  previewLink: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(32, 52, 96, 0.36)',
  },
  previewText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  perkList: {
    gap: 10,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkBullet: {
    fontSize: 12,
  },
  perkText: {
    flex: 1,
    color: '#F7FAFF',
    fontSize: 13,
    lineHeight: 20,
  },
  stockWrapper: {
    gap: 8,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
  },
  stockLabelWarning: {
    color: '#F97316',
    fontWeight: '600',
  },
  stockAlert: {
    color: '#F97316',
    fontSize: 11,
    fontWeight: '600',
  },
  stockSteady: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '600',
  },
  stockBar: {
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(52, 62, 96, 0.6)',
  },
  stockBarTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  buyButtonShell: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  buyButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    opacity: 0.5,
  },
  buyButtonText: {
    color: '#F8FAFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
