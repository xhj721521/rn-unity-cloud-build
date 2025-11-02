import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

const PING_URL = 'https://rpc.ankr.com/polygon';
const NETWORK_NAME = '主网';
const PARTICLE_COUNT = 8;
const LOADING_DOTS = [0, 1, 2];

type LocaleKey = 'zh-CN' | 'en-US';
type QuickLinkKey = 'Leaderboard' | 'Forge' | 'Marketplace' | 'EventShop';
type NetworkState = 'online' | 'unstable' | 'connecting' | 'offline';

type QuickLinkTheme = {
  accent: string;
  gradient: [string, string];
};

const QUICK_LINK_THEMES: Record<QuickLinkKey, QuickLinkTheme> = {
  Leaderboard: {
    accent: '#8DB1FF',
    gradient: ['rgba(102, 126, 255, 0.36)', 'rgba(61, 92, 200, 0.52)'],
  },
  Forge: {
    accent: '#59E1C5',
    gradient: ['rgba(65, 220, 190, 0.24)', 'rgba(39, 110, 130, 0.52)'],
  },
  Marketplace: {
    accent: '#5BC9FF',
    gradient: ['rgba(64, 170, 255, 0.26)', 'rgba(33, 90, 170, 0.5)'],
  },
  EventShop: {
    accent: '#B08CFF',
    gradient: ['rgba(138, 102, 255, 0.3)', 'rgba(76, 54, 160, 0.54)'],
  },
};

const quickLinkOrder: QuickLinkKey[] = [
  'Leaderboard',
  'Forge',
  'Marketplace',
  'EventShop',
];

const localeCopy: Record<
  LocaleKey,
  {
    hero: {
      title: string;
      subtitle: string;
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
    hero: {
      title: '指挥中心',
      subtitle: '欢迎回到霓虹链域',
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
        description: '兑换赛季限定与礼盒',
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
    hero: {
      title: 'Command Center',
      subtitle: 'Welcome back to Neon Realm',
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

const statusCopy: Record<
  NetworkState,
  {
    label: string;
    dot: string;
  }
> = {
  online: { label: '已连接', dot: '#34D399' },
  unstable: { label: '连接不稳定', dot: '#FCD34D' },
  connecting: { label: '正在连接', dot: '#F87171' },
  offline: { label: '未连接', dot: '#F87171' },
};

type NetworkStatusChipProps = {
  status: NetworkState;
  latency: number | null;
  networkName: string;
};

type ResourceChipProps = {
  label: string;
  description: string;
  value: string;
  accent: string;
};

type QuickLinkCardProps = {
  title: string;
  description: string;
  accent: string;
  gradient: [string, string];
  iconType: QuickLinkKey;
  onPress: () => void;
};

type BlindBoxCopy = (typeof localeCopy)[LocaleKey]['blindbox'];

type BlindBoxShowcaseProps = {
  status: UnityStatus;
  copy: BlindBoxCopy;
  onPress: () => void;
};

type ParticleParams = {
  translateY: Animated.Value;
  opacity: Animated.Value;
  size: number;
  left: number;
  duration: number;
  color: string;
  delay: number;
  controller?: Animated.CompositeAnimation;
};

type ParticleFieldProps = {
  count: number;
};

type OuterFrameProps = {
  children: React.ReactNode;
};

const findAssetAmount = (assets: ChainAsset[] | undefined, id: string) =>
  assets?.find((asset) => asset.id === id)?.amount ?? '--';

const useNetworkHeartbeat = (url: string) => {
  const [state, setState] = useState<{
    status: NetworkState;
    latency: number | null;
  }>({ status: 'connecting', latency: null });

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | undefined;
    let controller: AbortController | undefined;

    const evaluateStatus = (latency: number | null, ok: boolean) => {
      if (!ok) {
        return { status: 'offline' as NetworkState, latency: null };
      }
      if (latency === null) {
        return { status: 'connecting' as NetworkState, latency: null };
      }
      if (latency <= 800) {
        return { status: 'online' as NetworkState, latency };
      }
      return { status: 'unstable' as NetworkState, latency };
    };

    const ping = async () => {
      controller?.abort();
      controller = new AbortController();
      const started = Date.now();
      try {
        const timeout = setTimeout(() => controller?.abort(), 3000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const latency = Date.now() - started;
        if (isMounted) {
          setState(evaluateStatus(latency, response.ok));
        }
      } catch (error) {
        if (isMounted) {
          setState({ status: 'offline', latency: null });
        }
      }
    };

    ping();
    timer = setInterval(ping, 5000);

    return () => {
      isMounted = false;
      controller?.abort();
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [url]);

  return state;
};

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data, loading, error } = useAccountSummary();
  const [language] = useState<LocaleKey>('zh-CN');
  const copy = localeCopy[language];
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
  const network = useNetworkHeartbeat(PING_URL);

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

  const handleBlindBoxCta = useCallback(() => {
    if (unityStatus === 'ready') {
      requestScene('BlindBoxShowcase');
    } else {
      bootstrapUnity('BlindBoxShowcase').catch(() => null);
    }
  }, [bootstrapUnity, requestScene, unityStatus]);

  const quickLinks = useMemo(
    () =>
      quickLinkOrder.map((key) => ({
        key,
        text: copy.quickLinks[key],
        theme: QUICK_LINK_THEMES[key],
      })),
    [copy],
  );

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="指挥中心正在加载中..." />
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
    <ScreenContainer scrollable>
      <OuterFrame>
        <View style={styles.pageContent}>
          <View style={styles.heroCard}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.heroAuraPrimary,
                getGlowStyle({
                  animated: heroPulsePrimary,
                  minOpacity: 0.08,
                  maxOpacity: 0.18,
                  minScale: 0.88,
                  maxScale: 1.12,
                }),
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.heroAuraSecondary,
                getGlowStyle({
                  animated: heroPulseSecondary,
                  minOpacity: 0.05,
                  maxOpacity: 0.12,
                  minScale: 0.78,
                  maxScale: 1.18,
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
              <NetworkStatusChip
                status={network.status}
                latency={network.latency}
                networkName={NETWORK_NAME}
              />
            </View>
            <View style={styles.resourceRow}>
              <ResourceChip
                label={copy.hero.arcLabel}
                description={copy.hero.arcDescription}
                value={arcAmount}
                accent="#7D8BFF"
              />
              <ResourceChip
                label={copy.hero.oreLabel}
                description={copy.hero.oreDescription}
                value={oreAmount}
                accent="#59E1C5"
              />
            </View>
          </View>

          <View style={styles.quickGrid}>
            {quickLinks.map(({ key, text, theme }) => (
              <QuickLinkCard
                key={key}
                title={text.title}
                description={text.description}
                accent={theme.accent}
                gradient={theme.gradient}
                iconType={key}
                onPress={() => navigation.navigate(key)}
              />
            ))}
          </View>

          <BlindBoxShowcase
            status={unityStatus}
            copy={copy.blindbox}
            onPress={handleBlindBoxCta}
          />
        </View>
      </OuterFrame>
    </ScreenContainer>
  );
};

const NetworkStatusChip = ({
  status,
  latency,
  networkName,
}: NetworkStatusChipProps) => {
  const pulse = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    animationRef.current?.stop();
    pulse.setValue(0);
    opacity.setValue(status === 'offline' || status === 'connecting' ? 1 : 0.7);

    if (status === 'online' || status === 'unstable') {
      const duration = status === 'online' ? 1800 : 2400;
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      animationRef.current.start();
    } else {
      const blink = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);
      animationRef.current = Animated.loop(blink);
      animationRef.current.start();
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [opacity, pulse, status]);

  const config = statusCopy[status];
  const label = latency
    ? `${config.label} · ${latency}ms · ${networkName}`
    : `${config.label} · ${networkName}`;

  return (
    <View style={styles.networkChip}>
      <Animated.View
        style={[
          styles.networkDot,
          {
            backgroundColor: config.dot,
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.18],
                }),
              },
            ],
            opacity,
          },
        ]}
      />
      <Text style={styles.networkLabel}>{label}</Text>
    </View>
  );
};

const ResourceChip = ({
  label,
  description,
  value,
  accent,
}: ResourceChipProps) => (
  <LinearGradient
    colors={[`${accent}33`, 'rgba(12, 14, 32, 0.88)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.resourceChip}
  >
    <View style={styles.resourceChipHeader}>
      <View style={styles.resourceChipLeft}>
        <View style={[styles.resourceChipDot, { backgroundColor: accent }]} />
        <Text style={styles.resourceLabel}>{label}</Text>
      </View>
      <Text style={styles.resourceValue}>{value}</Text>
    </View>
    <Text style={styles.resourceDesc}>{description}</Text>
  </LinearGradient>
);

const QuickLinkCard = ({
  title,
  description,
  accent,
  gradient,
  iconType,
  onPress,
}: QuickLinkCardProps) => (
  <NeonPressable style={styles.quickCardPressable} onPress={onPress}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickCard}
    >
      <View style={styles.quickCardHeader}>
        <QuickGlyph type={iconType} accent={accent} />
        <Text style={styles.quickCardChevron}>›</Text>
      </View>
      <Text style={styles.quickCardTitle}>{title}</Text>
      <Text style={styles.quickCardDesc}>{description}</Text>
    </LinearGradient>
  </NeonPressable>
);

const BlindBoxShowcase = ({ status, copy, onPress }: BlindBoxShowcaseProps) => {
  const ambient = useRef(new Animated.Value(0)).current;
  const specular = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ambient, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(specular, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(specular, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [ambient, specular]);

  const statusText = copy.status[status];
  const ctaLabel = status === 'ready' ? copy.cta.ready : copy.cta.other;
  const isBooting = status === 'initializing';

  return (
    <View style={styles.blindBoxContainer}>
      <LinearGradient
        colors={['rgba(64, 145, 255, 0.16)', 'rgba(40, 78, 132, 0.22)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blindBoxPrimary}
      >
        <View style={styles.blindBoxHeaderRow}>
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
          <Animated.View
            pointerEvents="none"
            style={[
              styles.blindBoxAmbient,
              {
                opacity: ambient.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.14, 0.22],
                }),
                transform: [
                  {
                    scale: ambient.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1.08],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.blindBoxSpecular,
              {
                opacity: specular.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.08, 0.18],
                }),
              },
            ]}
          />
          <UnityView style={styles.unitySurface} />
          <ParticleField count={PARTICLE_COUNT} />
          {status !== 'ready' && (
            <View style={styles.blindBoxFallback}>
              <Text style={styles.fallbackTitle}>{copy.fallbackTitle}</Text>
              <Text style={styles.fallbackDesc}>{copy.fallbackDesc}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <LinearGradient
        colors={['rgba(54, 70, 120, 0.5)', 'rgba(26, 34, 66, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blindBoxSecondary}
      >
        <View style={styles.secondaryContent}>
          <LoadingDots />
          <View style={styles.secondaryText}>
            {copy.hints.map((hint) => (
              <Text key={hint} style={styles.blindBoxHint}>
                {hint}
              </Text>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const ParticleField = ({ count }: ParticleFieldProps) => {
  const particles = useMemo<ParticleParams[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        size: 2 + Math.random() * 1.5,
        left: 16 + Math.random() * 112,
        duration: 2000 + Math.random() * 1600,
        color: Math.random() > 0.5 ? '#5BE1C5' : '#9B4DFF',
        delay: index * 120,
      })),
    [count],
  );

  useEffect(() => {
    particles.forEach((particle) => {
      const run = () => {
        particle.translateY.setValue(40);
        particle.opacity.setValue(0);
        const ascent = Animated.parallel([
          Animated.timing(particle.translateY, {
            toValue: -40,
            duration: particle.duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.18,
              duration: particle.duration * 0.35,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: particle.duration * 0.65,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]);
        particle.controller = Animated.loop(
          Animated.sequence([Animated.delay(particle.delay), ascent]),
        );
        particle.controller.start();
      };
      run();
    });

    return () => {
      particles.forEach((particle) => particle.controller?.stop());
    };
  }, [particles]);

  return (
    <View style={styles.particleLayer} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              left: particle.left,
              transform: [{ translateY: particle.translateY }],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const LoadingDots = () => {
  const animated = useMemo(
    () => LOADING_DOTS.map(() => new Animated.Value(0)),
    [],
  );

  useEffect(() => {
    const controllers = animated.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start(),
    );

    return () => {
      controllers.forEach((controller) => controller?.stop?.());
    };
  }, [animated]);

  return (
    <View style={styles.dotsWrapper}>
      {animated.map((value, index) => (
        <Animated.View
          key={`dot-${index}`}
          style={[
            styles.dot,
            {
              opacity: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.15, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const OuterFrame = ({ children }: OuterFrameProps) => {
  const borderPulse = useRef(new Animated.Value(0)).current;
  const scanProgress = useRef(new Animated.Value(0)).current;
  const [frameHeight, setFrameHeight] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderPulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(borderPulse, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [borderPulse]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanProgress, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [scanProgress]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setFrameHeight(event.nativeEvent.layout.height);
  }, []);

  const borderOpacity = borderPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.14, 0.22],
  });

  const glowOpacity = borderPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.16],
  });

  const scanTranslate = frameHeight
    ? scanProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, frameHeight + 20],
      })
    : undefined;

  return (
    <View style={styles.frameWrapper}>
      <View style={styles.frameSpacer} onLayout={handleLayout}>
        <Animated.View
          pointerEvents="none"
          style={[styles.frameBorder, { opacity: borderOpacity }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.frameGlow, { opacity: glowOpacity }]}
        />
        {scanTranslate && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.frameScan,
              {
                transform: [{ translateY: scanTranslate }],
              },
            ]}
          />
        )}
        <View style={styles.frameContent}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  frameSpacer: {
    borderRadius: 24,
    padding: 18,
  },
  frameBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(120, 200, 255, 0.18)',
  },
  frameGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(90, 200, 255, 0.12)',
  },
  frameScan: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(120, 200, 255, 0.22)',
    borderRadius: 1,
  },
  frameContent: {
    borderRadius: 20,
    backgroundColor: 'rgba(7, 9, 24, 0.82)',
    padding: 16,
    gap: 16,
  },
  pageContent: {
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(14, 18, 40, 0.86)',
    gap: 12,
    elevation: 6,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heroAuraPrimary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -60,
    right: -40,
    backgroundColor: neonPalette.glowPink,
  },
  heroAuraSecondary: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    bottom: -64,
    left: -36,
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
    gap: 12,
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(152, 128, 255, 0.65)',
    backgroundColor: 'rgba(9, 10, 30, 0.9)',
  },
  avatarInitial: {
    color: '#F3F4FF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroTitleGroup: {
    gap: 4,
  },
  heroTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  heroSubtitle: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resourceChip: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(12, 14, 32, 0.86)',
    gap: 6,
  },
  resourceChipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resourceLabel: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  resourceValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  resourceDesc: {
    color: 'rgba(236, 241, 255, 0.62)',
    fontSize: 12,
  },
  networkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(12, 14, 30, 0.72)',
    gap: 10,
    height: 28,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkLabel: {
    color: designTokens.colors.textPrimary,
    fontSize: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    columnGap: 12,
  },
  quickCardPressable: {
    width: '48%',
  },
  quickCard: {
    height: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    justifyContent: 'space-between',
  },
  quickCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickCardChevron: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 18,
  },
  quickCardTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  quickCardDesc: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
    lineHeight: 18,
  },
  blindBoxContainer: {
    gap: 12,
  },
  blindBoxPrimary: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 12,
    minHeight: 160,
  },
  blindBoxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blindBoxTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  blindBoxSubtitle: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  blindBoxButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FF5BD4',
  },
  blindBoxButtonDisabled: {
    backgroundColor: 'rgba(255, 91, 212, 0.45)',
  },
  blindBoxButtonText: {
    color: '#17021F',
    fontSize: 13,
    fontWeight: '700',
  },
  blindBoxViewport: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 104,
    backgroundColor: 'rgba(6, 8, 26, 0.88)',
  },
  unitySurface: {
    flex: 1,
  },
  blindBoxAmbient: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    bottom: -40,
    alignSelf: 'center',
    backgroundColor: 'rgba(90, 225, 240, 0.36)',
  },
  blindBoxSpecular: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 24,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  blindBoxFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 8, 24, 0.64)',
    gap: 4,
  },
  fallbackTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  fallbackDesc: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
  },
  blindBoxSecondary: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 96,
  },
  secondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  secondaryText: {
    flex: 1,
    gap: 6,
  },
  blindBoxHint: {
    color: 'rgba(236, 241, 255, 0.7)',
    fontSize: 12,
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    bottom: -10,
    borderRadius: 2,
  },
  dotsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9B4DFF',
  },
});

export default HomeScreen;
