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
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { HomeStackParamList } from '@app/navigation/types';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';
import { UnityView } from '@bridge/UnityView';
import { UnityStatus, useUnityBridge } from '@bridge/useUnityBridge';

type LocaleKey = 'zh-CN' | 'en-US';

type QuickLinkKey = 'Leaderboard' | 'Forge' | 'Marketplace' | 'EventShop';

const quickLinkOrder: QuickLinkKey[] = ['Leaderboard', 'Forge', 'Marketplace', 'EventShop'];

const localeCopy: Record<
  LocaleKey,
  {
    languageLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    statusOnline: string;
    arcLabel: string;
    arcDescription: string;
    oreLabel: string;
    oreDescription: string;
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
    heroTitle: '指挥中心',
    heroSubtitle: '欢迎回到霓虹链域',
    statusOnline: '指挥网络已连接',
    arcLabel: 'Arc',
    arcDescription: '核心能源储备',
    oreLabel: '矿石',
    oreDescription: '锻造与升级材料',
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
    heroTitle: 'Command Center',
    heroSubtitle: 'Welcome back to Neon Realm',
    statusOnline: 'Link established',
    arcLabel: 'Arc',
    arcDescription: 'Primary energy reserve',
    oreLabel: 'Ore',
    oreDescription: 'Forging & upgrade material',
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
            ? '#AD6DFF'
            : key === 'Forge'
            ? '#47D6FF'
            : key === 'Marketplace'
            ? '#63FFAF'
            : '#FFA85C',
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

  const heroPulse = useNeonPulse({ duration: 5200 });
  const resourcePulse = useNeonPulse({ duration: 6400 });
  const blindBoxPulse = useNeonPulse({ duration: 7200 });

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
          <LoadingPlaceholder label="指挥中心数据加载中..." />
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
          colors={['rgba(69, 43, 173, 0.24)', 'rgba(29, 121, 255, 0.16)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Animated.View
            style={[styles.heroGlow, getGlowStyle({ animated: heroPulse, minOpacity: 0.18, maxOpacity: 0.45 })]}
            pointerEvents="none"
          />
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.avatarGlow,
                  getGlowStyle({ animated: heroPulse, minScale: 0.92, maxScale: 1.08, minOpacity: 0.25, maxOpacity: 0.55 }),
                ]}
              />
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarInitial}>{playerInitial}</Text>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.heroTitle}>{copy.heroTitle}</Text>
                <Text style={styles.heroSubtitle}>{copy.heroSubtitle}</Text>
              </View>
            </View>
            <Pressable style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageLabel}>{copy.languageLabel}</Text>
            </Pressable>
          </View>
          <Text style={styles.statusChip}>{copy.statusOnline}</Text>
        </LinearGradient>

        <Animated.View
          style={[
            styles.resourceStrip,
            getGlowStyle({ animated: resourcePulse, minOpacity: 0.15, maxOpacity: 0.4, minScale: 0.97, maxScale: 1.03 }),
          ]}
        >
          <ResourceChip label={copy.arcLabel} value={arcAmount} description={copy.arcDescription} />
          <ResourceChip label={copy.oreLabel} value={oreAmount} description={copy.oreDescription} />
        </Animated.View>

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

type ResourceChipProps = {
  label: string;
  value: string;
  description: string;
};

const ResourceChip = ({ label, value, description }: ResourceChipProps) => (
  <View style={styles.resourceChip}>
    <Text style={styles.resourceLabel}>{label}</Text>
    <Text style={styles.resourceValue}>{value}</Text>
    <Text style={styles.resourceDesc}>{description}</Text>
  </View>
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
      colors={[`${accent}33`, `${accent}99`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickCardGradient}
    >
      <View style={[styles.quickAccent, { backgroundColor: accent }]} />
      <Text style={styles.quickCardTitle}>{title}</Text>
      <Text style={styles.quickCardDesc}>{description}</Text>
      <Text style={styles.quickCardAction}>进入</Text>
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
      colors={['rgba(112, 58, 210, 0.16)', 'rgba(28, 125, 255, 0.18)']}
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
            styles.blindBoxGlow,
            getGlowStyle({ animated: pulse, minOpacity: 0.12, maxOpacity: 0.4, minScale: 0.9, maxScale: 1.2 }),
          ]}
        />
        {status !== 'ready' && (
          <View style={styles.unityFallback}>
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
    gap: 20,
    padding: 20,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(87, 54, 185, 0.45)',
    backgroundColor: 'rgba(8, 10, 27, 0.85)',
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -40,
    right: -30,
    backgroundColor: neonPalette.glowPink,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarGlow: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    left: -10,
    top: -10,
    backgroundColor: neonPalette.glowCyan,
  },
  avatarBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(147, 119, 255, 0.7)',
    backgroundColor: 'rgba(10, 12, 30, 0.95)',
  },
  avatarInitial: {
    color: '#F9F6FF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  profileText: {
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
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(110, 82, 255, 0.6)',
    backgroundColor: 'rgba(12, 14, 32, 0.82)',
  },
  languageLabel: {
    color: '#F3ECFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusChip: {
    marginTop: 18,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(123, 47, 247, 0.25)',
    color: '#EDE7FF',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  resourceStrip: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(90, 110, 255, 0.2)',
    backgroundColor: 'rgba(8, 10, 30, 0.82)',
    gap: 16,
  },
  resourceChip: {
    flex: 1,
    gap: 6,
  },
  resourceLabel: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 13,
    letterSpacing: 1,
  },
  resourceValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  resourceDesc: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  quickCard: {
    width: '48%',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(55, 33, 115, 0.45)',
    backgroundColor: 'rgba(9, 11, 32, 0.82)',
  },
  quickCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  quickCardGradient: {
    padding: 18,
    gap: 12,
  },
  quickAccent: {
    width: 46,
    height: 6,
    borderRadius: 4,
  },
  quickCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickCardDesc: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
    lineHeight: 18,
  },
  quickCardAction: {
    color: '#F6E5FF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  blindBoxCard: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(70, 46, 120, 0.4)',
    backgroundColor: 'rgba(9, 10, 29, 0.9)',
  },
  blindBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(60, 36, 120, 0.35)',
  },
  blindBoxTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  blindBoxSubtitle: {
    color: 'rgba(236, 241, 255, 0.75)',
    fontSize: 12,
    marginTop: 6,
    maxWidth: 220,
  },
  blindBoxButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FF61D0',
  },
  blindBoxButtonText: {
    color: '#17021F',
    fontSize: 15,
    fontWeight: '700',
  },
  blindBoxViewport: {
    height: 220,
    backgroundColor: 'rgba(6, 8, 24, 0.92)',
  },
  unitySurface: {
    flex: 1,
  },
  blindBoxGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    alignSelf: 'center',
    top: -40,
    backgroundColor: neonPalette.glowPurple,
  },
  unityFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 8, 24, 0.78)',
    gap: 6,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  fallbackDesc: {
    color: 'rgba(236, 241, 255, 0.75)',
    fontSize: 12,
  },
  blindBoxFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 4,
    borderTopWidth: 1,
    borderColor: 'rgba(60, 36, 120, 0.35)',
  },
  blindBoxHint: {
    color: 'rgba(236, 241, 255, 0.68)',
    fontSize: 12,
  },
});
