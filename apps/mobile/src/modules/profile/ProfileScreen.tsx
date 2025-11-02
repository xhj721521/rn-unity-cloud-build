import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { useAppSelector } from '@state/hooks';
import { ProfileStackParamList } from '@app/navigation/types';
import { neonPalette } from '@theme/neonPalette';
import { getGlowStyle, useNeonPulse } from '@theme/animations';

const SETTINGS_ITEMS = [
  '钱包绑定 / 切换',
  '账户安全设置',
  '通知与战报推送',
  '个性化外观主题',
];

const QUICK_NAV_LINKS: {
  title: string;
  description: string;
  target: keyof ProfileStackParamList;
  accent: string;
}[] = [
  {
    title: '我的团队',
    description: '管理战队成员与职责',
    target: 'MyTeam',
    accent: neonPalette.accentMagenta,
  },
  {
    title: '我的仓库',
    description: '查看装备与 NFT 资源',
    target: 'MyInventory',
    accent: neonPalette.accentCyan,
  },
  {
    title: '我的邀请',
    description: '邀请好友同战获取奖励',
    target: 'MyInvites',
    accent: neonPalette.accentAmber,
  },
];

export const ProfileScreen = () => {
  const { data, loading, error } = useAccountSummary();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const teamMembers = useAppSelector((state) => state.team.members);
  const inventoryCount = useAppSelector((state) => state.inventory.items.length);
  const pendingInvites = useAppSelector(
    (state) => state.invites.records.filter((record) => record.status === 'pending').length,
  );
  const heroPulse = useNeonPulse({ duration: 5600 });

  return (
    <ScreenContainer scrollable>
      <LinearGradient
        colors={['#2C145F', '#140C34', '#04142C']}
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
                minOpacity: 0.16,
                maxOpacity: 0.34,
                minScale: 0.88,
                maxScale: 1.18,
              }),
            ]}
          />
          {loading ? (
            <LoadingPlaceholder label="同步指挥官资料..." />
          ) : error ? (
            <ErrorState
              title="账户信息暂不可用"
              description={error}
              onRetry={() => navigation.replace('ProfileMain')}
            />
          ) : data ? (
            <>
              <Text style={styles.heroEyebrow}>COMMAND CENTER</Text>
              <Text style={styles.heroTitle}>{data.displayName}</Text>
              <View style={styles.heroStats}>
                <ProfileStat label="等级" value={data.level.toString()} />
                <ProfileStat label="战斗评分" value={data.powerScore.toString()} />
                <ProfileStat label="NFT 数" value={data.nfts.length.toString()} />
              </View>
              <View style={styles.walletCard}>
                <Text style={styles.walletLabel}>主钱包</Text>
                <Text style={styles.walletValue}>{data.address}</Text>
              </View>
            </>
          ) : (
            <LoadingPlaceholder label="未发现账户信息" />
          )}
        </View>
      </LinearGradient>

      <SectionHeader
        title="作战总览"
        subtitle="团队、仓库与邀请的核心统计"
      />
      <View style={styles.summaryRow}>
        <SummaryCard
          label="战队成员"
          value={`${teamMembers.length} 位`}
          accent={neonPalette.accentMagenta}
        />
        <SummaryCard
          label="仓库资产"
          value={`${inventoryCount} 项`}
          accent={neonPalette.accentCyan}
        />
        <SummaryCard
          label="待处理邀请"
          value={`${pendingInvites} 条`}
          accent={neonPalette.accentAmber}
        />
      </View>

      <SectionHeader
        title="快捷入口"
        subtitle="快速前往常用配置与管理界面"
      />
      <View style={styles.quickGrid}>
        {QUICK_NAV_LINKS.map((link) => (
          <QuickNavButton
            key={link.target}
            title={link.title}
            description={link.description}
            accent={link.accent}
            onPress={() => navigation.navigate(link.target)}
          />
        ))}
      </View>

      <InfoCard title="快速设置">
        {SETTINGS_ITEMS.map((item) => (
          <View key={item} style={styles.settingRow}>
            <Text style={styles.settingText}>{item}</Text>
            <Text style={styles.settingStatus}>开发中</Text>
          </View>
        ))}
      </InfoCard>
    </ScreenContainer>
  );
};

const ProfileStat = ({ label, value }: { label: string; value: string }) => (
  <LinearGradient
    colors={['rgba(63, 242, 255, 0.2)', 'rgba(124, 92, 255, 0.18)']}
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
    colors={[accent, 'rgba(10, 11, 34, 0.92)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.summaryShell}
  >
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  </LinearGradient>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const QuickNavButton = ({
  title,
  description,
  accent,
  onPress,
}: {
  title: string;
  description: string;
  accent: string;
  onPress: () => void;
}) => {
  const pulse = useNeonPulse({ duration: 5400 });

  const accentStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0.9],
    }),
    transform: [
      {
        scaleX: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1.08],
        }),
      },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCardPressable,
        pressed ? styles.quickCardPressableActive : null,
      ]}
    >
      <LinearGradient
        colors={[accent, 'rgba(12, 11, 36, 0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickCard}
      >
        <Animated.View style={[styles.quickAccent, { backgroundColor: accent }, accentStyle]} />
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickDesc}>{description}</Text>
        <Text style={styles.quickAction}>立即前往 →</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heroShell: {
    borderRadius: 28,
    padding: 1,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(118, 88, 255, 0.4)',
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
  heroEyebrow: {
    color: neonPalette.accentCyan,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    color: neonPalette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
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
  walletCard: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(14, 14, 40, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(88, 63, 187, 0.55)',
  },
  walletLabel: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  walletValue: {
    color: neonPalette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: neonPalette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    color: neonPalette.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  summaryShell: {
    flex: 1,
    borderRadius: 18,
    padding: 1,
  },
  summaryCard: {
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(9, 10, 32, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(68, 45, 155, 0.45)',
  },
  summaryLabel: {
    color: neonPalette.textSecondary,
    fontSize: 12,
  },
  summaryValue: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 26,
  },
  quickCardPressable: {
    width: '48%',
    borderRadius: 20,
  },
  quickCardPressableActive: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  quickCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 34, 125, 0.6)',
    backgroundColor: 'rgba(7, 9, 26, 0.9)',
  },
  quickAccent: {
    width: 46,
    height: 6,
    borderRadius: 4,
    marginBottom: 10,
  },
  quickTitle: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  quickDesc: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  quickAction: {
    color: neonPalette.accentViolet,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingText: {
    color: neonPalette.textPrimary,
    fontSize: 13,
  },
  settingStatus: {
    color: neonPalette.textSecondary,
    fontSize: 12,
  },
});
