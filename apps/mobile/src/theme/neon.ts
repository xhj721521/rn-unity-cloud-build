import { StyleSheet } from 'react-native';

export type Rarity = 'common' | 'rare' | 'epic' | 'legend' | 'mythic';

const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9AA0A6',
  rare: '#31C3FF',
  epic: '#A653FF',
  legend: '#FFB547',
  mythic: '#FF3D81',
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
