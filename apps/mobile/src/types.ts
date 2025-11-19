export type BoardType = 'invite' | 'team' | 'mining';
export type BoardScope = 'daily' | 'weekly' | 'monthly';

export type RankItem = {
  id: string;
  rank: number;
  nickname: string;
  avatarUrl?: string;
  badge?: string | null;
  score: number;
  primaryValue: number;
  secondaryValue?: number;
};

export type LeaderboardResponse = {
  type: BoardType;
  scope: BoardScope;
  myRank?: { rank: number; score: number; diffToNext?: number };
  items: RankItem[];
  nextCursor?: string;
};
