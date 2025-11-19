import typography from './typography';

export const spacing = {
  grid: 8,
  section: 16,
  cardGap: 12,
  cardPadding: 16,
  cardPaddingVertical: 14,
  pageHorizontal: 16,
  pageVertical: 20,
};

export const shape = {
  blockRadius: 16,
  cardRadius: 16,
  buttonRadius: 16,
  capsuleRadius: 24,
};

export const shadowStyles = {
  card: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const tokens = {
  colors: {
    backgroundDeep: '#0B1116',
    accentCyan: '#00E5FF',
    accentCyanSoft: 'rgba(0,229,255,0.2)',
    accentCyanInner: 'rgba(0,229,255,0.6)',
    neonPurple: '#8A5CFF',
    neonGold: '#E8C26A',
  },
  spacing: {
    page: spacing.pageHorizontal,
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

export const typeScale = {
  title: { ...typography.heading },
  body: { ...typography.body },
  caption: { ...typography.captionCaps, fontSize: 12, lineHeight: 16 },
};
