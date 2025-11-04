import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import TiltFrame from '@components/TiltFrame';
import NeonButton from '@components/NeonButton';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { HomeStackParamList } from '@app/navigation/types';
import { palette } from '@theme/colors';
import {
  CARD_WIDTH,
  GUTTER,
  H_ASSET,
  H_BOX,
  H_SMALL,
  PRESS_SCALE,
  SIDE,
  TILT_ASSET,
  TILT_BOX,
  TILT_SMALL,
} from '@theme/metrics';

type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

type QuickLink = {
  key: string;
  title: string;
  subtitle: string;
  route: keyof HomeStackParamList;
  borderColor: string;
  icon: any;
};

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

const QUICK_LINKS: QuickLink[] = [
  {
    key: 'Leaderboard',
    title: '排行榜',
    subtitle: '赛季与全服排名',
    route: 'Leaderboard',
    borderColor: palette.magenta,
    icon: require('../../assets/icons/trophy.png'),
  },
  {
    key: 'Forge',
    title: '铸造坊',
    subtitle: '强化装备/合成模块',
    route: 'Forge',
    borderColor: palette.cyan,
    icon: require('../../assets/icons/forge.png'),
  },
  {
    key: 'Marketplace',
    title: '集市坊',
    subtitle: '挂单 NFT 与稀有伙伴',
    route: 'Marketplace',
    borderColor: palette.magenta,
    icon: require('../../assets/icons/market.png'),
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '兑换赛季限定奖励',
    route: 'EventShop',
    borderColor: palette.violet,
    icon: require('../../assets/icons/gift.png'),
  },
];

const formatAssetAmount = (assets: ChainAsset[] | undefined, id: string): string => {
  const raw = assets?.find((asset) => asset.id === id)?.amount;
  if (!raw) {
    return '--';
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return raw;
  }
  return new Intl.NumberFormat('zh-CN').format(numeric);
};

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigation>();
  const { data, loading, error } = useAccountSummary();

  const displayName = data?.displayName ?? '指挥官';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);

  const quickCards = useMemo(
    () =>
      QUICK_LINKS.map((link) => ({
        ...link,
        onPress: () => navigation.navigate(link.route),
      })),
    [navigation],
  );

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="指挥中心正在唤醒…" />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <View style={styles.centerBox}>
          <ErrorState title="暂时无法连接指挥网络" description={error} onRetry={() => dispatch(loadAccountSummary())} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette>
      <View style={styles.section}>
        <TiltFrame tiltDeg={TILT_ASSET} borderColor={palette.magenta} style={styles.assetFrame}>
          <View style={styles.assetHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLabel}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.assetText}>
              <Text style={styles.assetTitle}>指挥中心</Text>
              <Text style={styles.assetSubtitle}>{displayName}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>连接稳定</Text>
            </View>
          </View>
          <View style={styles.resourceRow}>
            <ResourceChip label="Arc" value={arcAmount} unit="枚" accent={palette.magenta} />
            <ResourceChip label="矿石" value={oreAmount} unit="颗" accent={palette.cyan} />
          </View>
        </TiltFrame>
      </View>

      <View style={styles.quickGrid}>
        {quickCards.map((card) => (
          <Pressable
            key={card.key}
            onPress={card.onPress}
            style={({ pressed }) => [styles.quickPressable, pressed && styles.pressed]}
          >
            <TiltFrame
              tiltDeg={TILT_SMALL}
              borderColor={card.borderColor}
              style={[styles.quickCard, { height: H_SMALL }]}
            >
              <View style={styles.quickCardBody}>
                <Image source={card.icon} style={styles.quickIcon} />
                <View style={styles.quickText}>
                  <Text style={styles.quickTitle}>{card.title}</Text>
                  <Text numberOfLines={1} style={styles.quickSubtitle}>
                    {card.subtitle}
                  </Text>
                </View>
              </View>
            </TiltFrame>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <TiltFrame tiltDeg={TILT_BOX} borderColor={palette.violet} style={styles.blindBoxFrame}>
          <View style={styles.blindBoxContent}>
            <View>
              <Text style={styles.blindBoxLabel}>盲盒展示</Text>
              <Text style={styles.blindBoxTitle}>霓虹立方 · 今日剩余 2 次机会</Text>
              <Text style={styles.blindBoxDesc}>进入 Unity 空间开盒，所得奖励将自动发放至钱包与仓库。</Text>
            </View>
            <View style={styles.blindBoxFooter}>
              <Image source={require('../../assets/icons/cube.png')} style={styles.blindBoxIcon} />
              <NeonButton title="打开盲盒（100 Arc）" onPress={() => navigation.navigate('BlindBox')} />
            </View>
          </View>
        </TiltFrame>
      </View>
    </ScreenContainer>
  );
};

const ResourceChip = ({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
}) => (
  <View style={[styles.resourceChip, { borderColor: accent }]}>
    <Text style={[styles.resourceLabel, { color: accent }]}>{label}</Text>
    <Text style={styles.resourceValue}>
      {value}
      <Text style={styles.resourceUnit}> {unit}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: SIDE,
    marginBottom: 16,
  },
  assetFrame: {
    width: CARD_WIDTH,
    minHeight: H_ASSET,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarLabel: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
  },
  assetText: {
    flex: 1,
    marginLeft: 14,
  },
  assetTitle: {
    color: palette.sub,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  assetSubtitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(59, 222, 185, 0.6)',
    backgroundColor: 'rgba(59, 222, 185, 0.12)',
  },
  statusText: {
    color: '#45E2B4',
    fontSize: 12,
    fontWeight: '600',
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(12, 14, 34, 0.9)',
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resourceValue: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  resourceUnit: {
    fontSize: 12,
    color: palette.sub,
    fontWeight: '400',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GUTTER,
    paddingHorizontal: SIDE,
    marginBottom: 4,
  },
  quickPressable: {
    width: (CARD_WIDTH - GUTTER) / 2,
  },
  pressed: {
    transform: [{ scale: PRESS_SCALE }],
    opacity: 0.9,
  },
  quickCard: {
    width: '100%',
  },
  quickCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickIcon: {
    width: 28,
    height: 28,
    tintColor: '#BDE1FF',
  },
  quickText: {
    marginLeft: 10,
    flex: 1,
  },
  quickTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  quickSubtitle: {
    color: palette.sub,
    fontSize: 12,
    marginTop: 4,
  },
  blindBoxFrame: {
    width: CARD_WIDTH,
    minHeight: H_BOX,
  },
  blindBoxContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
  },
  blindBoxLabel: {
    color: palette.sub,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  blindBoxTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  blindBoxDesc: {
    color: palette.sub,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
  blindBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  blindBoxIcon: {
    width: 50,
    height: 50,
    tintColor: palette.cyan,
  },
});
