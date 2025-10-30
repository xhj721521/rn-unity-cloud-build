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
    title: '\u6392\u884C\u699C',
    description: '\u67E5\u770B\u8D5B\u5B63\u8363\u8A89\u4E0E\u5168\u7403\u6392\u540D',
    target: 'Leaderboard',
    accent: neonPalette.accentMagenta,
  },
  {
    title: '\u94F8\u9020\u574A',
    description: '\u5408\u6210\u6A21\u5757\u3001\u5F3A\u5316\u88C5\u5907',
    target: 'Forge',
    accent: neonPalette.accentCyan,
  },
  {
    title: '\u96C6\u5E02\u574A',
    description: '\u4EA4\u6613 NFT \u4E0E\u7A00\u6709\u4F19\u4F34',
    target: 'Marketplace',
    accent: '#63FFAF',
  },
  {
    title: '\u6D3B\u52A8\u5546\u57CE',
    description: '\u5151\u6362\u8D5B\u5B63\u9650\u5B9A\u4E0E\u793C\u5305',
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
            <Text style={styles.heroTitle}>\u6B22\u8FCE\u56DE\u5230\u9713\u8679\u94FE\u57DF</Text>
            <Text style={styles.heroSubtitle}>
              \u540C\u6B65\u8EAB\u4EFD\uFF0C\u7EDF\u7387\u4F60\u7684\u8D5B\u535A\u6218\u961F\u3002
            </Text>
          </View>
          {loading ? (
            <LoadingPlaceholder label="\u94FE\u4E0A\u6570\u636E\u540C\u6B65\u4E2D..." />
          ) : error ? (
            <ErrorState
              title="\u94FE\u4E0A\u6570\u636E\u6682\u4E0D\u53EF\u7528"
              description={error}
              onRetry={() => navigation.replace('HomeMain')}
            />
          ) : data ? (
            <>
              <View style={styles.heroStats}>
                <Stat label="\u7B49\u7EA7" value={data.level.toString()} />
                <Stat label="\u6218\u6597\u8BC4\u5206" value={data.powerScore.toString()} />
                <Stat
                  label="\u8D44\u4EA7\u6570"
                  value={`${data.tokens.length + data.nfts.length}`}
                />
              </View>
              <View style={styles.addressPill}>
                <Text style={styles.addressLabel}>\u4E3B\u94B1\u5305</Text>
                <Text style={styles.addressValue}>{data.address}</Text>
              </View>
            </>
          ) : (
            <LoadingPlaceholder label="\u6682\u65E0\u94FE\u4E0A\u6570\u636E\uFF0C\u7A0D\u540E\u518D\u8BD5\u3002" />
          )}
        </View>
      </LinearGradient>

      {data && !loading && !error ? (
        <>
          <SectionHeader
            title="\u8D44\u4EA7\u901F\u89C8"
            subtitle="\u6838\u5FC3\u8D44\u6E90\u4E0E\u88C5\u5907\u4E00\u76EE\u4E86\u7136"
          />
          <View style={styles.assetGrid}>
            <InfoCard title="\u4EE3\u5E01\u50A8\u5907" subtitle="\u8BD5\u70BC\u80FD\u91CF\u6C60">
              {data.tokens.map((token) => (
                <View style={styles.listRow} key={token.id}>
                  <View>
                    <Text style={styles.itemName}>{token.name}</Text>
                    <Text style={styles.itemNote}>
                      \u53EF\u7528\u4E8E\u80FD\u91CF\u8865\u7ED9\u4E0E\u4EA4\u6613
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>{token.amount}</Text>
                </View>
              ))}
            </InfoCard>
            <InfoCard
              title="\u88C5\u5907\u4E0E\u4F19\u4F34"
              subtitle="\u5F53\u524D\u643A\u5E26\u7684\u6218\u6597\u8D44\u4EA7"
            >
              {data.nfts.map((nft) => (
                <View style={styles.listRow} key={nft.id}>
                  <View>
                    <Text style={styles.itemName}>{nft.name}</Text>
                    <Text style={styles.itemNote}>NFT \u8D44\u4EA7</Text>
                  </View>
                  <Text style={styles.itemValue}>{nft.amount}</Text>
                </View>
              ))}
            </InfoCard>
          </View>
        </>
      ) : null}

      <SectionHeader
        title="\u4F5C\u6218\u9762\u677F"
        subtitle="\u5FEB\u901F\u5B9A\u4F4D\u5173\u952E\u529F\u80FD\u4E0E\u6A21\u5757"
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
        title="Unity \u63A7\u5236\u53F0"
        subtitle="\u5B9E\u65F6\u67E5\u770B 3D \u573A\u666F\u72B6\u6001"
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
                  ? '\u76F2\u76D2\u5C55\u793A\u52A0\u8F7D\u5931\u8D25'
                  : '\u8F7D\u5165 3D \u76F2\u76D2\u5C55\u793A\u4E2D...'
              }
            />
          </View>
        ) : null}
        <View style={styles.blindBoxHeader}>
          <View style={styles.blindBoxText}>
            <Text style={styles.blindBoxTitle}>\u76F2\u76D2\u53EC\u5524\u53F0</Text>
            <Text style={styles.blindBoxSubtitle}>
              \u8D5B\u535A\u7075\u5076\u7B49\u5F85\u5524\u9192\uFF0C\u70B9\u51FB\u8C03\u5EA6\u6D4B\u8BD5
              Unity \u6307\u4EE4\u3002
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
            <Text style={styles.blindBoxButtonText}>\u5F00\u542F\u76F2\u76D2</Text>
            <Text style={styles.blindBoxButtonHint}>\u63A8\u9001 SHOW_BLINDBOX \u6307\u4EE4</Text>
          </Pressable>
        </View>
      </View>

      {lastMessage ? (
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>Unity \u56DE\u4F20</Text>
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
        <Text style={styles.quickLinkAction}>\u7ACB\u5373\u524D\u5F80 \u2192</Text>
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
