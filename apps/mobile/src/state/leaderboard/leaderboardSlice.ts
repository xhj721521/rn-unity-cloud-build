import { createSlice } from '@reduxjs/toolkit';

export type LeaderboardCategory = 'inviter' | 'team' | 'wealth';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  userId: string;
  score: number;
};

type LeaderboardData = Record<
  LeaderboardCategory,
  Record<
    LeaderboardPeriod,
    {
      entries: LeaderboardEntry[];
      myRank: LeaderboardEntry | null;
    }
  >
>;

type LeaderboardRewards = Record<
  LeaderboardCategory,
  {
    top1To3: string;
    top4To10: string;
  }
>;

type LeaderboardState = {
  data: LeaderboardData;
  rewards: LeaderboardRewards;
};

const mockEntries = (prefix: string, scoreBase: number): LeaderboardEntry[] =>
  Array.from({ length: 10 }, (_, index) => ({
    rank: index + 1,
    playerName: `${prefix} · ${index + 1}号指挥官`,
    userId: `${prefix}-${index + 1}`,
    score: Math.max(0, scoreBase - index * 47),
  }));

const myUserId = 'pilot-zero';

const injectMyRank = (
  entries: LeaderboardEntry[],
  override?: LeaderboardEntry,
): {
  entries: LeaderboardEntry[];
  myRank: LeaderboardEntry | null;
} => {
  const list = [...entries];
  if (override) {
    const idx = list.findIndex((item) => item.userId === override.userId);
    if (idx >= 0) {
      list[idx] = override;
    } else {
      list.push(override);
      list.sort((a, b) => a.rank - b.rank);
    }
  }
  const mine =
    list.find((item) => item.userId === myUserId) ?? override ?? null;
  return { entries: list.slice(0, 10), myRank: mine };
};

const initialState: LeaderboardState = {
  data: {
    inviter: {
      daily: injectMyRank(mockEntries('邀请榜·日榜', 1200), {
        rank: 6,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 978,
      }),
      weekly: injectMyRank(mockEntries('邀请榜·周榜', 5400)),
      monthly: injectMyRank(mockEntries('邀请榜·月榜', 12000), {
        rank: 12,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 7420,
      }),
    },
    team: {
      daily: injectMyRank(mockEntries('战队榜·日榜', 800)),
      weekly: injectMyRank(mockEntries('战队榜·周榜', 4200), {
        rank: 9,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 3315,
      }),
      monthly: injectMyRank(mockEntries('战队榜·月榜', 9600)),
    },
    wealth: {
      daily: injectMyRank(mockEntries('财富榜·日榜', 2600)),
      weekly: injectMyRank(mockEntries('财富榜·周榜', 14000)),
      monthly: injectMyRank(mockEntries('财富榜·月榜', 58000), {
        rank: 4,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 47680,
      }),
    },
  },
  rewards: {
    inviter: {
      top1To3: '神秘盲盒 ×1 + 霓虹碎片 ×300',
      top4To10: 'Arc 能量 ×500 + 霓虹碎片 ×150',
    },
    team: {
      top1To3: '战队荣耀称号 + 战队财政 ×3000',
      top4To10: '战队财政 ×1500 + 战术助理 ×2',
    },
    wealth: {
      top1To3: '专属传送门通行证 + 记忆水晶 ×5',
      top4To10: '稀有装备晶体 ×1 + 记忆水晶 ×2',
    },
  },
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
});

export const leaderboardReducer = leaderboardSlice.reducer;
