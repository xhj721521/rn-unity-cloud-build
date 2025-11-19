export const fmt = (n: number) => n.toLocaleString();

export const crownColors = (rank: number) => {
  if (rank === 1) return ['#FFD66B', '#FFE8A8'];
  if (rank === 2) return ['#C7D2FF', '#E2E7FF'];
  if (rank === 3) return ['#B794F6', '#D8C2FF'];
  return ['#2A3C67', '#3D5B9A'];
};

export const isTop3 = (rank: number) => rank >= 1 && rank <= 3;
