import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { HomeStackParamList } from '@app/navigation/types';
import FateHeroCard from './components/FateHeroCard';
import FateModePills from './components/FateModePills';
import FateFeatureGrid from './components/FateFeatureGrid';
import FateBlindboxCard from './components/FateBlindboxCard';
import { fateColors, fateSpacing } from './fateTheme';
import {
  FateTowerIcon,
  TripleFateIcon,
  WorldMineIcon,
  RankingIcon,
  ForgeIcon,
  MarketIcon,
  EventIcon,
} from '@components/icons';

type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

const cardCommandCenter = require('../../assets/cards/card_command_center.webp');

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
  const { width: windowWidth } = useWindowDimensions();
  const { data, loading, error } = useAccountSummary();

  useEffect(() => {
    console.log('[fate-home-debug] HomeScreen mounted');
  }, []);

  const displayName = data?.displayName ?? 'Pilot Zero';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const heroWidth = Math.max(320, windowWidth - fateSpacing.pageHorizontal * 2);
  const featureWidth = Math.floor((heroWidth - fateSpacing.featureGap) / 2);

  const modeActions = useMemo(
    () => [
      {
        key: 'tower',
        title: '命运试炼塔',
        subtitle: '攀登 12 层命运塔，争夺核心资源',
        gradient: ['#2333FF', '#7F4CFF'] as [string, string],
        icon: <FateTowerIcon size={26} />,
        onPress: () => navigation.getParent()?.navigate('Trials' as never),
      },
      {
        key: 'triple',
        title: '三重命运',
        subtitle: '三次抉择，快速博弈命运奖励',
        gradient: ['#7F4CFF', '#FF4CCF'] as [string, string],
        icon: <TripleFateIcon size={26} />,
        onPress: () => navigation.navigate('Leaderboard'),
      },
      {
        key: 'world',
        title: '世界矿场',
        subtitle: '进入个人矿场与团队矿场',
        gradient: ['#1BC3FF', '#33F5AA'] as [string, string],
        icon: <WorldMineIcon size={26} />,
        onPress: () => navigation.getParent()?.navigate('Explore' as never),
      },
    ],
    [navigation],
  );

  const featureCards = useMemo(
    () => [
      {
        key: 'report',
        title: '命运战报',
        subtitle: '查看命运塔与三重命运排行',
        icon: <RankingIcon />,
        onPress: () => navigation.navigate('Leaderboard'),
      },
      {
        key: 'forge',
        title: '命运锻造所',
        subtitle: '消耗矿石锻造命运装备',
        icon: <ForgeIcon />,
        onPress: () => navigation.navigate('Forge'),
      },
      {
        key: 'market',
        title: '命运集市',
        subtitle: '交易矿石、NFT 与命运道具',
        icon: <MarketIcon />,
        onPress: () => navigation.navigate('Marketplace'),
      },
      {
        key: 'event',
        title: '命运活动',
        subtitle: '限时增益与补给兑换',
        icon: <EventIcon />,
        onPress: () => navigation.navigate('EventShop'),
      },
    ],
    [navigation],
  );

  let body: React.ReactNode;
  if (loading) {
    body = (
      <View style={styles.center}>
        <LoadingPlaceholder label="命运矿场正在加载…" />
      </View>
    );
  } else if (error) {
    body = (
      <View style={styles.center}>
        <ErrorState
          title="暂时无法连接命运网络"
          description={error}
          onRetry={() => dispatch(loadAccountSummary())}
        />
      </View>
    );
  } else {
    body = (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroWrapper}>
            <FateHeroCard
              width={heroWidth}
              displayName={displayName}
              arcAmount={arcAmount}
              oreAmount={oreAmount}
              backgroundSource={cardCommandCenter}
            />
          </View>
          <FateModePills actions={modeActions} />
          <FateFeatureGrid features={featureCards} cardWidth={featureWidth} />
          <FateBlindboxCard width={heroWidth} onPress={() => navigation.navigate('BlindBox')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#050814', '#08152F', '#042D4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {body}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: fateSpacing.pageHorizontal,
    paddingTop: fateSpacing.sectionVertical,
    paddingBottom: fateSpacing.sectionVertical + 88,
    gap: fateSpacing.sectionVertical,
  },
  heroWrapper: {
    marginBottom: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
