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
  const heroPulseSecondary = useNeonPulse({ duration: 7200 });
  const blindBoxPulse = useNeonPulse({ duration: 6800 });

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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh-CN' ? 'en-US' : 'zh-CN'));
  };

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
          colors={['rgba(78, 48, 173, 0.26)', 'rgba(27, 122, 255, 0.18)']}
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
                minOpacity: 0.22,
                maxOpacity: 0.52,
                minScale: 0.85,
                maxScale: 1.2,
              }),
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroAuraSecondary,
              getGlowStyle({
                animated: heroPulseSecondary,
                minOpacity: 0.12,
                maxOpacity: 0.35,
                minScale: 0.72,
                maxScale: 1.3,
              }),
            ]}
          />
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.avatarAura,
                  getGlowStyle({
                    animated: heroPulsePrimary,
                    minOpacity: 0.28,
                    maxOpacity: 0.55,
                    minScale: 0.9,
                    maxScale: 1.1,
                  }),
                ]}
              />
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
          <Text style={styles.statusChip}>{copy.hero.statusOnline}</Text>
          <View style={styles.heroResourceRow}>
            <ResourceBadge
              label={copy.hero.arcLabel}
              value={arcAmount}
              description={copy.hero.arcDescription}
              accent="#B678FF"
            />
            <ResourceBadge
              label={copy.hero.oreLabel}
              value={oreAmount}
              description={copy.hero.oreDescription}
              accent="#66FFD5"
            />
          </View>
        </LinearGradient>

        <View style={styles.quickGrid}>
          {quickLinks.map(({ key, accent, text }) => (
            <QuickLinkCard
              key={key}
              title={text.title}
              description={text.description}
              accent={accent}
              onPress={() => navigation.navigate(key)}
            />
          ))}
        </View>

        <BlindBoxShowcase
          status={unityStatus}
          pulse={blindBoxPulse}
          copy={copy.blindbox}
        />
      </View>
    </ScreenContainer>
  );
};

const ResourceBadge = ({
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
    colors={[`${accent}33`, 'rgba(8, 10, 32, 0.95)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.resourceBadge}
  >
    <Text style={styles.resourceLabel}>{label}</Text>
    <Text style={styles.resourceValue}>{value}</Text>
    <Text style={styles.resourceDesc}>{description}</Text>
  </LinearGradient>
);

type QuickLinkCardProps = {
  title: string;
  description: string;
  accent: string;
  onPress: () => void;
};

const QuickLinkCard = ({ title, description, accent, onPress }: QuickLinkCardProps) => (
  <Pressable style={({ pressed }) => [styles.quickCard, pressed && styles.quickCardPressed]} onPress={onPress}>
    <LinearGradient
      colors={[`${accent}2A`, `${accent}88`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickGradient}
    >
      <View style={[styles.quickAccent, { backgroundColor: accent }]} />
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDesc}>{description}</Text>
      <Text style={styles.quickAction}>进入</Text>
    </LinearGradient>
  </Pressable>
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
      colors={['rgba(124, 66, 220, 0.18)', 'rgba(58, 126, 255, 0.16)']}
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
              maxOpacity: 0.4,
              minScale: 0.85,
              maxScale: 1.2,
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
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(87, 58, 185, 0.5)',
    backgroundColor: 'rgba(10, 11, 30, 0.88)',
    overflow: 'hidden',
  },
  heroAuraPrimary: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    top: -40,
    right: -20,
    backgroundColor: neonPalette.glowPink,
  },
  heroAuraSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    bottom: -60,
    left: -30,
    backgroundColor: neonPalette.glowCyan,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarAura: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    left: -8,
    top: -8,
    backgroundColor: 'rgba(90, 225, 255, 0.55)',
  },
  avatarBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(156, 125, 255, 0.75)',
    backgroundColor: 'rgba(8, 10, 32, 0.95)',
  },
  avatarInitial: {
    color: '#F8F5FF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroTitleGroup: {
    gap: 4,
  },
  heroTitle: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(121, 98, 255, 0.6)',
    backgroundColor: 'rgba(14, 16, 38, 0.78)',
  },
  languageLabel: {
    color: '#F3ECFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusChip: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(123, 47, 247, 0.25)',
    color: '#ECE6FF',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  heroResourceRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  resourceBadge: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(82, 62, 198, 0.5)',
    backgroundColor: 'rgba(10, 11, 32, 0.92)',
    gap: 4,
  },
  resourceLabel: {
    color: 'rgba(236, 241, 255, 0.74)',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  resourceValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  resourceDesc: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 11,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  quickCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64, 38, 128, 0.45)',
    backgroundColor: 'rgba(9, 10, 28, 0.88)',
  },
  quickCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  quickGradient: {
    padding: 14,
    gap: 10,
  },
  quickAccent: {
    width: 42,
    height: 6,
    borderRadius: 4,
  },
  quickTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  quickDesc: {
    color: 'rgba(236, 241, 255, 0.72)',
    fontSize: 11,
    lineHeight: 16,
  },
  quickAction: {
    color: '#F7E9FF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  blindBoxCard: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(70, 46, 120, 0.4)',
    backgroundColor: 'rgba(8, 9, 26, 0.92)',
    marginBottom: 4,
  },
  blindBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(62, 42, 115, 0.35)',
  },
  blindBoxTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  blindBoxSubtitle: {
    color: 'rgba(236, 241, 255, 0.76)',
    fontSize: 11,
    marginTop: 4,
  },
  blindBoxButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FF5ECE',
  },
  blindBoxButtonText: {
    color: '#17021F',
    fontSize: 14,
    fontWeight: '700',
  },
  blindBoxViewport: {
    height: 168,
    backgroundColor: 'rgba(6, 8, 24, 0.92)',
  },
  unitySurface: {
    flex: 1,
  },
  blindBoxAura: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: neonPalette.glowPurple,
    alignSelf: 'center',
    top: -30,
  },
  blindBoxFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7, 9, 26, 0.78)',
    gap: 6,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fallbackDesc: {
    color: 'rgba(236, 241, 255, 0.74)',
    fontSize: 11,
  },
  blindBoxFooter: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 4,
    borderTopWidth: 1,
    borderColor: 'rgba(62, 42, 115, 0.35)',
  },
  blindBoxHint: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 11,
  },
});
