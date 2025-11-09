import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import NeonButton from '@components/NeonButton';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import HomeBackground from '../../ui/HomeBackground';
import HomeSkeleton from '@modules/home/HomeSkeleton';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { ProfileStackParamList } from '@app/navigation/types';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { useNeonPulse } from '@theme/animations';
import { languageLabels, supportedLanguages, translate as t } from '@locale/strings';

const heroBackground = require('../../assets/profile/ph_hero_bg.png');
const avatarPlaceholder = require('../../assets/profile/ph_avatar.png');
const tileA = require('../../assets/profile/ph_tile_a.png');
const tileB = require('../../assets/profile/ph_tile_b.png');
const tileC = require('../../assets/profile/ph_tile_c.png');
const tileD = require('../../assets/profile/ph_tile_d.png');
const tileE = require('../../assets/profile/ph_tile_e.png');
const tileF = require('../../assets/profile/ph_tile_f.png');

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';

type EntryConfig = {
  key: string;
  titleKey: string;
  descKey: string;
  background: ImageSourcePropType;
  glyph: QuickGlyphId;
  route?: keyof ProfileStackParamList;
  badgeKey?: string;
};

const entryConfigs: EntryConfig[] = [
  {
    key: 'team',
    titleKey: 'my.entry.team.title',
    descKey: 'my.entry.team.desc',
    background: tileA,
    glyph: 'team',
    route: 'MyTeam',
  },
  {
    key: 'storage',
    titleKey: 'my.entry.storage.title',
    descKey: 'my.entry.storage.desc',
    background: tileB,
    glyph: 'storage',
    route: 'MyInventory',
  },
  {
    key: 'invite',
    titleKey: 'my.entry.invite.title',
    descKey: 'my.entry.invite.desc',
    background: tileC,
    glyph: 'invite',
    route: 'MyInvites',
  },
  {
    key: 'member',
    titleKey: 'my.entry.member.title',
    descKey: 'my.entry.member.desc',
    background: tileD,
    glyph: 'member',
    route: 'Member',
    badgeKey: 'my.entry.member.badge.inactive',
  },
  {
    key: 'reports',
    titleKey: 'my.entry.reports.title',
    descKey: 'my.entry.reports.desc',
    background: tileE,
    glyph: 'reports',
    route: 'Reports',
  },
  {
    key: 'highlights',
    titleKey: 'my.entry.highlights.title',
    descKey: 'my.entry.highlights.desc',
    background: tileF,
    glyph: 'highlights',
    route: 'Highlights',
  },
];

const highlightCards = [
  {
    id: 'hl-1',
    titleKey: 'my.highlights.mock1',
    tagKey: 'my.highlights.tag.collect',
    level: 'Lv.3',
    image: tileC,
  },
  {
    id: 'hl-2',
    titleKey: 'my.highlights.mock2',
    tagKey: 'my.highlights.tag.report',
    level: 'Lv.2',
    image: tileD,
  },
  {
    id: 'hl-3',
    titleKey: 'my.highlights.mock3',
    tagKey: 'my.highlights.tag.reward',
    level: 'Rare',
    image: tileE,
  },
];

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAccountSummary();
  const teamMembers = useAppSelector((state) => state.team?.members) ?? [];
  const inventoryItems = useAppSelector((state) => state.inventory?.items) ?? [];
  const [language, setLanguage] = useState<(typeof supportedLanguages)[number]>('zh-CN');

  const displayName = data?.displayName ?? 'Pilot Zero';
  const level = data?.level ?? 12;
  const arcAmount = useMemo(() => formatAssetAmount(data?.tokens, ARC_TOKEN_ID), [data?.tokens]);
  const oreAmount = useMemo(() => formatAssetAmount(data?.tokens, ORE_TOKEN_ID), [data?.tokens]);
  const minersTotal = teamMembers.length || 14;
  const minersActive = Math.max(1, Math.floor(minersTotal * 0.7));
  const nftCount = inventoryItems.length || 8;
  const mapUnlocked = data?.mapsUnlocked ?? 6;
  const mapTotal = data?.mapsTotal ?? 12;
  const rareShards = data?.rareShards ?? 1240;
  const kycStatus = data?.kycStatus ?? 'pending';
  const isVerified = kycStatus === 'verified';

  const statusPulse = useNeonPulse({ duration: 3200 });
  const assetPulse = useNeonPulse({ duration: 6400 });
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);
  const mapProgressAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ratio = mapTotal > 0 ? mapUnlocked / mapTotal : 0;
    Animated.timing(mapProgressAnimated, {
      toValue: ratio,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [mapProgressAnimated, mapTotal, mapUnlocked]);

  const statsTiles = useMemo(
    () => [
      {
        key: 'miners',
        title: t('my.stats.miners'),
        value: formatNumber(minersTotal),
        subtitle: t('my.stats.miners.active', { active: minersActive, total: minersTotal }),
        glyph: 'miner' as QuickGlyphId,
        onPress: () => navigation.navigate('MyTeam'),
      },
      {
        key: 'nft',
        title: t('my.stats.nft'),
        value: formatNumber(nftCount),
        subtitle: t('my.stats.nft.subtitle'),
        glyph: 'nft' as QuickGlyphId,
        onPress: () => navigation.navigate('MyInventory'),
      },
      {
        key: 'maps',
        title: t('my.stats.maps'),
        value: t('my.stats.maps.value', { unlocked: mapUnlocked, total: mapTotal }),
        subtitle: t('my.stats.maps.subtitle'),
        glyph: 'map' as QuickGlyphId,
        progress: mapTotal > 0 ? mapUnlocked / mapTotal : 0,
      },
      {
        key: 'shards',
        title: t('my.stats.shards.rare'),
        value: formatCompactNumber(rareShards),
        subtitle: t('my.stats.shards.subtitle'),
        glyph: 'shard' as QuickGlyphId,
      },
    ],
    [mapUnlocked, mapTotal, minersActive, minersTotal, navigation, nftCount, rareShards],
  );

  const entryTiles = useMemo(
    () =>
      entryConfigs.map((entry) => {
        const badgeKey =
          entry.key === 'member'
            ? data?.membershipTier === 'vip'
              ? 'my.entry.member.badge.active'
              : 'my.entry.member.badge.inactive'
            : entry.badgeKey;
        return {
          ...entry,
          title: t(entry.titleKey),
          desc: t(entry.descKey),
          badgeLabel: badgeKey ? t(badgeKey) : undefined,
        };
      }),
    [data?.membershipTier],
  );

  const handleEntryPress = (entry: EntryConfig) => {
    if (entry.route) {
      navigation.navigate(entry.route);
      return;
    }
    Alert.alert(t('common.notice'), t('my.placeholder.entrySoon'));
  };

  const handleLanguage = () => {
    const labels = supportedLanguages.map((code) => `${languageLabels[code]} (${code})`);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t('my.language.sheetTitle'),
          options: [...labels, '取消'],
          cancelButtonIndex: labels.length,
        },
        (index) => {
          if (index >= labels.length) {
            return;
          }
          const next = supportedLanguages[index];
          setLanguage(next);
          Alert.alert(languageLabels[next], t('my.language.toast'));
        },
      );
    } else {
      Alert.alert(t('my.language.sheetTitle'), t('my.language.toast'));
    }
  };

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette background={background}>
        <HomeSkeleton />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer variant="plain" edgeVignette background={background}>
        <View style={styles.centerBox}>
          <ErrorState
            title={t('my.error.title')}
            description={error}
            onRetry={() => dispatch(loadAccountSummary())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <NeonCard
        backgroundSource={heroBackground}
        borderRadius={shape.blockRadius + 4}
        overlayColor="rgba(5,7,16,0.58)"
        contentPadding={20}
        style={styles.heroCard}
      >
        <LinearGradient
          colors={['rgba(4,5,12,0.85)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.45 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.heroHeader}>
          <View style={styles.identityRow}>
            <Image source={avatarPlaceholder} style={styles.avatar} />
            <View>
              <Text style={styles.heroTitle}>{t('my.hero.title', { name: displayName })}</Text>
              <Text style={styles.heroSubtitle}>{t('my.hero.subtitle')}</Text>
            </View>
          </View>
          <View style={styles.heroMeta}>
            <StatusChip label={t('my.network.stable')} pulse={statusPulse} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{t('my.hero.level', { level })}</Text>
            </View>
            <RipplePressable style={styles.iconGhostButton} onPress={handleLanguage}>
              <QuickGlyph id="globe" size={20} />
            </RipplePressable>
          </View>
        </View>
        <View style={styles.assetRow}>
          <AssetChip
            label={t('my.hero.asset.arc')}
            amount={arcAmount}
            unit="枚"
            icon="arc"
            pulse={assetPulse}
            onPress={() => navigation.navigate('Wallet')}
          />
          <AssetChip
            label={t('my.hero.asset.ore')}
            amount={oreAmount}
            unit="颗"
            icon="ore"
            pulse={assetPulse}
            onPress={() => navigation.navigate('Wallet')}
          />
        </View>
        <View style={styles.heroActions}>
          <NeonButton title={t('my.cta.invite')} onPress={() => navigation.navigate('MyInvites')} />
          <RipplePressable
            style={styles.ghostButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.ghostButtonText}>{t('my.cta.export')}</Text>
          </RipplePressable>
        </View>
      </NeonCard>

      <SectionHeading title={t('my.stats.section')} />
      <View style={styles.statsGrid}>
        {statsTiles.map((tile) => (
          <RipplePressable
            key={tile.key}
            style={styles.statPressable}
            onPress={tile.onPress}
            disabled={!tile.onPress}
          >
            <NeonCard
              borderRadius={shape.cardRadius}
              overlayColor="rgba(9,11,22,0.78)"
              contentPadding={16}
              style={styles.statCard}
            >
              <View style={styles.statRow}>
                <QuickGlyph id={tile.glyph} size={26} />
                <View style={styles.statValueBlock}>
                  <Text style={styles.statLabel}>{tile.title}</Text>
                  <AnimatedText
                    style={[styles.statValue, tile.key === 'maps' ? styles.statValueSmall : null]}
                  >
                    {tile.value}
                  </AnimatedText>
                  <Text style={styles.statSubtitle}>{tile.subtitle}</Text>
                </View>
                {tile.key === 'maps' ? (
                  <MapProgress progressAnimated={mapProgressAnimated} />
                ) : null}
              </View>
            </NeonCard>
          </RipplePressable>
        ))}
      </View>

      <SectionHeading title={t('my.matrix.section')} />
      <View style={styles.entryGrid}>
        {entryTiles.map((entry) => (
          <RipplePressable
            key={entry.key}
            style={styles.entryPressable}
            onPress={() => handleEntryPress(entry)}
          >
            <NeonCard
              borderRadius={shape.cardRadius}
              overlayColor="rgba(8,10,20,0.6)"
              backgroundSource={entry.background}
              contentPadding={18}
              style={styles.entryCard}
            >
              <View style={styles.entryTopRow}>
                <QuickGlyph id={entry.glyph} size={24} />
                {entry.badgeLabel ? (
                  <View style={styles.entryBadge}>
                    <Text style={styles.entryBadgeText}>{entry.badgeLabel}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDesc} numberOfLines={2}>
                {entry.desc}
              </Text>
            </NeonCard>
          </RipplePressable>
        ))}
      </View>

      <SectionHeading
        title={t('my.highlights.section')}
        actionLabel={t('my.highlights.viewAll')}
        onAction={() => navigation.navigate('Highlights')}
      />
      <View style={styles.highlightContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightRow}
        >
          {highlightCards.map((item) => (
            <NeonCard
              key={item.id}
              borderRadius={shape.cardRadius}
              overlayColor="rgba(6,8,16,0.5)"
              backgroundSource={item.image}
              contentPadding={18}
              style={styles.highlightCard}
            >
              <Text style={styles.highlightTitle}>{t(item.titleKey)}</Text>
              <View style={styles.highlightFooter}>
                <Text style={styles.highlightTag}>{t(item.tagKey)}</Text>
                <Text style={styles.highlightLevel}>{item.level}</Text>
              </View>
            </NeonCard>
          ))}
        </ScrollView>
      </View>

      {!isVerified ? (
        <RipplePressable style={styles.banner} onPress={() => navigation.navigate('KYC')}>
          <Text style={styles.bannerText}>{t('my.banner.kyc')}</Text>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>{t('my.banner.kyc.cta')}</Text>
          </View>
        </RipplePressable>
      ) : null}

      <SectionHeading title={t('my.settings.section')} />
      <View style={styles.settingsBox}>
        <SettingRow
          label={t('my.settings.kyc')}
          value={isVerified ? t('member.vip') : t('member.non')}
          onPress={() => navigation.navigate('KYC')}
        />
        <SettingRow
          label={t('my.settings.language')}
          value={t('my.settings.language.status', { lang: languageLabels[language] })}
          onPress={handleLanguage}
        />
        <SettingRow label={t('my.settings.notifications')} value={t('my.settings.soon')} disabled />
        <SettingRow label={t('my.settings.theme')} value={t('my.settings.soon')} disabled />
        <SettingRow
          label={t('my.settings.records')}
          value=""
          onPress={() => navigation.navigate('Wallet')}
        />
      </View>
    </ScreenContainer>
  );
};

const StatusChip = ({ label, pulse }: { label: string; pulse: Animated.Value }) => {
  const dotStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
    transform: [
      {
        scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] }),
      },
    ],
  };
  return (
    <View style={styles.statusChip}>
      <Animated.View style={[styles.statusDot, dotStyle]} />
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
};

const AssetChip = ({
  label,
  amount,
  unit,
  icon,
  pulse,
  onPress,
}: {
  label: string;
  amount: string;
  unit: string;
  icon: QuickGlyphId;
  pulse: Animated.Value;
  onPress: () => void;
}) => {
  const animatedStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
  };
  return (
    <RipplePressable style={styles.assetChipPressable} onPress={onPress}>
      <View style={styles.assetChip}>
        <QuickGlyph id={icon} size={22} />
        <View style={styles.assetTexts}>
          <Text style={styles.assetLabel}>{label}</Text>
          <AnimatedText style={[styles.assetValue, animatedStyle]}>
            {amount}
            <Text style={styles.assetUnit}> {unit}</Text>
          </AnimatedText>
        </View>
      </View>
    </RipplePressable>
  );
};

const MapProgress = ({ progressAnimated }: { progressAnimated: Animated.Value }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progressAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });
  return (
    <Svg width={60} height={60} style={styles.mapRing}>
      <Circle
        cx={30}
        cy={30}
        r={radius}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={2}
        fill="none"
      />
      <AnimatedCircle
        cx={30}
        cy={30}
        r={radius}
        stroke={palette.primary}
        strokeWidth={3}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
};

const SectionHeading = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && onAction ? (
      <RipplePressable style={styles.viewAllBtn} onPress={onAction}>
        <Text style={styles.viewAllText}>{actionLabel}</Text>
      </RipplePressable>
    ) : null}
  </View>
);

const SettingRow = ({
  label,
  value,
  onPress,
  disabled,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  disabled?: boolean;
}) => (
  <RipplePressable
    style={[styles.settingRow, disabled && styles.settingRowDisabled]}
    onPress={onPress}
    disabled={disabled || !onPress}
  >
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
  </RipplePressable>
);

const formatNumber = (value: number) => new Intl.NumberFormat('zh-CN').format(value);

const formatCompactNumber = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${value}`;
};

const formatAssetAmount = (
  tokens: { id: string; amount: string }[] | undefined,
  tokenId: string,
) => {
  const raw = tokens?.find((token) => token.id === tokenId)?.amount;
  if (!raw) {
    return '--';
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return raw;
  }
  return new Intl.NumberFormat('zh-CN').format(numeric);
};

const styles = StyleSheet.create({
  centerBox: {
    paddingVertical: spacing.section * 4,
  },
  heroCard: {
    minHeight: 220,
    marginBottom: spacing.section,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.cardGap,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroTitle: {
    ...typography.heading,
    fontSize: 18,
    textShadowRadius: 10,
  },
  heroSubtitle: {
    ...typography.body,
    marginTop: 2,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(5,9,20,0.65)',
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.success,
    marginRight: 6,
  },
  statusText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(9,11,24,0.7)',
  },
  levelText: {
    ...typography.captionCaps,
    color: palette.accent,
  },
  iconGhostButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(6,8,18,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  assetChipPressable: {
    flex: 1,
  },
  assetChip: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(7,10,22,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assetTexts: {
    flex: 1,
  },
  assetLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  assetValue: {
    ...typography.numeric,
    color: palette.text,
  },
  assetUnit: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.cardGap,
    gap: spacing.cardGap,
  },
  ghostButton: {
    borderRadius: shape.capsuleRadius,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(9,11,22,0.55)',
    flex: 1,
    alignItems: 'center',
  },
  ghostButtonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.cardGap,
    rowGap: spacing.cardGap,
  },
  statPressable: {
    width: '48%',
  },
  statCard: {
    minHeight: 120,
  },
  statRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statValueBlock: {
    flex: 1,
  },
  statLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  statValue: {
    ...typography.numeric,
    color: palette.text,
    marginTop: 2,
  },
  statValueSmall: {
    fontSize: 18,
  },
  statSubtitle: {
    ...typography.body,
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  mapRing: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  entryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.cardGap,
    rowGap: spacing.cardGap,
    marginTop: spacing.cardGap,
  },
  entryPressable: {
    width: '48%',
  },
  entryCard: {
    minHeight: 132,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryBadge: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(5,7,18,0.6)',
  },
  entryBadgeText: {
    ...typography.captionCaps,
    color: palette.muted,
  },
  entryTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: 4,
  },
  entryDesc: {
    ...typography.body,
    color: palette.sub,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.section,
    marginBottom: spacing.cardGap / 2,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  viewAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllText: {
    ...typography.captionCaps,
    color: palette.primary,
  },
  highlightContainer: {
    marginTop: spacing.cardGap,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    paddingRight: spacing.cardGap,
  },
  highlightCard: {
    width: 240,
    height: 120,
  },
  highlightTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  highlightFooter: {
    marginTop: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightTag: {
    ...typography.captionCaps,
    color: palette.primary,
  },
  highlightLevel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  banner: {
    marginTop: spacing.section,
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 208, 0, 0.4)',
    backgroundColor: 'rgba(255, 208, 0, 0.12)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  bannerText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  bannerButton: {
    borderRadius: shape.capsuleRadius,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  bannerButtonText: {
    ...typography.captionCaps,
    color: palette.primary,
  },
  settingsBox: {
    marginTop: spacing.cardGap,
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(8,10,24,0.78)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  settingRowDisabled: {
    opacity: 0.6,
  },
  settingLabel: {
    ...typography.body,
    color: palette.text,
  },
  settingValue: {
    ...typography.captionCaps,
    color: palette.sub,
  },
});

export default ProfileScreen;
