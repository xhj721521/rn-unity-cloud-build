import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';

type LimitedOffer = {
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

const LIMITED_OFFERS: LimitedOffer[] = [
  {
    id: 'vip-pass',
    title: '永久会员',
    subtitle: '解锁全平台特权与每周空投池',
    price: '79',
    currency: 'USDT',
    cadence: '一次性购买',
    endsIn: '剩余 48 小时',
    highlight: '推荐',
    perks: ['专属霓虹主题与身份标识', '专享任务倍率 +20%', '每周链上奖励空投'],
    gradient: ['rgba(255, 106, 213, 0.45)', 'rgba(34, 18, 68, 0.95)'],
  },
  {
    id: 'shareholder-nft',
    title: '股东 NFT',
    subtitle: '限量治理凭证，享受利润分红',
    price: '1000',
    currency: 'USDT',
    cadence: '一次性铸造',
    endsIn: '剩余 3 天 12 小时',
    highlight: '限量 200 枚',
    perks: ['季度利润按持仓比例分红', 'DAO 治理投票权 +3', '优先体验全新 3D 剧情卡'],
    gradient: ['rgba(63, 242, 255, 0.38)', 'rgba(18, 29, 74, 0.94)'],
  },
  {
    id: 'fantasy-arc-box',
    title: '幻想 Arc 盲盒',
    subtitle: '赛博潮玩造型，含史诗概率',
    price: '9.9',
    currency: 'USDT',
    cadence: '单次开盒',
    endsIn: '剩余 12 小时',
    perks: ['100% 获得限时皮肤或饰品', '5% 概率掉落传奇级别宠物', '累积 10 次必出史诗奖励'],
    gradient: ['rgba(140, 114, 255, 0.45)', 'rgba(28, 16, 62, 0.95)'],
  },
  {
    id: 'team-expansion',
    title: '团队一级开拓证',
    subtitle: '拓展战队上限，激活高级分润',
    price: '299',
    currency: 'USDT',
    cadence: '月度订阅',
    endsIn: '剩余 1 天 6 小时',
    perks: ['团队人数上限 +50%', '团队战绩分润 +10%', '解锁团队专属联合作战副本'],
    gradient: ['rgba(255, 200, 97, 0.42)', 'rgba(40, 22, 70, 0.92)'],
  },
];

export const EventShopScreen = () => {
  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>活动商城</Text>
      <Text style={styles.subHeading}>限时特供的核心资产，请在倒计时结束前锁定你的权益。</Text>

      <View style={styles.offerList}>
        {LIMITED_OFFERS.map((offer) => (
          <LimitedOfferCard key={offer.id} offer={offer} />
        ))}
      </View>
    </ScreenContainer>
  );
};

const LimitedOfferCard = ({ offer }: { offer: LimitedOffer }) => {
  const pulse = useNeonPulse({ duration: 5200 });

  return (
    <LinearGradient
      colors={offer.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.offerShell}
    >
      <View style={styles.offerCard}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.offerGlow,
            getGlowStyle({
              animated: pulse,
              minOpacity: 0.12,
              maxOpacity: 0.28,
              minScale: 0.9,
              maxScale: 1.15,
            }),
          ]}
        />
        <View style={styles.offerHeader}>
          <View style={styles.offerTitleGroup}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            {offer.highlight ? (
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>{offer.highlight}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.offerTimer}>{offer.endsIn}</Text>
        </View>
        <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>

        <View style={styles.offerPriceRow}>
          <Text style={styles.offerPrice}>
            <Text style={styles.offerPriceCurrency}>{offer.currency}</Text>
            {` ${offer.price}`}
          </Text>
          <Text style={styles.offerCadence}>{offer.cadence}</Text>
        </View>

        <View style={styles.perkList}>
          {offer.perks.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <View style={styles.perkBullet} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.offerButton, pressed ? styles.offerButtonPressed : null]}
        >
          <Text style={styles.offerButtonLabel}>立即购买</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: neonPalette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  subHeading: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },
  offerList: {
    gap: 18,
    paddingBottom: 24,
  },
  offerShell: {
    borderRadius: 24,
    padding: 1,
    borderWidth: 1,
    borderColor: 'rgba(96, 58, 162, 0.55)',
  },
  offerCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 23,
    padding: 20,
    backgroundColor: 'rgba(10, 11, 32, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(58, 36, 118, 0.55)',
    gap: 16,
  },
  offerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 23,
    backgroundColor: neonPalette.glowPurple,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  offerTitle: {
    color: neonPalette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  offerTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 106, 213, 0.2)',
    borderWidth: 1,
    borderColor: neonPalette.accentMagenta,
  },
  offerTagText: {
    color: neonPalette.accentMagenta,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  offerTimer: {
    color: neonPalette.accentAmber,
    fontSize: 13,
    fontWeight: '600',
  },
  offerSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  offerPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  offerPrice: {
    color: neonPalette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  offerPriceCurrency: {
    color: neonPalette.accentCyan,
    fontSize: 16,
    fontWeight: '700',
  },
  offerCadence: {
    color: neonPalette.textSecondary,
    fontSize: 12,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: neonPalette.accentCyan,
  },
  perkText: {
    color: neonPalette.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  offerButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: neonPalette.accentMagenta,
  },
  offerButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  offerButtonLabel: {
    color: '#170624',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
