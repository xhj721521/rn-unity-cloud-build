import { StyleSheet } from 'react-native';

export type Rarity = 'common' | 'rare' | 'epic' | 'legend' | 'mythic';
export type NeonBadgeTone = 'pending' | 'ok' | 'danger' | 'soon';

const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9AA0A6',
  rare: '#31C3FF',
  epic: '#A653FF',
  legend: '#FFB547',
  mythic: '#FF3D81',
};

const BADGE_TONES: Record<NeonBadgeTone, { background: string; border: string; text: string }> = {
  pending: {
    background: 'rgba(49,195,255,0.12)',
    border: 'rgba(49,195,255,0.4)',
    text: '#31C3FF',
  },
  ok: {
    background: 'rgba(0,215,166,0.12)',
    border: 'rgba(0,215,166,0.42)',
    text: '#00D7A6',
  },
  danger: {
    background: 'rgba(243,106,106,0.12)',
    border: 'rgba(243,106,106,0.45)',
    text: '#F36A6A',
  },
  soon: {
    background: 'rgba(125,177,255,0.12)',
    border: 'rgba(125,177,255,0.38)',
    text: '#B0C9FF',
  },
};

export const getRarityColor = (rarity: Rarity) => RARITY_COLORS[rarity];

export const rarityGlow = (rarity: Rarity) => {
  const color = RARITY_COLORS[rarity];
  return {
    borderColors: [color, `${color}80` as string],
    shadowStyle: {
      shadowColor: color,
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
  };
};

export const glassCard = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(10,16,41,0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});

export const getBadgeToneStyle = (tone: NeonBadgeTone) => BADGE_TONES[tone];
