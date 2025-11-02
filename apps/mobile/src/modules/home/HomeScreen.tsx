import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { HomeStackParamList } from '@app/navigation/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';
import { UnityStatus, useUnityBridge } from '@bridge/useUnityBridge';
import { UnityView } from '@bridge/UnityView';
import { NeonPressable } from '@components/NeonPressable';
import { QuickGlyph } from '@components/icons/QuickGlyph';
import { designTokens } from '@theme/designTokens';

type LocaleKey = 'zh-CN' | 'en-US';
type QuickLinkKey = 'Leaderboard' | 'Forge' | 'Marketplace' | 'EventShop';

const quickLinkOrder: QuickLinkKey[] = [
  'Leaderboard',
  'Forge',
  'Marketplace',
  'EventShop',
];

const localeCopy: Record<
  LocaleKey,
  {
    languageLabel: string;
    hero: {
      title: string;
      subtitle: string;
      statusOnline: string;
      arcLabel: string;
      arcDescription: string;
      oreLabel: string;
      oreDescription: string;
    };
    quickLinks: Record<QuickLinkKey, { title: string; description: string }>;
    blindbox: {
      title: string;
      hints: string[];
      status: Record<UnityStatus, string>;
      cta: { ready: string; other: string };
      fallbackTitle: string;
      fallbackDesc: string;
    };
  }
> = {
  'zh-CN': {
    languageLabel: '中文',
    hero: {
      title: '指挥中心',
      subtitle: '欢迎回到霓虹链域',
      statusOnline: '指挥网络已连接',
      arcLabel: 'Arc 能量',
      arcDescription: '核心能源储备',
      oreLabel: '矿石',
      oreDescription: '锻造与升级材料',
    },
    quickLinks: {
      Leaderboard: {
        title: '排行榜',
        description: '查看赛季荣誉与全球排行',
      },
      Forge: {
        title: '铸造坊',
        description: '合成模块，强化装备',
      },
      Marketplace: {
        title: '集市',
        description: '交易 NFT 与稀有道具',
      },
      EventShop: {
        title: '活动商城',
        description: '兑换赛季限定与礼包',
      },
    },
    blindbox: {
      title: '盲盒展示',
      hints: ['最新掉落：幻彩装甲 · 稀有', '累计开启 12 次 · 史诗奖励 ×3'],
      status: {
        ready: '盲盒场景已上线，随时开启',
        initializing: '唤醒盲盒场景中...',
        idle: '等待唤醒盲盒场景',
        error: '盲盒引擎未响应，请稍后重试',
      },
      cta: { ready: '开启盲盒', other: '唤醒盲盒' },
      fallbackTitle: '盲盒动画准备中',
      fallbackDesc: '即将唤醒 3D 场景，请稍候',
    },
  },
  'en-US': {
    languageLabel: 'EN',
    hero: {
      title: 'Command Center',
      subtitle: 'Welcome back to Neon Realm',
      statusOnline: 'Link established',
      arcLabel: 'Arc',
      arcDescription: 'Primary energy reserve',
      oreLabel: 'Ore',
      oreDescription: 'Forging & upgrade material',
    },
    quickLinks: {
      Leaderboard: {
        title: 'Leaderboards',
        description: 'Track season glory and global ranking',
      },
      Forge: {
        title: 'Forge',
        description: 'Craft modules and upgrade gear',
      },
      Marketplace: {
        title: 'Market Hub',
        description: 'Trade NFTs and rare companions',
      },
      EventShop: {
        title: 'Event Mall',
        description: 'Redeem seasonal exclusives',
      },
    },
    blindbox: {
      title: 'Blind Box Spotlight',
      hints: ['Latest drop: Prism Armor · Rare', '12 opened · 3 epic rewards'],
      status: {
        ready: '3D scene online, unlock your reward now',
        initializing: 'Booting blind box scene...',
        idle: 'Awaiting blind box activation',
        error: 'Blind box engine offline, please retry later',
      },
      cta: { ready: 'Open Now', other: 'Wake Scene' },
      fallbackTitle: 'Blind box warming up',
      fallbackDesc: '3D animation will appear shortly',
    },
  },
};

const findAssetAmount = (assets: ChainAsset[] | undefined, id: string) =>
  assets?.find((asset) => asset.id === id)?.amount ?? '--';

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data, loading, error } = useAccountSummary();
  const [language, setLanguage] = useState<LocaleKey>('zh-CN');

  const copy = localeCopy[language];

  const quickLinks = useMemo(
    () =>
      quickLinkOrder.map((key) => ({
        key,
        accent:
          key === 'Leaderboard'
            ? '#B778FF'
            : key === 'Forge'
            ? '#59D9FF'
            : key === 'Marketplace'
            ? '#66FFBC'
            : '#FFC267',
        text: copy.quickLinks[key],
      })),
    [copy],
  );

  const arcAmount = useMemo(
    () => findAssetAmount(data?.tokens, 'tok-energy'),
    [data?.tokens],
  );
  const oreAmount = useMemo(
    () => findAssetAmount(data?.tokens, 'tok-neon'),
    [data?.tokens],
  );

  const playerInitial = data?.displayName?.charAt(0).toUpperCase() ?? 'P';

  const heroPulsePrimary = useNeonPulse({ duration: 5200 });
  const heroPulseSecondary = useNeonPulse({ duration: 7400 });
  const blindBoxPulse = useNeonPulse({ duration: 6400 });

  const {
    status: unityStatus,
    bootstrapUnity,
    requestScene,
  } = useUnityBridge({
    defaultSceneName: 'BlindBoxShowcase',
  });

  useEffect(() => {
    if (unityStatus === 'idle') {
      bootstrapUnity('BlindBoxShowcase').catch(() => null);
    } else if (unityStatus === 'ready') {
      requestScene('BlindBoxShowcase');
    }
  }, [bootstrapUnity, requestScene, unityStatus]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'zh-CN' ? 'en-US' : 'zh-CN'));
  const handleBlindBoxCta = useCallback(() => {
    if (unityStatus === 'ready') {
      requestScene('BlindBoxShowcase');
    } else {
      bootstrapUnity('BlindBoxShowcase').catch(() => null);
    }
  }, [bootstrapUnity, requestScene, unityStatus]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="指挥中心正在加载..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
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
    <ScreenContainer>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(78, 48, 173, 0.28)', 'rgba(19, 121, 255, 0.18)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroAuraPrimary,
              getGlowStyle({
                animated: heroPulsePrimary,
                minOpacity: 0.18,
                maxOpacity: 0.48,
                minScale: 0.88,
                maxScale: 1.22,
              }),
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroAuraSecondary,
              getGlowStyle({
                animated: heroPulseSecondary,
                minOpacity: 0.1,
                maxOpacity: 0.28,
                minScale: 0.75,
                maxScale: 1.35,
              }),
            ]}
          />
          <View style={styles.heroTopRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarInitial}>{playerInitial}</Text>
              </View>
              <View style={styles.heroTitleGroup}>
                <Text style={styles.heroTitle}>{copy.hero.title}</Text>
                <Text style={styles.heroSubtitle}>{copy.hero.subtitle}</Text>
              </View>
            </View>
            <Pressable style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageLabel}>{copy.languageLabel}</Text>
            </Pressable>
          </View>
          <View style={styles.resourceChipRow}>
            <ResourceChip
              label={copy.hero.arcLabel}
              value={arcAmount}
              description={copy.hero.arcDescription}
              accent="#A874FF"
            />
            <ResourceChip
              label={copy.hero.oreLabel}
              value={oreAmount}
              description={copy.hero.oreDescription}
              accent="#59FFD0"
            />
          </View>
          <Text style={styles.statusChip}>{copy.hero.statusOnline}</Text>
        </LinearGradient>

        <View style={styles.quickGrid}>
          {quickLinks.map(({ key, accent, text }) => (
            <QuickLinkCard
              key={key}
              title={text.title}
              description={text.description}
              accent={accent}
              iconType={key}
              onPress={() => navigation.navigate(key)}
            />
          ))}
        </View>

        <BlindBoxShowcase
          status={unityStatus}
          pulse={blindBoxPulse}
          copy={copy.blindbox}
          onPress={handleBlindBoxCta}
        />
      </View>
    </ScreenContainer>
  );
};

const ResourceChip = ({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: string;
  description: string;
  accent: string;
}) => (
  <LinearGradient
    colors={[`${accent}33`, 'rgba(10, 11, 32, 0.95)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.resourceChip}
  >
    <View style={styles.resourceChipHeader}>
      <View style={styles.resourceChipLabelRow}>
        <View style={[styles.resourceChipDot, { backgroundColor: accent }]} />
        <Text style={styles.resourceLabel}>{label}</Text>
      </View>
      <Text style={styles.resourceValue}>{value}</Text>
    </View>
    <Text style={styles.resourceDesc}>{description}</Text>
  </LinearGradient>
);

type QuickLinkCardProps = {
  title: string;
  description: string;
  accent: string;
  iconType: QuickLinkKey;
  onPress: () => void;
};

const QuickLinkCard = ({
  title,
  description,
  accent,
  iconType,
  onPress,
}: QuickLinkCardProps) => (
  <NeonPressable style={styles.quickCard} onPress={onPress}>
    <LinearGradient
      colors={[`${accent}26`, `${accent}80`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickGradient}
    >
      <View style={styles.quickHeader}>
        <View style={[styles.quickIconBadge, { borderColor: `${accent}80` }]}>
          <QuickGlyph type={iconType} accent={accent} />
        </View>
        <Text style={styles.quickChevron}>›</Text>
      </View>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDesc}>{description}</Text>
    </LinearGradient>
  </NeonPressable>
);

type BlindBoxCopy = (typeof localeCopy)[LocaleKey]['blindbox'];

type BlindBoxShowcaseProps = {
  status: UnityStatus;
  pulse: Animated.Value;
  copy: BlindBoxCopy;
  onPress: () => void;
};

const BlindBoxShowcase = ({
  status,
  pulse,
  copy,
  onPress,
}: BlindBoxShowcaseProps) => {
  const statusText = copy.status[status];
  const ctaLabel = status === 'ready' ? copy.cta.ready : copy.cta.other;
  const isBooting = status === 'initializing';

  return (
    <LinearGradient
      colors={['rgba(118, 60, 214, 0.18)', 'rgba(48, 118, 255, 0.16)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.blindBoxCard}
    >
      <View style={styles.blindBoxHeader}>
        <View>
          <Text style={styles.blindBoxTitle}>{copy.title}</Text>
          <Text style={styles.blindBoxSubtitle}>{statusText}</Text>
        </View>
        <NeonPressable
          style={[
            styles.blindBoxButton,
            isBooting && styles.blindBoxButtonDisabled,
          ]}
          onPress={onPress}
          disabled={isBooting}
        >
          <Text style={styles.blindBoxButtonText}>{ctaLabel}</Text>
        </NeonPressable>
      </View>
      <View style={styles.blindBoxViewport}>
        <UnityView style={styles.unitySurface} />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.blindBoxAura,
            getGlowStyle({
              animated: pulse,
              minOpacity: 0.16,
              maxOpacity: 0.38,
              minScale: 0.85,
              maxScale: 1.18,
            }),
          ]}
        />
        {status !== 'ready' && (
          <View style={styles.blindBoxFallback}>
            <Text style={styles.fallbackTitle}>{copy.fallbackTitle}</Text>
            <Text style={styles.fallbackDesc}>{copy.fallbackDesc}</Text>
          </View>
        )}
      </View>
      <View style={styles.blindBoxFooter}>
        {copy.hints.map((hint) => (
          <Text key={hint} style={styles.blindBoxHint}>
            {hint}
          </Text>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: designTokens.radii.xl,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(92, 62, 188, 0.55)',
    backgroundColor: designTokens.colors.card,
    overflow: 'hidden',
  },
  heroAuraPrimary: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    top: -26,
    right: -12,
    backgroundColor: neonPalette.glowPink,
  },
  heroAuraSecondary: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -48,
    left: -16,
    backgroundColor: neonPalette.glowCyan,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(152, 128, 255, 0.75)',
    backgroundColor: 'rgba(8, 10, 33, 0.95)',
  },
  avatarInitial: {
    color: '#F9F7FF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroTitleGroup: {
    gap: 4,
  },
  heroTitle: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  languageButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(122, 100, 255, 0.65)',
    backgroundColor: 'rgba(14, 16, 38, 0.82)',
  },
  languageLabel: {
    color: '#F3ECFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  resourceChipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  resourceChip: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(90, 66, 182, 0.48)',
    backgroundColor: designTokens.colors.card,
    gap: designTokens.spacing.xs,
  },
  resourceChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceChipLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  resourceChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resourceLabel: {
    color: designTokens.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  resourceValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  resourceDesc: {
    color: designTokens.colors.textMuted,
    fontSize: 11,
    paddingLeft: designTokens.spacing.md,
  },
  statusChip: {
    marginTop: designTokens.spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.radii.sm,
    backgroundColor: 'rgba(126, 50, 240, 0.24)',
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.label,
    letterSpacing: 0.6,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: designTokens.spacing.xs,
    marginBottom: designTokens.spacing.md,
  },
  quickCard: {
    width: '48%',
  },
  quickGradient: {
    borderRadius: designTokens.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(92, 68, 176, 0.35)',
    padding: designTokens.spacing.md,
    gap: designTokens.spacing.xs,
    backgroundColor: 'rgba(12, 14, 30, 0.92)',
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.sm,
  },
  quickIconBadge: {
    width: 40,
    height: 40,
    borderRadius: designTokens.radii.md,
    borderWidth: 1.5,
    borderColor: 'rgba(92, 68, 176, 0.45)',
    backgroundColor: 'rgba(15, 17, 38, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChevron: {
    color: designTokens.colors.textSecondary,
    fontSize: 22,
    fontWeight: '600',
  },
  quickTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  quickDesc: {
    color: designTokens.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  blindBoxCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(62, 42, 130, 0.4)',
    backgroundColor: 'rgba(8, 9, 26, 0.94)',
  },
  blindBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: 'rgba(56, 38, 118, 0.35)',
  },
  blindBoxTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  blindBoxSubtitle: {
    color: 'rgba(236, 241, 255, 0.78)',
    fontSize: 10.5,
    marginTop: 4,
  },
  blindBoxButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FF5BD0',
  },
  blindBoxButtonDisabled: {
    backgroundColor: 'rgba(255, 91, 208, 0.45)',
  },
  blindBoxButtonText: {
    color: '#17021F',
    fontSize: 13,
    fontWeight: '700',
  },
  blindBoxViewport: {
    height: 126,
    backgroundColor: 'rgba(6, 8, 24, 0.92)',
  },
  unitySurface: {
    flex: 1,
  },
  blindBoxAura: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    top: -20,
    backgroundColor: neonPalette.glowPurple,
  },
  blindBoxFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 8, 24, 0.76)',
    gap: 4,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fallbackDesc: {
    color: 'rgba(236, 241, 255, 0.72)',
    fontSize: 11,
  },
  blindBoxFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    borderTopWidth: 1,
    borderColor: 'rgba(56, 38, 118, 0.35)',
  },
  blindBoxHint: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 11,
  },
});
