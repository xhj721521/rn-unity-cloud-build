import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { ItemVisualConfig } from '@domain/items/itemVisualConfig';
import { resolveIconSource } from '@domain/items/itemIconResolver';
import { translate as t } from '@locale/strings';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const TIER_GRADIENTS: Record<number, [string, string]> = {
  1: ['#41C0FF', '#7FE3FF'],
  2: ['#3DFFB8', '#8BFFE0'],
  3: ['#C28BFF', '#E1C0FF'],
  4: ['#FFD45A', '#FFE7A1'],
  5: ['#FF9263', '#FFC1A3'],
  6: ['#FF5AD5', '#FF9FE8'],
};

const TYPE_BADGE_BG: Record<string, string> = {
  ore: 'rgba(65,192,255,0.18)',
  shard: 'rgba(194,139,255,0.18)',
  nft: 'rgba(255,146,99,0.18)',
};

const TYPE_BADGE_BORDER: Record<string, string> = {
  ore: 'rgba(65,192,255,0.6)',
  shard: 'rgba(194,139,255,0.6)',
  nft: 'rgba(255,146,99,0.6)',
};

const OWNERSHIP_COLORS = {
  personal: { bg: 'rgba(61,255,184,0.25)', border: '#3DFFB8' },
  team: { bg: 'rgba(194,139,255,0.25)', border: '#C28BFF' },
};

type EnergyItemIconProps = {
  visual: ItemVisualConfig;
  size?: number;
  icon?: ImageSourcePropType;
  showTypeBadge?: boolean;
  showOwnership?: boolean;
};

const PersonGlyph = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Circle cx={12} cy={8} r={4} fill={color} opacity={0.9} />
    <Path
      d="M4 20c0-4.5 3.5-6.5 8-6.5s8 2 8 6.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.8}
    />
  </Svg>
);

const TeamGlyph = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Circle cx={8} cy={8} r={3} fill={color} opacity={0.8} />
    <Circle cx={16} cy={8} r={3} fill={color} opacity={0.8} />
    <Path
      d="M3.5 20c0-3.2 2.5-5 5.5-5 3 0 5.5 1.8 5.5 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.8}
    />
    <Path
      d="M9.5 19.5c0-2.7 2.4-4.5 5-4.5s5 1.8 5 4.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.7}
    />
  </Svg>
);

const EnergyItemIcon: React.FC<EnergyItemIconProps> = ({
  visual,
  size = 68,
  icon,
  showTypeBadge = true,
  showOwnership = true,
}) => {
  const tier = visual.tier;
  const gradient = TIER_GRADIENTS[tier] ?? TIER_GRADIENTS[1];
  const diameter = size;
  const inner = size - 12;
  const iconSize = inner - 18;
  const roman = ROMAN[tier - 1] ?? `${tier}`;
  const iconSource = icon ?? resolveIconSource(visual);
  const itemType = visual.itemType ?? 'ore';
  const typeBg = TYPE_BADGE_BG[itemType] ?? 'rgba(65,192,255,0.18)';
  const typeBorder = TYPE_BADGE_BORDER[itemType] ?? 'rgba(65,192,255,0.45)';
  const ownershipColors = visual.ownership ? OWNERSHIP_COLORS[visual.ownership] : undefined;

  return (
    <View style={{ width: diameter }}>
      {showTypeBadge ? (
        <View style={[styles.typeBadge, { borderColor: typeBorder, backgroundColor: typeBg }]}>
          <Text style={styles.typeBadgeText}>{visual.typeLabel ?? t('item.type.ore')}</Text>
        </View>
      ) : null}
      <LinearGradient colors={gradient} style={[styles.outerCircle, { width: diameter, height: diameter, borderRadius: diameter / 2 }]}>
        <View style={[styles.innerCircle, { width: inner, height: inner, borderRadius: inner / 2 }]}>
          <Image source={iconSource} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
        </View>
      </LinearGradient>
      <View style={styles.tierBadge}>
        <Text style={[styles.tierText, { color: gradient[0] }]}>{roman}</Text>
      </View>
      {showOwnership && ownershipColors ? (
        <View style={[styles.ownershipBadge, { borderColor: ownershipColors.border, backgroundColor: ownershipColors.bg }]}>
          {visual.ownership === 'team' ? (
            <TeamGlyph color="#EAF2FF" />
          ) : (
            <PersonGlyph color="#EAF2FF" />
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  innerCircle: {
    backgroundColor: 'rgba(6,10,24,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  typeBadge: {
    position: 'absolute',
    top: -8,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 2,
  },
  typeBadgeText: {
    color: '#E5F2FF',
    fontSize: 10,
    fontWeight: '600',
  },
  tierBadge: {
    position: 'absolute',
    top: -10,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(11,15,32,0.9)',
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ownershipBadge: {
    position: 'absolute',
    bottom: -6,
    left: -6,
    borderRadius: 16,
    borderWidth: 1,
    padding: 2,
  },
});

export default EnergyItemIcon;
