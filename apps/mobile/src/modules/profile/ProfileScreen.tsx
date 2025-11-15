import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import NeonCard from '@components/NeonCard';
import QuickGlyph from '@components/QuickGlyph';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { ProfileStackParamList, RootTabParamList } from '@app/navigation/types';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import HomeSkeleton from '@modules/home/HomeSkeleton';

const cardCommandCenter = require('../../assets/cards/card_command_center.webp');
const avatarPlaceholder = require('../../assets/profile/ph_avatar.png');

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

type EntryTile = {
  key: string;
  title: string;
  desc: string;
  glyph: Parameters<typeof QuickGlyph>[0]['id'];
  onPress: () => void;
};

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

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const parentNavigation = navigation.getParent() as NavigationProp<RootTabParamList> | undefined;
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAccountSummary();
  const teamMembers = useAppSelector((state) => state.team?.members) ?? [];

  useEffect(() => {
    parentNavigation?.setOptions?.({ title: '我的' });
  }, [parentNavigation]);

  const displayName = data?.displayName ?? 'Pilot Zero';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const minersTotal = teamMembers.length || 14;
  const minersActive = Math.max(1, Math.floor(minersTotal * 0.7));

  const entryTiles: EntryTile[] = useMemo(
    () => [
      {
        key: 'team',
        title: '我的团队',
        desc: '查看队伍、成员与权限',
        glyph: 'team',
        onPress: () => navigation.navigate('MyTeam'),
      },
      {
        key: 'storage',
        title: '我的仓库',
        desc: '矿石、地图碎片、NFT',
        glyph: 'storage',
        onPress: () => navigation.navigate('MyInventory'),
      },
      {
        key: 'invite',
        title: '我的邀请',
        desc: '邀请记录与奖励',
        glyph: 'invite',
        onPress: () => navigation.navigate('MyInvites'),
      },
      {
        key: 'member',
        title: '会员中心',
        desc: '身份与权益',
        glyph: 'member',
        onPress: () => navigation.navigate('Member'),
      },
      {
        key: 'reports',
        title: '战报中心',
        desc: '数据与战报',
        glyph: 'reports',
        onPress: () => navigation.navigate('Reports'),
      },
      {
        key: 'highlights',
        title: '收藏亮点',
        desc: '高光收藏',
        glyph: 'highlights',
        onPress: () => navigation.navigate('Highlights'),
      },
    ],
    [navigation],
  );

  if (loading) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
        <HomeSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
        <View style={styles.center}>
          <ErrorState
            title="暂时无法连接指挥官档案"
            description={error}
            onRetry={() => dispatch(loadAccountSummary())}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <NeonCard
            backgroundSource={cardCommandCenter}
            overlayColor="rgba(5,8,20,0.45)"
            borderColors={['#33F5FF', '#7DB1FF']}
            glowColor="#33F5FF"
            contentPadding={18}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <Image source={avatarPlaceholder} style={styles.avatar} />
              <View style={styles.heroIdentity}>
                <Text style={styles.heroLabel}>指挥官档案</Text>
                <Text style={styles.heroName} numberOfLines={1}>
                  {displayName}
                </Text>
              </View>
              <QuickGlyph id="settings" size={22} colors={['#33F5FF', '#7DB1FF']} />
            </View>
            <View style={styles.assetRow}>
              <AssetPill label="ARC" value={arcAmount} accent="#33F5FF" />
              <AssetPill label="矿石" value={oreAmount} accent="#7DB1FF" />
            </View>
          </NeonCard>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>作战指标</Text>
            </View>
            <View style={styles.statGrid}>
              <StatCard
                title="矿工"
                value={`${minersActive}/${minersTotal}`}
                subtitle="活跃矿工 / 总矿工"
                glyph="miner"
              />
              <StatCard
                title="链上数据中枢"
                value="同步中"
                subtitle="链上资产与身份快照"
                glyph="chain"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>功能矩阵</Text>
            </View>
            <View style={styles.entryGrid}>
              {entryTiles.map((entry) => (
                <NeonCard
                  key={entry.key}
                  overlayColor="rgba(5,8,18,0.78)"
                  borderColors={['#33F5FF', '#7DB1FF']}
                  glowColor="#33F5FF"
                  contentPadding={14}
                  style={styles.entryCard}
                  onPress={entry.onPress}
                >
                  <View style={styles.entryTopRow}>
                    <View style={styles.entryIcon}>
                      <QuickGlyph id={entry.glyph} size={22} colors={['#33F5FF', '#7DB1FF']} />
                    </View>
                  </View>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryDesc}>{entry.desc}</Text>
                </NeonCard>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const AssetPill = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) => (
  <View style={[styles.assetPill, { borderColor: accent }]}>
    <Text style={[styles.assetLabel, { color: accent }]}>{label}</Text>
    <Text style={styles.assetValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const StatCard = ({
  title,
  value,
  subtitle,
  glyph,
}: {
  title: string;
  value: string;
  subtitle: string;
  glyph: Parameters<typeof QuickGlyph>[0]['id'];
}) => (
  <NeonCard
    overlayColor="rgba(5,8,18,0.82)"
    borderColors={['#33F5FF', '#7DB1FF']}
    glowColor="#33F5FF"
    contentPadding={16}
    style={styles.statCard}
  >
    <View style={styles.statHeader}>
      <QuickGlyph id={glyph} size={22} colors={['#33F5FF', '#7DB1FF']} />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </NeonCard>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.cardGap,
    paddingBottom: spacing.section + 88,
    gap: spacing.section,
  },
  heroCard: {
    minHeight: 180,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroIdentity: {
    flex: 1,
  },
  heroLabel: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.65)',
  },
  heroName: {
    ...typography.heading,
    color: '#FFFFFF',
    marginTop: 4,
  },
  assetRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginTop: 16,
  },
  assetPill: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assetLabel: {
    ...typography.captionCaps,
    letterSpacing: 0.6,
  },
  assetValue: {
    ...typography.subtitle,
    color: '#FFFFFF',
    marginTop: 4,
  },
  section: {
    gap: spacing.cardGap,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  statGrid: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  statCard: {
    flex: 1,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statTitle: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  statValue: {
    ...typography.heading,
    color: '#FFFFFF',
    marginTop: 8,
  },
  statSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  entryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.cardGap,
    rowGap: spacing.cardGap,
  },
  entryCard: {
    width: '48%',
    minHeight: 140,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  entryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(51,245,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    ...typography.subtitle,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  entryDesc: {
    ...typography.body,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
