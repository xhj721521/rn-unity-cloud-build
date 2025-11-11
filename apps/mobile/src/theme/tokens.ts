export const tokens = {
  colors: {
    backgroundDeep: '#0B1116',
    accentCyan: '#00E5FF',
    accentCyanSoft: 'rgba(0,229,255,0.2)',
    accentCyanInner: 'rgba(0,229,255,0.6)',
  },
  spacing: {
    page: 16,
    inventoryGap: 8,
  },
  radius: {
    inventoryOuter: 12,
    inventoryInner: 10,
  },
  shadow: {
    cyanGlow: {
      shadowColor: 'rgba(0,229,255,0.6)',
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    },
  },
};

export const rarityColors: Record<'common' | 'uncommon' | 'rare' | 'epic' | 'legend', string> = {
  common: '#98A2B3',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  epic: '#A855F7',
  legend: '#F59E0B',
};
