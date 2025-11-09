import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { ErrorState } from '@components/ErrorState';
import NeonButton from '@components/NeonButton';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import HomeBackground from '../../ui/HomeBackground';
import HomeSkeleton from './HomeSkeleton';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { HomeStackParamList } from '@app/navigation/types';
import { palette } from '@theme/colors';
import { spacing } from '@theme/tokens';
import { typography } from '@theme/typography';
import { CARD_WIDTH, GUTTER, H_ASSET, H_BOX, H_SMALL, PRESS_SCALE, SIDE } from '@theme/metrics';

type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

type QuickLink = {
  key: string;
  title: string;
  subtitle: string;
  route: keyof HomeStackParamList;
  borderColor: string;
  glyph: QuickGlyphId;
  background?: ImageSourcePropType;
  locked?: boolean;
  progressText?: string;
  lockLevel?: string;
};

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

const QUICK_LINKS: QuickLink[] = [
  {
    key: 'Leaderboard',
    title: '排行榜',
    subtitle: '实时查看全球指挥官排名',
    route: 'Leaderboard',
    borderColor: palette.accent,
    glyph: 'leaderboard',
    background: cardLeaderboard,
  },
  {
    key: 'Forge',
    title: '铸造坊',
    subtitle: '打造战备与模块',
    route: 'Forge',
    borderColor: palette.primary,
    glyph: 'forge',
    background: cardForge,
    locked: false,
  },
  {
    key: 'Marketplace',
    title: '集市坊',
    subtitle: '交易 NFT 与素材',
    route: 'Marketplace',
    borderColor: palette.accent,
    glyph: 'market',
    background: cardMarket,
    locked: false,
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '限时兑换稀有补给',
    route: 'EventShop',
    borderColor: palette.primary,
    glyph: 'event',
    background: cardEvent,
    locked: false,
  },
];
const BLIND_BOX_COPY = {
  label: '盲盒唤醒',
  title: '今日掉率提升',
  desc: '进入 Unity 空间唤醒盲盒，奖励自动结算。',
};

const glowTextureAlt = require('../../assets/glow_btn.png');
const cardCommandCenter = require('../../assets/cards/card_command_center.webp');
const cardLeaderboard = require('../../assets/cards/card_leaderboard.webp');
const cardForge = require('../../assets/cards/card_forge.webp');
const cardMarket = require('../../assets/cards/card_market.webp');
const cardEvent = require('../../assets/cards/card_event.webp');
const cardBlindbox = require('../../assets/cards/card_blindbox.webp');

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

  const displayName = data?.displayName ?? 'Pilot Zero';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const frameWidth = useMemo(
    () => Math.max(320, Math.min(CARD_WIDTH, windowWidth - spacing.pageHorizontal * 2)),
    [windowWidth],
  );

  const statusPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(statusPulse, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [statusPulse]);

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
        <HomeSkeleton />
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
          <NeonCard
            backgroundSource={cardCommandCenter}
            backgroundResizeMode="cover"
            backgroundStyle={styles.commandCenterBg}
            overlayColor="rgba(8, 12, 30, 0.42)"
            borderColors={['#FF5AE0', '#7DD3FC']}
            glowColor="#7DD3FC"
            contentPadding={20}
            style={{ width: frameWidth, minHeight: H_ASSET }}
          >
            <View pointerEvents="none" style={styles.commandOverlay} />
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
                <View style={styles.statusRow}>
                  <Animated.Text
                    style={[
                      styles.statusDot,
                      {
                        opacity: statusPulse.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }),
                        transform: [
                          {
                            scale: statusPulse.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.9, 1.05],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    ●
                  </Animated.Text>
                  <Text style={styles.statusText}>网络：稳定</Text>
                </View>
              </View>
            </View>
            <View style={styles.resourceRow}>
              <ResourceChip
                label="ARC"
                glyph="arc"
                value={arcAmount}
                unit="枚"
                accent={palette.primary}
              />
              <ResourceChip
                label="矿石"
                glyph="ore"
                value={oreAmount}
                unit="颗"
                accent={palette.accent}
              />
            </View>
          </NeonCard>
        </View>
      </View>

      <View style={[styles.quickGrid, { width: frameWidth }]}>
        {quickCards.map((card) => (
          <RipplePressable
            key={card.key}
            onPress={card.onPress}
            disabled={card.locked}
            rippleColor="rgba(255,255,255,0.18)"
            style={({ pressed }) => [
              styles.quickPressable,
              { width: quickCardWidth, height: H_SMALL },
              pressed && styles.pressed,
              card.locked && styles.lockedCard,
            ]}
          >
            <NeonCard
              backgroundSource={card.background ?? glowTextureAlt}
              backgroundResizeMode="cover"
              backgroundStyle={card.background ? styles.quickBg : undefined}
              overlayColor={card.background ? 'rgba(6, 10, 26, 0.3)' : 'rgba(3, 4, 14, 0.82)'}
              borderColors={[card.borderColor, lightenHex(card.borderColor, 0.35)]}
              glowColor={card.borderColor}
              contentPadding={16}
              style={[styles.quickCardBox, { width: quickCardWidth, height: H_SMALL }]}
            >
              {card.locked ? (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>{card.lockLevel ?? 'Lv2 解锁'}</Text>
                </View>
              ) : null}
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
              </View>
              {card.locked ? <LockProgress text={card.progressText ?? '待完成任务'} /> : null}
            </NeonCard>
          </RipplePressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={[styles.sectionInner, { width: frameWidth }]}>
          <NeonCard
            backgroundSource={cardBlindbox}
            overlayColor="rgba(6, 8, 22, 0.35)"
            borderColors={['#FF5AE0', '#7DD3FC']}
            glowColor="#FF5AE0"
            contentPadding={24}
            style={{ width: frameWidth, minHeight: H_BOX }}
          >
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
                  colors={[palette.accent, palette.primary]}
                />
                <NeonButton title="立刻唤醒" onPress={() => navigation.navigate('BlindBox')} />
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>200 ARC</Text>
                </View>
              </View>
            </View>
          </NeonCard>
        </View>
      </View>
    </ScreenContainer>
  );
};

const LockProgress = ({ text }: { text: string }) => {
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fill, { toValue: 1, duration: 5000, useNativeDriver: false }),
        Animated.timing(fill, { toValue: 0, duration: 5000, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fill]);

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['28%', '48%'] });

  return (
    <View style={styles.lockProgressContainer}>
      <View style={styles.lockProgressTrack}>
        <Animated.View style={[styles.lockProgressFill, { width }]} />
      </View>
      <Text style={styles.lockProgressText}>{text}</Text>
    </View>
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
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const valueAnimStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }),
    transform: [
      {
        scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }),
      },
    ],
  };

  return (
    <View style={[styles.resourceChip, { borderColor: accent, shadowColor: accent }]}>
      <View style={styles.resourceInfo}>
        <QuickGlyph id={glyph} size={18} strokeWidth={1.8} colors={[accent, secondary]} />
        <Text style={[styles.resourceLabel, { color: accent }]}>{label}</Text>
      </View>
      <View style={styles.resourceValueRow}>
        <Animated.View style={[styles.resourceValueWrapper, valueAnimStyle]}>
          <Text style={styles.resourceValue} numberOfLines={1}>
            {value}
          </Text>
        </Animated.View>
        <Text style={styles.resourceUnit}>{unit}</Text>
      </View>
    </View>
  );
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
  quickCardBox: {
    borderRadius: 20,
  },
  commandCenterBg: {
    transform: [{ translateY: -10 }, { scale: 1.1 }],
  },
  commandOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '45%',
    backgroundColor: 'rgba(5, 8, 18, 0.68)',
  },
  quickBg: {
    transform: [{ scale: 1.15 }],
    opacity: 0.9,
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
    ...typography.captionCaps,
    color: '#8CE7FF',
    textTransform: 'uppercase',
  },
  assetSubtitle: {
    ...typography.heading,
    color: palette.text,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    ...typography.captionCaps,
    color: '#45E2B4',
  },
  statusDot: {
    color: '#2EE36F',
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
    ...typography.captionCaps,
    letterSpacing: 0.4,
  },
  resourceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resourceValueWrapper: {
    minWidth: 0,
  },
  resourceValue: {
    ...typography.numeric,
    color: palette.text,
    maxWidth: 110,
    textAlign: 'right',
  },
  resourceUnit: {
    ...typography.captionCaps,
    color: palette.sub,
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
  lockedCard: {
    opacity: 0.78,
  },
  pressed: {
    transform: [{ scale: PRESS_SCALE }],
    opacity: 0.92,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(17, 21, 36, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  lockBadgeText: {
    ...typography.captionCaps,
    color: '#8A5CFF',
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
    ...typography.subtitle,
    color: '#F2F5FF',
  },
  quickSubtitle: {
    ...typography.body,
    color: 'rgba(190, 210, 255, 0.78)',
    marginTop: 2,
  },
  lockProgressContainer: {
    marginTop: 10,
  },
  lockProgressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  lockProgressFill: {
    backgroundColor: 'rgba(0, 209, 199, 0.6)',
  },
  lockProgressText: {
    ...typography.captionCaps,
    marginTop: 4,
    color: 'rgba(255,255,255,0.65)',
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
    ...typography.captionCaps,
    color: 'rgba(189, 200, 255, 0.7)',
  },
  blindBoxTitle: {
    ...typography.heading,
    color: '#F4F6FF',
    marginTop: 6,
  },
  blindBoxDesc: {
    ...typography.body,
    color: 'rgba(200, 208, 255, 0.78)',
    marginTop: 6,
    lineHeight: 20,
  },
  blindBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
  },
  priceBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(8,12,24,0.6)',
  },
  priceBadgeText: {
    ...typography.captionCaps,
    color: '#8A5CFF',
  },
});

export default HomeScreen;
