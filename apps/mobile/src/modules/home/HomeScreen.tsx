import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
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
import { CARD_WIDTH, GUTTER, H_ASSET, H_BOX, H_SMALL, PRESS_SCALE, SIDE } from '@theme/metrics';

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
    subtitle: '实时查看全球指挥官排名',
    route: 'Leaderboard',
    borderColor: palette.magenta,
    glyph: 'leaderboard',
  },
  {
    key: 'Forge',
    title: '铸造坊',
    subtitle: '打造战备与模块',
    route: 'Forge',
    borderColor: palette.cyan,
    glyph: 'forge',
  },
  {
    key: 'Marketplace',
    title: '集市坊',
    subtitle: '交易 NFT 与素材',
    route: 'Marketplace',
    borderColor: palette.magenta,
    glyph: 'market',
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '限时兑换稀有补给',
    route: 'EventShop',
    borderColor: palette.violet,
    glyph: 'event',
  },
];

const BLIND_BOX_COPY = {
  label: '盲盒展示',
  title: '唤醒机甲 · 今日掉率提升 2 倍',
  desc: '进入 Unity 空间唤醒盲盒，奖励会自动结算，请保持指挥网络稳定。',
};

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
  const quickCardWidth = useMemo(
    () => Math.max(150, Math.floor((frameWidth - GUTTER) / 2)),
    [frameWidth],
  );
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
          <LinearGradient
            colors={['rgba(10, 8, 26, 0.92)', 'rgba(6, 4, 18, 0.88)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.cardBase, styles.assetCard, { width: frameWidth, minHeight: H_ASSET }]}
          >
            <View style={styles.cardEdge} />
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
                <Text style={styles.statusText}>指挥网络稳定</Text>
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
          </LinearGradient>
        </View>
      </View>

      <View style={[styles.quickGrid, { width: frameWidth }]}>
        {quickCards.map((card) => (
          <Pressable
            key={card.key}
            onPress={card.onPress}
            style={({ pressed }) => [
              styles.quickPressable,
              { width: quickCardWidth, height: H_SMALL },
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={[hexToRgba(card.borderColor, 0.22), 'rgba(8, 8, 22, 0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.cardBase,
                styles.quickCardBox,
                { width: quickCardWidth, height: H_SMALL },
              ]}
            >
              <View style={[styles.cardEdge, { borderColor: hexToRgba(card.borderColor, 0.5) }]} />
              <View style={styles.quickCardBody}>
                <QuickGlyph
                  id={card.glyph}
                  size={26}
                  strokeWidth={2}
                  colors={[card.borderColor, lightenHex(card.borderColor, 0.25)]}
                />
                <View style={styles.quickText}>
                  <Text style={styles.quickTitle} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.quickSubtitle} numberOfLines={2}>
                    {card.subtitle}
                  </Text>
                </View>
                <Text style={styles.quickChevron}>›</Text>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={[styles.sectionInner, { width: frameWidth }]}>
          <LinearGradient
            colors={['rgba(14, 6, 22, 0.88)', 'rgba(4, 3, 12, 0.82)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.cardBase, styles.blindBoxCard, { width: frameWidth, minHeight: H_BOX }]}
          >
            <View style={[styles.cardEdge, styles.blindBoxEdge]} />
            <View style={styles.blindBoxContent}>
              <View style={styles.blindBoxCopy}>
                <Text style={styles.blindBoxLabel}>{BLIND_BOX_COPY.label}</Text>
                <Text style={styles.blindBoxTitle} numberOfLines={1}>
                  {BLIND_BOX_COPY.title}
                </Text>
                <Text style={styles.blindBoxDesc} numberOfLines={2}>
                  {BLIND_BOX_COPY.desc}
                </Text>
              </View>
              <View style={styles.blindBoxFooter}>
                <QuickGlyph
                  id="blindbox"
                  size={54}
                  strokeWidth={2.3}
                  colors={[palette.violet, palette.cyan]}
                />
                <NeonButton
                  title="唤醒盲盒 · 200 Arc"
                  onPress={() => navigation.navigate('BlindBox')}
                />
              </View>
            </View>
          </LinearGradient>
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
      <View style={styles.resourceInfo}>
        <QuickGlyph id={glyph} size={18} strokeWidth={1.8} colors={[accent, secondary]} />
        <View>
          <Text style={[styles.resourceLabel, { color: accent }]}>{label}</Text>
          <Text style={styles.resourceMeta}>实时入账</Text>
        </View>
      </View>
      <View style={styles.resourceValueRow}>
        <Text style={styles.resourceValue} numberOfLines={1}>
          {value}
        </Text>
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
  cardBase: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  cardEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(120, 210, 255, 0.35)',
    opacity: 0.7,
  },
  assetCard: {
    paddingVertical: 20,
  },
  quickCardBox: {
    padding: 16,
    borderRadius: 20,
  },
  blindBoxCard: {
    padding: 24,
  },
  blindBoxEdge: {
    borderColor: 'rgba(255, 134, 255, 0.32)',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
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
    paddingHorizontal: 14,
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
    marginTop: 6,
  },
  resourceChip: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(8, 10, 24, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resourceMeta: {
    color: 'rgba(198, 214, 255, 0.65)',
    fontSize: 11,
    marginTop: 2,
  },
  resourceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resourceValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    maxWidth: 110,
    textAlign: 'right',
  },
  resourceUnit: {
    fontSize: 12,
    color: palette.sub,
    fontWeight: '500',
  },
  quickGrid: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: GUTTER,
    rowGap: GUTTER,
    marginBottom: 12,
    justifyContent: 'center',
  },
  quickPressable: {
    alignItems: 'stretch',
  },
  pressed: {
    transform: [{ scale: PRESS_SCALE }],
    opacity: 0.92,
  },
  quickCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    color: 'rgba(190, 210, 255, 0.78)',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  quickChevron: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 20,
    fontWeight: '600',
  },
  blindBoxContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 16,
  },
  blindBoxCopy: {
    maxWidth: '70%',
  },
  blindBoxLabel: {
    color: 'rgba(189, 200, 255, 0.7)',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  blindBoxTitle: {
    color: '#F4F6FF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  blindBoxDesc: {
    color: 'rgba(200, 208, 255, 0.78)',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
  blindBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
  },
});

export default HomeScreen;
