import React, { useEffect, useMemo, useState } from 'react';
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

type LocaleKey = 'zh-CN' | 'en-US';
type QuickLinkKey = 'Leaderboard' | 'Forge' | 'Marketplace' | 'EventShop';

const quickLinkOrder: QuickLinkKey[] = ['Leaderboard', 'Forge', 'Marketplace', 'EventShop'];

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
      arcLabel: 'Arc',
      arcDescription: '核心能源储备',
      oreLabel: '矿石',
      oreDescription: '锻造与升级材料',
    },
    quickLinks: {
      Leaderboard: {
        title: '排行榜',
        description: '查看赛季荣誉与全球排名',
      },
      Forge: {
        title: '铸造坊',
        description: '合成模块，强化装备',
      },
      Marketplace: {
        title: '集市坊',
        description: '交易 NFT 与稀有伙伴',
      },
      EventShop: {
        title: '活动商城',
        description: '兑换赛季限定与礼盒',
      },
    },
    blindbox: {
      title: '盲盒展示',
      hints: ['最新掉落：幻彩装甲 · 稀有', '累计开启 12 次 · 史诗奖励 x3'],
      status: {
        ready: '盲盒场景已加载，等待指挥官开启',
        initializing: '唤醒盲盒场景中...',
        idle: '等待唤醒盲盒场景',
        error: '盲盒引擎未响应，请稍后重试',
      },
      cta: { ready: '立即开启', other: '唤醒盲盒' },
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
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
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

  const toggleLanguage = () => setLanguage((prev) => (prev === 'zh-CN' ? 'en-US' : 'zh-CN'));

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

        <BlindBoxShowcase status={unityStatus} pulse={blindBoxPulse} copy={copy.blindbox} />
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

const QuickLinkCard = ({ title, description, accent, iconType, onPress }: QuickLinkCardProps) => (
  <Pressable style={({ pressed }) => [styles.quickCard, pressed && styles.quickCardPressed]} onPress={onPress}>
    <LinearGradient
      colors={[`${accent}26`, `${accent}80`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickGradient}
    >
      <QuickLinkIcon type={iconType} accent={accent} />
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDesc}>{description}</Text>
      <Text style={styles.quickAction}>进入</Text>
    </LinearGradient>
  </Pressable>
);

const QuickLinkIcon = ({ type, accent }: { type: QuickLinkKey; accent: string }) => (
  <View style={styles.iconWrap}>
    {type === 'Leaderboard' && (
      <>
        <View style={[styles.iconTrophyCup, { borderColor: accent }]} />
        <View style={[styles.iconTrophyStem, { backgroundColor: accent }]} />
      </>
    )}
    {type === 'Forge' && (
      <>
        <View style={[styles.iconHammerHead, { backgroundColor: accent }]} />
        <View style={[styles.iconHammerHandle, { backgroundColor: accent }]} />
      </>
    )}
    {type === 'Marketplace' && (
      <>
        <View style={[styles.iconTag, { borderColor: accent }]} />
        <View style={[styles.iconTagHole, { borderColor: accent }]} />
      </>
    )}
    {type === 'EventShop' && (
      <>
        <View style={[styles.iconGiftLid, { backgroundColor: accent }]} />
        <View style={[styles.iconGiftBox, { borderColor: accent }]} />
      </>
    )}
  </View>
);

type BlindBoxCopy = (typeof localeCopy)[LocaleKey]['blindbox'];

type BlindBoxShowcaseProps = {
  status: UnityStatus;
  pulse: Animated.Value;
  copy: BlindBoxCopy;
};

const BlindBoxShowcase = ({ status, pulse, copy }: BlindBoxShowcaseProps) => {
  const statusText = copy.status[status];
  const ctaLabel = status === 'ready' ? copy.cta.ready : copy.cta.other;

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
        <Pressable style={styles.blindBoxButton}>
          <Text style={styles.blindBoxButtonText}>{ctaLabel}</Text>
        </Pressable>
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
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(92, 62, 188, 0.55)',
    backgroundColor: 'rgba(8, 10, 30, 0.9)',
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(88, 64, 180, 0.45)',
    backgroundColor: 'rgba(10, 11, 32, 0.92)',
    gap: 4,
  },
  resourceChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceChipLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resourceChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  resourceLabel: {
    color: 'rgba(236, 241, 255, 0.78)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  resourceValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resourceDesc: {
    color: 'rgba(236, 241, 255, 0.6)',
    fontSize: 9,
    letterSpacing: 0.3,
    paddingLeft: 12,
  },
  statusChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(126, 50, 240, 0.24)',
    color: '#ECE6FF',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  quickCard: {
    width: '46%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(60, 36, 125, 0.45)',
    backgroundColor: 'rgba(9, 10, 28, 0.9)',
  },
  quickCardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  quickGradient: {
    padding: 9,
    gap: 5,
    minHeight: 86,
  },
  quickTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quickDesc: {
    color: 'rgba(236, 241, 255, 0.75)',
    fontSize: 10.5,
    lineHeight: 15,
  },
  quickAction: {
    color: '#F7E9FF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  iconWrap: {
    width: 28,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTrophyCup: {
    width: 22,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderTopWidth: 3,
  },
  iconTrophyStem: {
    width: 8,
    height: 6,
    borderRadius: 2,
    marginTop: -2,
  },
  iconHammerHead: {
    width: 18,
    height: 6,
    borderRadius: 3,
  },
  iconHammerHandle: {
    width: 4,
    height: 12,
    borderRadius: 3,
    marginTop: 2,
  },
  iconTag: {
    width: 18,
    height: 12,
    borderRadius: 4,
    borderWidth: 2,
    transform: [{ rotate: '-12deg' }],
  },
  iconTagHole: {
    width: 5,
    height: 5,
    borderRadius: 3,
    borderWidth: 2,
    position: 'absolute',
    top: 4,
    right: 6,
  },
  iconGiftLid: {
    width: 18,
    height: 4,
    borderRadius: 2,
  },
  iconGiftBox: {
    width: 18,
    height: 10,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 2,
  },
  blindBoxCard: {
    borderRadius: 22,
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
  blindBoxButtonText: {
    color: '#17021F',
    fontSize: 13,
    fontWeight: '700',
  },
  blindBoxViewport: {
    height: 138,
    backgroundColor: 'rgba(6, 8, 24, 0.92)',
  },
  unitySurface: {
    flex: 1,
  },
  blindBoxAura: {
    position: 'absolute',
    width: 164,
    height: 164,
    borderRadius: 82,
    alignSelf: 'center',
    top: -28,
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
