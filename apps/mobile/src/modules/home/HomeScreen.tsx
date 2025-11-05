import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import ParallelogramPanel from '@components/ParallelogramPanel';
import NeonButton from '@components/NeonButton';
import { CyberCavernBackdrop } from '../../ui/CyberCavernBackdrop';
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
    subtitle: '与全服指挥官实时比拼',
    route: 'Leaderboard',
    borderColor: palette.magenta,
    icon: require('../../assets/icons/trophy.png'),
  },
  {
    key: 'Forge',
    title: '铸造',
    subtitle: '凝铸装备与模块',
    route: 'Forge',
    borderColor: palette.cyan,
    icon: require('../../assets/icons/forge.png'),
  },
  {
    key: 'Marketplace',
    title: '集市',
    subtitle: '交易 NFT 与蓝图',
    route: 'Marketplace',
    borderColor: palette.magenta,
    icon: require('../../assets/icons/market.png'),
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '兑换限时补给',
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
  const quickCardWidth = useMemo(() => (CARD_WIDTH - GUTTER) / 2, []);
  const cavernBackdrop = useMemo(() => <CyberCavernBackdrop />, []);

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette background={cavernBackdrop}>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="指挥中心正在唤醒…" />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer variant="plain" edgeVignette background={cavernBackdrop}>
        <View style={styles.centerBox}>
          <ErrorState
            title="暂时无法连接指挥网络"
            description={error}
            onRetry={() => dispatch(loadAccountSummary())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={cavernBackdrop}>
      <View style={styles.section}>
        <ParallelogramPanel
          width={CARD_WIDTH}
          height={H_ASSET}
          tiltDeg={TILT_ASSET}
          strokeColors={['#FF5AE0', '#7DD3FC']}
          fillColors={['rgba(18, 8, 32, 0.94)', 'rgba(12, 6, 24, 0.86)']}
        >
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
        </ParallelogramPanel>
      </View>

      <View style={styles.quickGrid}>
        {quickCards.map((card, index) => {
          const isRightColumn = index % 2 === 1;
          return (
            <Pressable
              key={card.key}
              onPress={card.onPress}
              style={({ pressed }) => [
                styles.quickPressable,
                {
                  width: quickCardWidth,
                  height: H_SMALL,
                  marginRight: isRightColumn ? 0 : GUTTER,
                  marginBottom: GUTTER,
                },
                pressed && styles.pressed,
              ]}
            >
              <ParallelogramPanel
                width={quickCardWidth}
                height={H_SMALL}
                tiltDeg={TILT_SMALL}
                strokeColors={[card.borderColor, '#7DD3FC']}
                fillColors={['rgba(10, 5, 18, 0.95)', 'rgba(16, 10, 26, 0.86)']}
                padding={18}
              >
                <View style={styles.quickCardBody}>
                  <Image source={card.icon} style={styles.quickIcon} />
                  <View style={styles.quickText}>
                    <Text style={styles.quickTitle} numberOfLines={1}>
                      {card.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.quickSubtitle}>
                      {card.subtitle}
                    </Text>
                  </View>
                </View>
              </ParallelogramPanel>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <ParallelogramPanel
          width={CARD_WIDTH}
          height={H_BOX}
          tiltDeg={TILT_BOX}
          strokeColors={['#FF5AE0', '#7DD3FC']}
          fillColors={['rgba(15, 4, 24, 0.94)', 'rgba(9, 7, 20, 0.88)']}
        >
          <View style={styles.blindBoxContent}>
            <View>
              <Text style={styles.blindBoxLabel}>盲盒展示</Text>
              <Text style={styles.blindBoxTitle}>觉醒方阵 · 今日加赠 2 次掉落</Text>
              <Text style={styles.blindBoxDesc}>
                进入 Unity 空间唤醒盲盒，奖励将自动结算进资产仓。
              </Text>
            </View>
            <View style={styles.blindBoxFooter}>
              <Image source={require('../../assets/icons/cube.png')} style={styles.blindBoxIcon} />
              <NeonButton
                title="唤醒盲盒 · 200 Arc"
                onPress={() => navigation.navigate('BlindBox')}
              />
            </View>
          </View>
        </ParallelogramPanel>
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
  <View style={[styles.resourceChip, { borderColor: accent, shadowColor: accent }]}>
    <View style={styles.resourceChipHeader}>
      <View style={[styles.resourceDot, { backgroundColor: accent }]} />
      <Text style={[styles.resourceLabel, { color: accent }]}>{label}</Text>
    </View>
    <View style={styles.resourceValueRow}>
      <Text style={styles.resourceValue}>{value}</Text>
      <Text style={styles.resourceUnit}>{unit}</Text>
    </View>
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
    marginTop: 8,
  },
  resourceChip: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(8, 10, 24, 0.92)',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  resourceChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resourceDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  resourceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resourceValue: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
  },
  resourceUnit: {
    fontSize: 13,
    color: palette.sub,
    fontWeight: '400',
  },
  quickGrid: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickPressable: {
    alignItems: 'stretch',
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
