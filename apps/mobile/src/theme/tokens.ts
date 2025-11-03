export const spacing = {
  grid: 8,
  section: 16,
  cardGap: 12,
  pageHorizontal: 16,
  pageVertical: 20,
};

export const shape = {
  blockRadius: 20,
  cardRadius: 18,
  buttonRadius: 16,
  capsuleRadius: 14,
};

export const shadowStyles = {
  card: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
};

export const typeScale = {
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};
