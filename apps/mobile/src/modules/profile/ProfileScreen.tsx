import React, { useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, NativeStackNavigationProp } from '@react-navigation/native-stack';
import NeonCard from '@components/NeonCard';
import QuickGlyph from '@components/QuickGlyph';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { ProfileStackParamList, RootTabParamList } from '@app/navigation/types';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import HomeSkeleton from '@modules/home/HomeSkeleton';

const cardCommandCenter = require('../../assets/cards/card_command_center.webp');
const avatarPlaceholder = require('../../assets/profile/ph_avatar.png');

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

const functionEntries = [
  {
    key: 'team',
    title: '我的团队',
    subtitle: '查看队伍、成员与权限',
    glyph: 'team' as const,
    badgeText: '23 名成员',
    route: 'MyTeam',
  },
  {
    key: 'inventory',
    title: '我的仓库',
    subtitle: '矿石、地图碎片、NFT',
    glyph: 'storage' as const,
    badgeText: '42 件物品',
    route: 'MyInventory',
  },
  {
    key: 'invite',
    title: '我的邀请',
    subtitle: '邀请记录与奖励',
    glyph: 'invite' as const,
    badgeText: '本月 3 人',
    route: 'MyInvites',
  },
  {
    key: 'vip',
    title: '会员中心',
    subtitle: '身份与权益',
    glyph: 'member' as const,
    badgeText: '非会员',
    route: 'Member',
  },
  {
    key: 'battle',
    title: '战报中心',
    subtitle: '数据与战报',
    glyph: 'reports' as const,
    badgeText: '3 条未读',
    route: 'Reports',
  },
  {
    key: 'highlights',
    title: '收藏亮点',
    subtitle: '高光收藏',
    glyph: 'highlights' as const,
    badgeText: '高光 5 条',
    route: 'Highlights',
  },
];

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
  const statusLine =
    teamMembers.length > 0 ? '命运等级 Lv.8 · 团队 Abyss Raiders' : '尚未加入团队';
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const minersTotal = teamMembers.length || 14;
  const minersActive = Math.max(1, Math.floor(minersTotal * 0.7));

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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileCard
            displayName={displayName}
            statusLine={statusLine}
            arcAmount={arcAmount}
            oreAmount={oreAmount}
            onPressSettings={() => navigation.navigate('Settings')}
            onPressAsset={() => navigation.navigate('Wallet')}
          />
          <MetricsSection minersValue={`${minersActive}/${minersTotal}`} />
          <FunctionGrid
            entries={functionEntries}
            onPress={(route) => navigation.navigate(route as keyof ProfileStackParamList)}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

type ProfileCardProps = {
  displayName: string;
  statusLine: string;
  arcAmount: string;
  oreAmount: string;
  onPressSettings: () => void;
  onPressAsset: () => void;
};

const ProfileCard = ({
  displayName,
  statusLine,
  arcAmount,
  oreAmount,
  onPressSettings,
  onPressAsset,
}: ProfileCardProps) => (
  <NeonCard
    backgroundSource={cardCommandCenter}
    overlayColor="rgba(5,8,20,0.45)"
    borderColors={['#33F5FF', '#7DB1FF']}
    glowColor="#33F5FF"
    contentPadding={20}
    style={styles.profileCard}
  >
    <View style={styles.profileRow}>
      <Image source={avatarPlaceholder} style={styles.avatar} />
      <View style={styles.identityBlock}>
        <Text style={styles.smallLabel}>指挥官档案</Text>
        <Text style={styles.mainName} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.subStatus} numberOfLines={1}>
          {statusLine}
        </Text>
      </View>
      <Pressable onPress={onPressSettings} hitSlop={10}>
        <QuickGlyph id="settings" size={24} colors={['#33F5FF', '#7DB1FF']} />
      </Pressable>
    </View>
    <View style={styles.assetRow}>
      <AssetPill
        label="ARC 总额"
        description="平台命运代币"
        value={arcAmount}
        accent="#33F5FF"
        onPress={onPressAsset}
      />
      <AssetPill
        label="矿石数量"
        description="命运塔与锻造核心资源"
        value={oreAmount}
        accent="#7DB1FF"
        onPress={onPressAsset}
      />
    </View>
  </NeonCard>
);

type AssetPillProps = {
  label: string;
  description?: string;
  value: string;
  accent: string;
  onPress: () => void;
};

const AssetPill = ({ label, description, value, accent, onPress }: AssetPillProps) => (
  <Pressable onPress={onPress} style={[styles.assetPill, { borderColor: accent }]}>
    <Text style={[styles.assetLabel, { color: accent }]}>{label}</Text>
    <Text style={styles.assetValue}>{value}</Text>
    {description ? <Text style={styles.assetDesc}>{description}</Text> : null}
  </Pressable>
);

const MetricsSection = ({ minersValue }: { minersValue: string }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>作战指标</Text>
    <View style={styles.metricsRow}>
      <SecondaryCard>
        <View style={styles.rowHeader}>
          <QuickGlyph id="miner" size={20} colors={['#33F5FF', '#7DB1FF']} />
          <Text style={styles.cardTitle}>矿工</Text>
        </View>
        <Text style={styles.cardValue}>{minersValue}</Text>
        <Text style={styles.cardSubtitle}>活跃矿工 / 总矿工</Text>
      </SecondaryCard>
      <SecondaryCard>
        <View style={styles.rowHeader}>
          <QuickGlyph id="chain" size={20} colors={['#33F5FF', '#7DB1FF']} />
          <Text style={styles.cardTitle}>链上数据中枢</Text>
        </View>
        <Text style={styles.cardValue}>同步中</Text>
        <Text style={styles.cardSubtitle}>链上资产与身份快照</Text>
      </SecondaryCard>
    </View>
  </View>
);

type FunctionGridProps = {
  entries: typeof functionEntries;
  onPress: (route: string) => void;
};

const FunctionGrid = ({ entries, onPress }: FunctionGridProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>功能矩阵</Text>
    <View style={styles.gridContainer}>
      {entries.map((entry) => (
        <Pressable
          key={entry.key}
          style={styles.gridItem}
          onPress={() => onPress(entry.route)}
          android_ripple={{ color: 'rgba(255,255,255,0.08)', borderless: false }}
        >
          <SecondaryCard>
            {entry.badgeText ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{entry.badgeText}</Text>
              </View>
            ) : null}
            <View style={styles.rowHeader}>
              <QuickGlyph id={entry.glyph} size={20} colors={['#33F5FF', '#7DB1FF']} />
              <Text style={styles.cardTitle}>{entry.title}</Text>
            </View>
            <Text style={styles.cardSubtitle}>{entry.subtitle}</Text>
          </SecondaryCard>
        </Pressable>
      ))}
    </View>
  </View>
);

const SecondaryCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.secondaryCard}>{children}</View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: 12,
    paddingBottom: 112,
    gap: spacing.section,
  },
  profileCard: {
    minHeight: 190,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  identityBlock: {
    flex: 1,
  },
  smallLabel: {
    ...typography.captionCaps,
    color: 'rgba(51,245,255,0.65)',
    letterSpacing: 0.6,
  },
  mainName: {
    ...typography.heading,
    color: '#FFFFFF',
    marginTop: 2,
  },
  subStatus: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  assetRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginTop: 18,
  },
  assetPill: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assetLabel: {
    ...typography.captionCaps,
    letterSpacing: 0.6,
  },
  assetValue: {
    ...typography.heading,
    color: '#FFFFFF',
    marginTop: 6,
  },
  assetDesc: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  section: {
    gap: spacing.cardGap,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardValue: {
    ...typography.heading,
    color: '#FFFFFF',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 6,
  },
  secondaryCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(5,8,18,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#00ffff',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridItem: {
    width: '48%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.4)',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    color: '#33F5FF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
