import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { UnityView } from '@bridge/UnityView';
import { useUnityBridge } from '@bridge/useUnityBridge';
import { HomeStackParamList } from '@app/navigation/types';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';

type QuickLinkConfig = {
  title: string;
  description: string;
  target: keyof HomeStackParamList;
  accent: string;
};

const QUICK_LINKS: QuickLinkConfig[] = [
  {
    title: '排行榜',
    description: '查看赛季荣誉与全球排名',
    target: 'Leaderboard',
    accent: neonPalette.accentMagenta,
  },
  {
    title: '铸造坊',
    description: '合成模块、强化装备',
    target: 'Forge',
    accent: neonPalette.accentCyan,
  },
  {
    title: '集市坊',
    description: '交易 NFT 与稀有伙伴',
    target: 'Marketplace',
    accent: '#63FFAF',
  },
  {
    title: '活动商城',
    description: '兑换赛季限定与礼包',
    target: 'EventShop',
    accent: neonPalette.accentAmber,
  },
];

export const HomeScreen = () => {
  const { data, loading, error } = useAccountSummary();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    status: unityStatus,
    bootstrapUnity,
    requestScene,
    sendUnityMessage,
    lastMessage,
  } = useUnityBridge({
    defaultSceneName: 'BlindBoxShowcase',
  });
  const isFocused = useIsFocused();
  const heroPulse = useNeonPulse({ duration: 5600 });
  const blindBoxPulse = useNeonPulse({ duration: 7000 });

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    if (unityStatus === 'idle') {
      bootstrapUnity('BlindBoxShowcase').catch(() => null);
    } else if (unityStatus === 'ready') {
      requestScene('BlindBoxShowcase');
    }
  }, [bootstrapUnity, requestScene, unityStatus, isFocused]);

  return (
    <ScreenContainer scrollable>
      <LinearGradient
        colors={['#2A1461', '#120C35', '#051026']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroShell}
      >
        <View style={styles.heroCard}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroGlow,
              getGlowStyle({
                animated: heroPulse,
                minOpacity: 0.14,
                maxOpacity: 0.32,
                minScale: 0.88,
                maxScale: 1.16,
              }),
            ]}
          />
          <View style={styles.heroHeader}>
            <Text style={styles.heroEyebrow}>NEON LINK</Text>
            <Text style={styles.heroTitle}>欢迎回到霓虹链域</Text>
            <Text style={styles.heroSubtitle}>
              同步身份，统率你的赛博战队。
            </Text>
          </View>
          {loading ? (
            <LoadingPlaceholder label="链上数据同步中..." />
          ) : error ? (
            <ErrorState
              title="链上数据暂不可用"
              description={error}
              onRetry={() => navigation.replace('HomeMain')}
            />
          ) : data ? (
            <>
              <View style={styles.heroStats}>
                <Stat label="等级" value={data.level.toString()} />
                <Stat label="战斗评分" value={data.powerScore.toString()} />
                <Stat
                  label="资产数"
                  value={`${data.tokens.length + data.nfts.length}`}
                />
              </View>
              <View style={styles.addressPill}>
                <Text style={styles.addressLabel}>主钱包</Text>
                <Text style={styles.addressValue}>{data.address}</Text>
              </View>
            </>
          ) : (
            <LoadingPlaceholder label="暂无链上数据，稍后再试。" />
          )}
        </View>
      </LinearGradient>

      {data && !loading && !error ? (
        <>
          <SectionHeader
            title="资产速览"
            subtitle="核心资源与装备一目了然"
          />
          <View style={styles.assetGrid}>
            <InfoCard title="代币储备" subtitle="试炼能量池">
              {data.tokens.map((token) => (
                <View style={styles.listRow} key={token.id}>
                  <View>
                    <Text style={styles.itemName}>{token.name}</Text>
                    <Text style={styles.itemNote}>
                      可用于能量补给与交易
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>{token.amount}</Text>
                </View>
              ))}
            </InfoCard>
            <InfoCard
              title="装备与伙伴"
              subtitle="当前携带的战斗资产"
            >
              {data.nfts.map((nft) => (
                <View style={styles.listRow} key={nft.id}>
                  <View>
                    <Text style={styles.itemName}>{nft.name}</Text>
                    <Text style={styles.itemNote}>NFT 资产</Text>
                  </View>
                  <Text style={styles.itemValue}>{nft.amount}</Text>
                </View>
              ))}
            </InfoCard>
          </View>
        </>
      ) : null}

      <SectionHeader
        title="作战面板"
        subtitle="快速定位关键功能与模块"
      />
      <View style={styles.quickLinkGrid}>
        {QUICK_LINKS.map((link) => (
          <QuickLinkCard
            key={link.target}
            title={link.title}
            description={link.description}
            accent={link.accent}
            onPress={() => navigation.navigate(link.target)}
          />
        ))}
      </View>

      <SectionHeader
        title="Unity 控制台"
        subtitle="实时查看 3D 场景状态"
      />
      <View style={styles.blindBoxContainer}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.blindBoxGlow,
            getGlowStyle({
              animated: blindBoxPulse,
              minOpacity: 0.12,
              maxOpacity: 0.28,
              minScale: 0.88,
              maxScale: 1.22,
            }),
          ]}
        />
        {isFocused ? <UnityView style={styles.blindBoxUnity} /> : null}
        {unityStatus !== 'ready' || !isFocused ? (
          <View style={styles.blindBoxOverlay}>
            <LoadingPlaceholder
              label={
                unityStatus === 'error'
                  ? '盲盒展示加载失败'
                  : '载入 3D 盲盒展示中...'
              }
            />
          </View>
        ) : null}
        <View style={styles.blindBoxHeader}>
          <View style={styles.blindBoxText}>
            <Text style={styles.blindBoxTitle}>盲盒召唤台</Text>
            <Text style={styles.blindBoxSubtitle}>
              赛博灵偶等待唤醒，点击调度测试
              Unity 指令。
            </Text>
          </View>
          <Pressable
            style={styles.blindBoxButton}
            onPress={() =>
              sendUnityMessage('SHOW_BLINDBOX', {
                blindBoxId: 'starter-pack',
                rarityHint: 'epic',
              })
            }
          >
            <Text style={styles.blindBoxButtonText}>开启盲盒</Text>
            <Text style={styles.blindBoxButtonHint}>推送 SHOW_BLINDBOX 指令</Text>
          </Pressable>
        </View>
      </View>

      {lastMessage ? (
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>Unity 回传</Text>
          <Text style={styles.logText}>{JSON.stringify(lastMessage, null, 2)}</Text>
        </View>
      ) : null}
    </ScreenContainer>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <LinearGradient
    colors={['rgba(63, 242, 255, 0.22)', 'rgba(124, 92, 255, 0.2)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.statShell}
  >
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </LinearGradient>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const QuickLinkCard = ({
  title,
  description,
  onPress,
  accent,
}: {
  title: string;
  description: string;
  accent: string;
  onPress: () => void;
}) => {
  const pulse = useNeonPulse({ duration: 5200 });

  const accentStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
    transform: [
      {
        scaleX: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1.08],
        }),
      },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickLinkPressable,
        pressed ? styles.quickLinkPressableActive : null,
      ]}
    >
      <LinearGradient
        colors={[accent, 'rgba(12, 11, 36, 0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickLinkGradient}
      >
        <Animated.View style={[styles.quickLinkAccent, { backgroundColor: accent }, accentStyle]} />
        <Text style={styles.quickLinkCardTitle}>{title}</Text>
        <Text style={styles.quickLinkCardDesc}>{description}</Text>
        <Text style={styles.quickLinkAction}>立即前往 →</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heroShell: {
    borderRadius: 28,
    padding: 1,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(118, 88, 255, 0.38)',
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 27,
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(8, 9, 32, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(78, 46, 171, 0.52)',
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 27,
    backgroundColor: neonPalette.glowPurple,
  },
  heroHeader: {
    gap: 10,
    marginBottom: 16,
  },
  heroEyebrow: {
    color: neonPalette.accentCyan,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.4,
  },
  heroTitle: {
    color: neonPalette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  statShell: {
    flex: 1,
    borderRadius: 18,
    padding: 1,
    borderWidth: 1,
    borderColor: 'rgba(63, 242, 255, 0.28)',
  },
  statBox: {
    borderRadius: 17,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(9, 10, 32, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(68, 45, 155, 0.45)',
  },
  statValue: {
    color: neonPalette.accentMagenta,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 0.4,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(14, 14, 40, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(88, 63, 187, 0.55)',
  },
  addressLabel: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  addressValue: {
    color: neonPalette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  assetGrid: {
    gap: 18,
    marginBottom: 26,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(44, 31, 93, 0.45)',
  },
  itemName: {
    color: neonPalette.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  itemValue: {
    color: neonPalette.accentCyan,
    fontSize: 15,
    fontWeight: '700',
  },
  itemNote: {
    color: neonPalette.textMuted,
    fontSize: 11,
    marginTop: 3,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    color: neonPalette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    marginTop: 6,
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  quickLinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 28,
  },
  quickLinkPressable: {
    width: '48%',
    borderRadius: 20,
  },
  quickLinkPressableActive: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  quickLinkGradient: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.6)',
    backgroundColor: 'rgba(7, 9, 26, 0.88)',
  },
  quickLinkAccent: {
    width: 46,
    height: 6,
    borderRadius: 4,
    marginBottom: 10,
  },
  quickLinkCardTitle: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  quickLinkCardDesc: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  quickLinkAction: {
    color: neonPalette.accentViolet,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  blindBoxContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(70, 44, 140, 0.55)',
    backgroundColor: 'rgba(10, 11, 30, 0.9)',
    marginBottom: 24,
  },
  blindBoxGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: neonPalette.glowCyan,
  },
  blindBoxUnity: {
    height: 220,
    backgroundColor: 'rgba(6, 7, 24, 0.9)',
  },
  blindBoxOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 6, 25, 0.88)',
  },
  blindBoxHeader: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(11, 12, 32, 0.88)',
    borderTopWidth: 1,
    borderColor: 'rgba(58, 36, 118, 0.55)',
  },
  blindBoxText: {
    flex: 1,
    gap: 6,
  },
  blindBoxTitle: {
    color: neonPalette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  blindBoxSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  blindBoxButton: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: neonPalette.accentMagenta,
  },
  blindBoxButtonText: {
    color: '#170624',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  blindBoxButtonHint: {
    color: '#F4E5FF',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  logBox: {
    marginTop: 10,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(9, 10, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(58, 33, 118, 0.55)',
  },
  logTitle: {
    color: neonPalette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  logText: {
    color: neonPalette.textSecondary,
    fontFamily: 'Courier',
    fontSize: 11,
    lineHeight: 18,
  },
});
