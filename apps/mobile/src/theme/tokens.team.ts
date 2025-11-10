export const teamTokens = {
  colors: {
    border: ['#20E0E8', '#E8C26A'] as [string, string],
    backgroundOverlay: 'rgba(8,10,20,0.85)',
    pattern: 'rgba(32, 224, 232, 0.12)',
    online: '#4BD180',
    offline: '#8A94A6',
    role: {
      leader: '#E8C26A',
      officer: '#8B5CFF',
      member: '#28A7FF',
    },
    lockOverlay: 'rgba(3,5,12,0.62)',
    textMain: '#F4F6FF',
    textSub: '#A8B0CC',
  },
  layout: {
    gapPage: 12,
    gapGrid: 12,
    radiusCard: 24,
    radiusPill: 14,
    avatarSize: 56,
  },
};

export type TeamRole = keyof typeof teamTokens.colors.role;
