import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import ParallelogramPanel from '@components/ParallelogramPanel';
import NeonButton from '@components/NeonButton';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import HomeBackground from '../../ui/HomeBackground';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { HomeStackParamList } from '@app/navigation/types';
import { palette } from '@theme/colors';
import { spacing } from '@theme/tokens';
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
  glyph: QuickGlyphId;
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
    glyph: 'leaderboard',
  },
  {
    key: 'Forge',
    title: '铸造',
    subtitle: '凝铸装备与模块',
    route: 'Forge',
    borderColor: palette.cyan,
    glyph: 'forge',
  },
  {
    key: 'Marketplace',
    title: '集市',
    subtitle: '交易 NFT 与蓝图',
    route: 'Marketplace',
    borderColor: palette.magenta,
    glyph: 'market',
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '兑换限时补给',
    route: 'EventShop',
    borderColor: palette.violet,
    glyph: 'event',
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
  const { width: windowWidth } = useWindowDimensions();

  const displayName = data?.displayName ?? '指挥官';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const frameWidth = useMemo(
    () => Math.max(320, Math.min(CARD_WIDTH, windowWidth - spacing.pageHorizontal * 2)),
    [windowWidth],
  );

  const quickCards = useMemo(
    () =>
      QUICK_LINKS.map((link) => ({
        ...link,
        onPress: () => navigation.navigate(link.route),
      })),
    [navigation],
  );
  const quickCardWidth = useMemo(() => Math.max(150, (frameWidth - GUTTER) / 2), [frameWidth]);
  const cavernBackdrop = useMemo(() => <HomeBackground showVaporLayers />, []);

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
        <View style={[styles.sectionInner, { width: frameWidth }]}>
          <ParallelogramPanel
            width={frameWidth}
            height={H_ASSET}
            tiltDeg={TILT_ASSET}
            strokeColors={['#FF5AE0', '#7DD3FC']}
            fillColors={['rgba(18, 8, 32, 0.94)', 'rgba(12, 6, 24, 0.86)']}
            innerStrokeColors={['rgba(255,255,255,0.25)', 'rgba(122, 210, 255, 0.32)']}
            padding={20}
          >
            <View style={styles.assetHeader}>
              <View style={styles.identityBlock}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLabel}>{displayName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.assetText}>
                  <Text style={styles.assetTitle}>指挥中心</Text>
                  <Text style={styles.assetSubtitle} numberOfLines={1}>
                    {displayName}
                  </Text>
                </View>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>连接稳定</Text>
              </View>
            </View>
            <View style={styles.resourceRow}>
              <ResourceChip
                label="Arc"
                glyph="arc"
                value={arcAmount}
                unit="枚"
                accent={palette.magenta}
              />
              <ResourceChip
                label="矿石"
                glyph="ore"
                value={oreAmount}
                unit="颗"
                accent={palette.cyan}
              />
            </View>
          </ParallelogramPanel>
        </View>
      </View>

      <View style={[styles.quickGrid, { width: frameWidth }]}>
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
              <View style={styles.quickCardSurface}>
                <ParallelogramPanel
                  width={quickCardWidth}
                  height={H_SMALL}
                  tiltDeg={TILT_SMALL}
                  strokeColors={[card.borderColor, '#7DD3FC']}
                  innerStrokeColors={['rgba(255,255,255,0.25)', 'rgba(120,210,255,0.28)']}
                  fillColors={['rgba(6, 6, 20, 0.4)', 'rgba(4, 4, 12, 0.36)']}
                  padding={18}
                >
                  <View style={styles.quickCardContent}>
                    <LinearGradient
                      colors={[hexToRgba(card.borderColor, 0.12), 'rgba(8, 10, 22, 0.64)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickCardBackground}
                    />
                    <View style={[styles.quickGlow, { shadowColor: card.borderColor }]} />
                    <View style={styles.quickCardBody}>
                      <QuickGlyph
                        id={card.glyph}
                        size={26}
                        colors={[card.borderColor, lightenHex(card.borderColor, 0.25)]}
                      />
                      <View style={styles.quickText}>
                        <Text style={styles.quickTitle} numberOfLines={1}>
                          {card.title}
                        </Text>
                        <Text numberOfLines={1} style={styles.quickSubtitle}>
                          {card.subtitle}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ParallelogramPanel>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={[styles.sectionInner, { width: frameWidth }]}>
          <ParallelogramPanel
            width={frameWidth}
            height={H_BOX}
            tiltDeg={TILT_BOX}
            strokeColors={['#FF5AE0', '#7DD3FC']}
            innerStrokeColors={['rgba(255,255,255,0.22)', 'rgba(126, 208, 255, 0.28)']}
            fillColors={['rgba(12, 6, 20, 0.6)', 'rgba(8, 4, 16, 0.5)']}
            padding={20}
          >
            <View style={styles.blindBoxContent}>
              <View>
                <Text style={styles.blindBoxLabel}>盲盒展示</Text>
                <Text style={styles.blindBoxTitle} numberOfLines={1}>
                  觉醒方阵 · 今日加赠 2 次掉落
                </Text>
                <Text style={styles.blindBoxDesc} numberOfLines={2}>
                  进入 Unity 空间唤醒盲盒，奖励将自动结算进资产仓。
                </Text>
              </View>
              <View style={styles.blindBoxFooter}>
                <QuickGlyph
                  id="blindbox"
                  size={48}
                  strokeWidth={2.3}
                  colors={[palette.violet, palette.cyan]}
                />
                <NeonButton
                  title="唤醒盲盒 · 200 Arc"
                  onPress={() => navigation.navigate('BlindBox')}
                />
              </View>
            </View>
          </ParallelogramPanel>
        </View>
      </View>
    </ScreenContainer>
  );
};

const ResourceChip = ({
  label,
  glyph,
  value,
  unit,
  accent,
}: {
  label: string;
  glyph: QuickGlyphId;
  value: string;
  unit: string;
  accent: string;
}) => {
  const secondary = lightenHex(accent, 0.3);
  return (
    <View style={[styles.resourceChip, { borderColor: accent, shadowColor: accent }]}>
      <View style={styles.resourceChipHeader}>
        <QuickGlyph id={glyph} size={18} strokeWidth={1.7} colors={[accent, secondary]} />
        <Text style={[styles.resourceLabel, { color: accent }]}>{label}</Text>
      </View>
      <View style={styles.resourceValueRow}>
        <Text style={styles.resourceValue}>{value}</Text>
        <Text style={styles.resourceUnit}>{unit}</Text>
      </View>
    </View>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const lightenHex = (hex: string, amount = 0.2) => {
  const normalized = hex.replace('#', '');
  const rgb = [0, 1, 2].map((index) => parseInt(normalized.slice(index * 2, index * 2 + 2), 16));
  const lightened = rgb.map((channel) => Math.min(255, Math.round(channel * (1 + amount))));
  return `#${lightened.map((val) => val.toString(16).padStart(2, '0')).join('')}`;
};

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: SIDE,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionInner: {
    alignSelf: 'center',
  },
  assetFrame: {
    width: CARD_WIDTH,
    minHeight: H_ASSET,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  identityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarLabel: {
    color: palette.text,
    fontSize: 18,
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
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(8, 10, 24, 0.92)',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  resourceChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
    fontSize: 20,
    fontWeight: '700',
    flexShrink: 1,
  },
  resourceUnit: {
    fontSize: 13,
    color: palette.sub,
    fontWeight: '400',
  },
  quickGrid: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickPressable: {
    alignItems: 'stretch',
  },
  quickCardSurface: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    transform: [{ scale: PRESS_SCALE }],
    opacity: 0.9,
  },
  quickCardContent: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  quickCardBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    pointerEvents: 'none',
  },
  quickGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    opacity: 0.15,
    backgroundColor: '#9AFBFF',
    pointerEvents: 'none',
  },
  quickCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickText: {
    flex: 1,
    minWidth: 0,
  },
  quickTitle: {
    color: '#F2F5FF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  quickSubtitle: {
    color: 'rgba(190, 210, 255, 0.75)',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  blindBoxFrame: {
    width: CARD_WIDTH,
    minHeight: H_BOX,
  },
  blindBoxContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
    overflow: 'hidden',
  },
  blindBoxLabel: {
    color: 'rgba(189, 200, 255, 0.7)',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  blindBoxTitle: {
    color: '#F4F6FF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  blindBoxDesc: {
    color: 'rgba(200, 208, 255, 0.78)',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
    flexShrink: 1,
  },
  blindBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
});
