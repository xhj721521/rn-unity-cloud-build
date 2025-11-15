import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fateColors, fateRadius } from '../fateTheme';

type Props = {
  width: number;
  displayName: string;
  arcAmount: string;
  oreAmount: string;
  backgroundSource: ImageSourcePropType;
  onPress?: () => void;
};

const FateHeroCard = ({
  width,
  displayName,
  arcAmount,
  oreAmount,
  backgroundSource,
  onPress,
}: Props) => {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { width },
        onPress && pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <ImageBackground source={backgroundSource} resizeMode="cover" style={styles.card}>
        <LinearGradient
          colors={['rgba(5,8,20,0.92)', 'rgba(5,8,20,0.4)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.identity}>
              <Text style={styles.caption}>命运矿场中心</Text>
              <Text style={styles.player} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
            <View style={styles.statusChip}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>网络：稳定</Text>
            </View>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.heroTitle}>命运矿场</Text>
            <Text style={styles.heroSubtitle}>个人矿场 · 团队矿场 · 命运试炼塔</Text>
          </View>
          <View style={styles.resourceRow}>
            <View style={styles.resourcePill}>
              <Text style={styles.resourceLabel}>ARC 余额</Text>
              <Text style={styles.resourceValue}>{arcAmount}</Text>
            </View>
            <View style={styles.resourcePill}>
              <Text style={styles.resourceLabel}>矿石数量</Text>
              <Text style={styles.resourceValue}>{oreAmount}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: fateRadius.hero,
    overflow: 'hidden',
  },
  card: {
    borderRadius: fateRadius.hero,
    minHeight: 196,
     borderWidth: 1,
     borderColor: fateColors.borderSoft,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
  },
  avatarText: {
    fontSize: 20,
    color: fateColors.textPrimary,
    fontWeight: '600',
  },
  identity: {
    flex: 1,
  },
  caption: {
    fontSize: 12,
    color: fateColors.textMuted,
    letterSpacing: 0.5,
  },
  player: {
    marginTop: 4,
    fontSize: 18,
    color: fateColors.textPrimary,
    fontWeight: '600',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: fateRadius.chip,
    borderWidth: 1,
    borderColor: fateColors.success,
    backgroundColor: 'rgba(5,250,160,0.16)',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: fateColors.success,
  },
  statusText: {
    fontSize: 12,
    color: fateColors.textPrimary,
  },
  titleBlock: {
    gap: 6,
  },
  heroTitle: {
    fontSize: 26,
    color: fateColors.textPrimary,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 13,
    color: fateColors.textSecondary,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resourcePill: {
    flex: 1,
    borderRadius: fateRadius.chip,
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resourceLabel: {
    fontSize: 12,
    color: fateColors.textMuted,
    marginBottom: 4,
  },
  resourceValue: {
    fontSize: 18,
    color: fateColors.textPrimary,
    fontWeight: '600',
  },
});

export default FateHeroCard;
