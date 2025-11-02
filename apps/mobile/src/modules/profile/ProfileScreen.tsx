import React, { useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { useAppSelector } from '@state/hooks';
import { ProfileStackParamList } from '@app/navigation/types';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';
import { NeonPressable } from '@components/NeonPressable';
import { designTokens } from '@theme/designTokens';

type ResourceBarProps = {
  label: string;
  value: string;
  accent: string;
};

type QuickLink = {
  title: string;
  description: string;
  target: keyof ProfileStackParamList;
  accent: string;
};

const QUICK_LINKS: QuickLink[] = [
  {
    title: '我的战队',
    description: '管理成员与权限分配',
    target: 'MyTeam',
    accent: designTokens.colors.accentPink,
  },
  {
    title: '资产仓库',
    description: '查看装备与 NFT 资产',
    target: 'MyInventory',
    accent: designTokens.colors.accentCyan,
  },
  {
    title: '邀请任务',
    description: '追踪邀请奖励与进度',
    target: 'MyInvites',
    accent: designTokens.colors.accentAmber,
  },
];

const SETTING_ITEMS = [
  { label: '钱包绑定 / 切换', value: '已绑定' },
  { label: '账号安全设置', value: '多重验证开启' },
  { label: '通知与战报偏好', value: '每日推送' },
  { label: '语言与多端登录', value: '中文 · 自动同步' },
];

export const ProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data, loading, error } = useAccountSummary();
  const teamMembers = useAppSelector((state) => state.team.members);
  const inventoryCount = useAppSelector(
    (state) => state.inventory.items.length,
  );
  const pendingInvites = useAppSelector(
    (state) =>
      state.invites.records.filter((record) => record.status === 'pending')
        .length,
  );
  const heroPulse = useNeonPulse({ duration: 5600 });

  const resourceBars: ResourceBarProps[] = useMemo(() => {
    if (!data) {
      return [
        {
          label: 'Arc 能量',
          value: '--',
          accent: designTokens.colors.accentPink,
        },
        { label: '矿石', value: '--', accent: designTokens.colors.accentCyan },
      ];
    }
    const arc =
      data.tokens.find((token) => token.id === 'tok-energy')?.amount ?? '--';
    const ore =
      data.tokens.find((token) => token.id === 'tok-neon')?.amount ?? '--';
    return [
      { label: 'Arc 能量', value: arc, accent: designTokens.colors.accentPink },
      { label: '矿石', value: ore, accent: designTokens.colors.accentCyan },
    ];
  }, [data]);

  return (
    <ScreenContainer scrollable>
      <LinearGradient
        colors={['#26144C', '#0E1028']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.heroAura,
            getGlowStyle({
              animated: heroPulse,
              minOpacity: 0.14,
              maxOpacity: 0.32,
              minScale: 0.88,
              maxScale: 1.18,
            }),
          ]}
        />
        {loading ? (
          <LoadingPlaceholder label="正在载入指挥官信息…" />
        ) : error ? (
          <ErrorState
            title="资料同步失败"
            description={error}
            onRetry={() => navigation.replace('ProfileMain')}
          />
        ) : data ? (
          <>
            <View style={styles.heroHeader}>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarText}>
                  {data.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.heroTitle}>{data.displayName}</Text>
                <Text style={styles.heroSubtitle}>
                  链域战队指挥官 · LV {data.level}
                </Text>
              </View>
              <View style={styles.powerBadge}>
                <Text style={styles.powerLabel}>战力</Text>
                <Text style={styles.powerValue}>{data.powerScore}</Text>
              </View>
            </View>

            <View style={styles.resourceStack}>
              {resourceBars.map((bar) => (
                <ResourceBar key={bar.label} {...bar} />
              ))}
            </View>

            <View style={styles.heroFooter}>
              <Metric label="NFT 藏品" value={`${data.nfts.length} 件`} />
              <Metric
                label="绑定地址"
                value={shortAddress(data.address)}
                mono
              />
            </View>
          </>
        ) : (
          <LoadingPlaceholder label="尚未获取到指挥官信息" />
        )}
      </LinearGradient>

      <SectionHeader title="战队概览" subtitle="实时掌握战队资源状态" />
      <View style={styles.summaryRow}>
        <SummaryCard
          label="战队成员"
          value={`${teamMembers.length} 位`}
          accent={designTokens.colors.accentPink}
        />
        <SummaryCard
          label="资产仓库"
          value={`${inventoryCount} 件`}
          accent={designTokens.colors.accentCyan}
        />
        <SummaryCard
          label="邀请待处理"
          value={`${pendingInvites} 条`}
          accent={designTokens.colors.accentAmber}
        />
      </View>

      <SectionHeader title="快捷模块" subtitle="常用功能一键到达" />
      <View style={styles.quickGrid}>
        {QUICK_LINKS.map((link) => (
          <NeonPressable
            key={link.title}
            style={styles.quickCard}
            onPress={() => navigation.navigate(link.target)}
          >
            <LinearGradient
              colors={[`${link.accent}26`, 'rgba(12, 14, 30, 0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickInner}
            >
              <View
                style={[styles.quickAccent, { backgroundColor: link.accent }]}
              />
              <Text style={styles.quickTitle}>{link.title}</Text>
              <Text style={styles.quickDesc}>{link.description}</Text>
              <Text style={styles.quickAction}>进入</Text>
            </LinearGradient>
          </NeonPressable>
        ))}
      </View>

      <SectionHeader title="账号设置" subtitle="安全策略与多端环境管理" />
      <View style={styles.settingPanel}>
        {SETTING_ITEMS.map((item) => (
          <View key={item.label} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
};

const ResourceBar = ({ label, value, accent }: ResourceBarProps) => (
  <View style={styles.resourceBar}>
    <View style={[styles.resourceDot, { backgroundColor: accent }]} />
    <Text style={styles.resourceLabel}>{label}</Text>
    <Text style={styles.resourceValue}>{value}</Text>
  </View>
);

const SummaryCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) => (
  <LinearGradient
    colors={[`${accent}33`, 'rgba(12, 14, 34, 0.9)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.summaryCard}
  >
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </LinearGradient>
);

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
  </View>
);

const Metric = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, mono && styles.metricMonospace]}>
      {value}
    </Text>
  </View>
);

const shortAddress = (address: string) =>
  address.length <= 10
    ? address
    : `${address.slice(0, 6)}…${address.slice(-4)}`;

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: designTokens.radii.xl,
    padding: designTokens.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(94, 68, 176, 0.45)',
    marginBottom: designTokens.spacing.xl,
    overflow: 'hidden',
    gap: designTokens.spacing.lg,
  },
  heroAura: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -120,
    right: -80,
    backgroundColor: neonPalette.glowPurple,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  avatarBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(182, 146, 255, 0.65)',
    backgroundColor: 'rgba(12, 14, 32, 0.92)',
  },
  avatarText: {
    color: designTokens.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
    gap: designTokens.spacing.xs,
  },
  heroTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.title,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.label,
  },
  powerBadge: {
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.radii.md,
    backgroundColor: 'rgba(14, 16, 36, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(154, 126, 255, 0.5)',
    gap: designTokens.spacing.xs,
  },
  powerLabel: {
    color: designTokens.colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  powerValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  resourceStack: {
    gap: designTokens.spacing.sm,
  },
  resourceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.cardMuted,
    borderRadius: designTokens.radii.md,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    gap: designTokens.spacing.sm,
  },
  resourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resourceLabel: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.label,
  },
  resourceValue: {
    marginLeft: 'auto',
    color: designTokens.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  heroFooter: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
  },
  metric: {
    flex: 1,
    backgroundColor: 'rgba(12, 14, 32, 0.86)',
    borderRadius: designTokens.radii.md,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    gap: designTokens.spacing.xs,
  },
  metricLabel: {
    color: designTokens.colors.textMuted,
    fontSize: designTokens.typography.label,
  },
  metricValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  metricMonospace: {
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.4,
  },
  sectionHeader: {
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
  },
  sectionTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.body,
    marginTop: designTokens.spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    borderRadius: designTokens.radii.md,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    gap: designTokens.spacing.xs,
  },
  summaryValue: {
    color: designTokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLabel: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.label,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  quickCard: {
    width: '48%',
  },
  quickInner: {
    borderRadius: designTokens.radii.lg,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
    backgroundColor: 'rgba(12, 14, 30, 0.92)',
  },
  quickAccent: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  quickTitle: {
    color: designTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  quickDesc: {
    color: designTokens.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  quickAction: {
    color: designTokens.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  settingPanel: {
    borderRadius: designTokens.radii.lg,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    backgroundColor: designTokens.colors.card,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xxl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.body,
  },
  settingValue: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.label,
  },
});
