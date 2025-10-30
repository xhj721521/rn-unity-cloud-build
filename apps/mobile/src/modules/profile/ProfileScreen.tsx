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
  '\u94B1\u5305\u7ED1\u5B9A / \u5207\u6362',
  '\u8D26\u6237\u5B89\u5168\u8BBE\u7F6E',
  '\u901A\u77E5\u4E0E\u6218\u62A5\u63A8\u9001',
  '\u4E2A\u6027\u5316\u5916\u89C2\u4E3B\u9898',
];

const QUICK_NAV_LINKS: {
  title: string;
  description: string;
  target: keyof ProfileStackParamList;
  accent: string;
}[] = [
  {
    title: '\u6211\u7684\u56E2\u961F',
    description: '\u7BA1\u7406\u6218\u961F\u6210\u5458\u4E0E\u804C\u8D23',
    target: 'MyTeam',
    accent: neonPalette.accentMagenta,
  },
  {
    title: '\u6211\u7684\u4ED3\u5E93',
    description: '\u67E5\u770B\u88C5\u5907\u4E0E NFT \u8D44\u6E90',
    target: 'MyInventory',
    accent: neonPalette.accentCyan,
  },
  {
    title: '\u6211\u7684\u9080\u8BF7',
    description: '\u9080\u8BF7\u597D\u53CB\u540C\u6218\u83B7\u53D6\u5956\u52B1',
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
            <LoadingPlaceholder label="\u540C\u6B65\u6307\u6325\u5B98\u8D44\u6599..." />
          ) : error ? (
            <ErrorState
              title="\u8D26\u6237\u4FE1\u606F\u6682\u4E0D\u53EF\u7528"
              description={error}
              onRetry={() => navigation.replace('ProfileMain')}
            />
          ) : data ? (
            <>
              <Text style={styles.heroEyebrow}>COMMAND CENTER</Text>
              <Text style={styles.heroTitle}>{data.displayName}</Text>
              <View style={styles.heroStats}>
                <ProfileStat label="\u7B49\u7EA7" value={data.level.toString()} />
                <ProfileStat label="\u6218\u6597\u8BC4\u5206" value={data.powerScore.toString()} />
                <ProfileStat label="NFT \u6570" value={data.nfts.length.toString()} />
              </View>
              <View style={styles.walletCard}>
                <Text style={styles.walletLabel}>\u4E3B\u94B1\u5305</Text>
                <Text style={styles.walletValue}>{data.address}</Text>
              </View>
            </>
          ) : (
            <LoadingPlaceholder label="\u672A\u53D1\u73B0\u8D26\u6237\u4FE1\u606F" />
          )}
        </View>
      </LinearGradient>

      <SectionHeader
        title="\u4F5C\u6218\u603B\u89C8"
        subtitle="\u56E2\u961F\u3001\u4ED3\u5E93\u4E0E\u9080\u8BF7\u7684\u6838\u5FC3\u7EDF\u8BA1"
      />
      <View style={styles.summaryRow}>
        <SummaryCard
          label="\u6218\u961F\u6210\u5458"
          value={`${teamMembers.length} \u4F4D`}
          accent={neonPalette.accentMagenta}
        />
        <SummaryCard
          label="\u4ED3\u5E93\u8D44\u4EA7"
          value={`${inventoryCount} \u9879`}
          accent={neonPalette.accentCyan}
        />
        <SummaryCard
          label="\u5F85\u5904\u7406\u9080\u8BF7"
          value={`${pendingInvites} \u6761`}
          accent={neonPalette.accentAmber}
        />
      </View>

      <SectionHeader
        title="\u5FEB\u6377\u5165\u53E3"
        subtitle="\u5FEB\u901F\u524D\u5F80\u5E38\u7528\u914D\u7F6E\u4E0E\u7BA1\u7406\u754C\u9762"
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

      <InfoCard title="\u5FEB\u901F\u8BBE\u7F6E">
        {SETTINGS_ITEMS.map((item) => (
          <View key={item} style={styles.settingRow}>
            <Text style={styles.settingText}>{item}</Text>
            <Text style={styles.settingStatus}>\u5F00\u53D1\u4E2D</Text>
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
        <Text style={styles.quickAction}>\u7ACB\u5373\u524D\u5F80 \u2192</Text>
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
