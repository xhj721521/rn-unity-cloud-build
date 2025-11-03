import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { CommandCenter } from '@components/CommandCenter';
import { FeatureCard } from '@components/FeatureCard';
import { GachaDrop, GachaStage } from '@components/GachaStage';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { HomeStackParamList, RootTabParamList } from '@app/navigation/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { useUnityBridge } from '@bridge/useUnityBridge';
import { spacing } from '@theme/tokens';

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

type HomeNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

type FeatureConfig = {
  key: 'Leaderboard' | 'Forge' | 'Marketplace' | 'EventShop';
  title: string;
  subtitle: string;
  route: keyof HomeStackParamList;
  accent: string;
  icon: Parameters<typeof FeatureCard>[0]['icon'];
};

const FEATURE_CONFIGS: FeatureConfig[] = [
  {
    key: 'Leaderboard',
    title: '排行榜',
    subtitle: '追踪赛季荣誉与全球排名',
    route: 'Leaderboard',
    accent: '#BE7BFF',
    icon: 'leaderboard',
  },
  {
    key: 'Forge',
    title: '铸造坊',
    subtitle: '强化装备 / 合成模块',
    route: 'Forge',
    accent: '#6BB8FF',
    icon: 'forge',
  },
  {
    key: 'Marketplace',
    title: '集市坊',
    subtitle: '挂单 NFT 与稀有伙伴',
    route: 'Marketplace',
    accent: '#FF76D5',
    icon: 'market',
  },
  {
    key: 'EventShop',
    title: '活动商城',
    subtitle: '兑换赛季限定奖励',
    route: 'EventShop',
    accent: '#7A9BFF',
    icon: 'events',
  },
];

const STAGE_COPY = {
  loading: '资源加载中…',
  buttonReady: '开启盲盒',
  buttonLoading: '开启中…',
} as const;

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

const buildDrop = (payload: Record<string, unknown> | undefined): GachaDrop => {
  const name =
    typeof payload?.name === 'string'
      ? payload.name
      : `盲盒奖励 ${payload?.resultId ?? ''}`;
  return {
    id: String(payload?.resultId ?? Date.now()),
    avatarFallback: name.charAt(0).toUpperCase(),
    name,
    rarity: typeof payload?.rarity === 'string' ? payload.rarity : '未知',
    timestamp: Date.now(),
  };
};

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigation>();
  const { data, loading, error } = useAccountSummary();

  const [recentDrops, setRecentDrops] = useState<GachaDrop[]>([]);
  const [currentResult, setCurrentResult] = useState<GachaDrop | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const {
    status: unityStatus,
    bootstrapUnity,
    requestScene,
    postUnityMessage,
    pauseUnity,
    resumeUnity,
    setUnityEffectsQuality,
    lastMessage,
  } = useUnityBridge({
    defaultSceneName: 'BlindBoxShowcase',
  });

  useEffect(() => {
    if (unityStatus === 'idle') {
      bootstrapUnity('BlindBoxShowcase').catch(() => null);
    } else if (unityStatus === 'ready') {
      requestScene('BlindBoxShowcase');
    } else if (unityStatus === 'error') {
      setIsOpening(false);
    }
  }, [bootstrapUnity, requestScene, unityStatus]);

  useEffect(() => {
    if (unityStatus === 'ready') {
      setIsOpening(false);
    }
  }, [unityStatus]);

  useFocusEffect(
    useCallback(() => {
      resumeUnity();
      return () => {
        pauseUnity();
      };
    }, [pauseUnity, resumeUnity]),
  );

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    if (lastMessage.type === 'GACHA_RESULT') {
      const drop = buildDrop(lastMessage.payload);
      setCurrentResult(drop);
      setRecentDrops((prev) => [drop, ...prev].slice(0, 8));
      setIsOpening(false);
      return;
    }

    if (lastMessage.type === 'GACHA_ERROR' || lastMessage.type === 'ERROR') {
      setIsOpening(false);
      return;
    }

    if (lastMessage.type === 'PERF_METRIC' || lastMessage.type === 'FPS_UPDATE') {
      const fpsValue = Number(lastMessage.payload?.fps ?? lastMessage.payload?.value);
      if (!Number.isFinite(fpsValue)) {
        return;
      }
      if (fpsValue < 30) {
        setUnityEffectsQuality('low');
      } else if (fpsValue >= 45) {
        setUnityEffectsQuality('high');
      }
    }
  }, [lastMessage, setUnityEffectsQuality]);

  const arcAmount = useMemo(
    () => formatAssetAmount(data?.tokens, ARC_TOKEN_ID),
    [data?.tokens],
  );
  const oreAmount = useMemo(
    () => formatAssetAmount(data?.tokens, ORE_TOKEN_ID),
    [data?.tokens],
  );

  const commandCenterResources = useMemo(
    () => [
      {
        id: 'arc',
        label: 'Arc',
        value: arcAmount,
        unit: 'Arc',
        accentColor: '#C795FF',
        isOnline: true,
      },
      {
        id: 'ore',
        label: '矿石',
        value: oreAmount,
        unit: '颗',
        accentColor: '#75E7FF',
        isOnline: true,
      },
    ] as const,
    [arcAmount, oreAmount],
  );

  const handleOpenStage = useCallback(() => {
    if (unityStatus !== 'ready') {
      return;
    }
    setIsOpening(true);
    setCurrentResult(null);
    postUnityMessage('BoxController', 'Open', '');
  }, [postUnityMessage, unityStatus]);

  const handleDismissResult = useCallback(() => {
    setCurrentResult(null);
  }, []);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const features = useMemo(
    () =>
      FEATURE_CONFIGS.map((item) => ({
        ...item,
        onPress: () => navigation.navigate(item.route),
      })),
    [navigation],
  );

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="指挥中心正在加载…" />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
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

  const displayName = data?.displayName ?? '指挥官';

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette>
      <View style={styles.page}>
        <CommandCenter
          displayName={displayName}
          subtitle="霓虹链域已同步"
          avatarInitial={displayName.charAt(0).toUpperCase()}
          onPressSettings={handleSettingsPress}
          resources={commandCenterResources}
          connectionLabel="已连接"
        />
        <View style={styles.featureGrid}>
          {features.map(({ key, title, subtitle, accent, icon, onPress }) => (
            <View key={key} style={styles.featureItem}>
              <FeatureCard
                title={title}
                subtitle={subtitle}
                accent={accent}
                icon={icon}
                onPress={onPress}
              />
            </View>
          ))}
        </View>
        <GachaStage
          status={unityStatus}
          drops={recentDrops}
          copy={STAGE_COPY}
          isOpening={isOpening}
          onOpen={handleOpenStage}
          currentResult={currentResult ?? undefined}
          onDismissResult={currentResult ? handleDismissResult : undefined}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: spacing.section,
    paddingBottom: spacing.section * 2,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.cardGap / 2,
    rowGap: spacing.cardGap,
  },
  featureItem: {
    width: '50%',
    paddingHorizontal: spacing.cardGap / 2,
  },
});
