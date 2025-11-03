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
    top11To20: string;
  }
>;

type LeaderboardState = {
  data: LeaderboardData;
  rewards: LeaderboardRewards;
};

const mockEntries = (prefix: string, scoreBase: number): LeaderboardEntry[] =>
  Array.from({ length: 20 }).map((_, index) => ({
    rank: index + 1,
    playerName: `${prefix} · 第${index + 1}席`,
    userId: `${prefix.toLowerCase()}-${index + 1}`,
    score: scoreBase - index * 47,
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
  const mine = list.find((item) => item.userId === myUserId) ?? override ?? null;
  return { entries: list.slice(0, 20), myRank: mine };
};

const initialState: LeaderboardState = {
  data: {
    inviter: {
      daily: injectMyRank(mockEntries('邀请指挥官', 2200), {
        rank: 6,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 978,
      }),
      weekly: injectMyRank(mockEntries('邀请指挥官', 5400)),
      monthly: injectMyRank(mockEntries('邀请指挥官', 12000), {
        rank: 12,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 7420,
      }),
    },
    team: {
      daily: injectMyRank(mockEntries('战队先锋', 1800)),
      weekly: injectMyRank(mockEntries('战队先锋', 4200), {
        rank: 9,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 3315,
      }),
      monthly: injectMyRank(mockEntries('战队先锋', 9600)),
    },
    wealth: {
      daily: injectMyRank(mockEntries('财富枢纽', 3600)),
      weekly: injectMyRank(mockEntries('财富枢纽', 14000)),
      monthly: injectMyRank(mockEntries('财富枢纽', 58000), {
        rank: 4,
        userId: myUserId,
        playerName: 'Pilot Zero',
        score: 47680,
      }),
    },
  },
  rewards: {
    inviter: {
      top1To3: '神秘盲盒 ×1 + Arc 碎片 ×300',
      top4To10: 'Arc 碎片 ×150 + 稀有勋章 ×1',
      top11To20: 'Arc 碎片 ×80 + 随机矿石礼包 ×1',
    },
    team: {
      top1To3: '战队荣誉称号 + 战队财政 ×3000',
      top4To10: '战队财政 ×1500 + 队员集训券 ×2',
      top11To20: '战术补给包 ×2 + 集训券 ×1',
    },
    wealth: {
      top1To3: '专属传送门通行证 + 记忆水晶 ×5',
      top4To10: '稀有装备晶体 ×1 + 记忆水晶 ×2',
      top11To20: 'Arc 碎片 ×120 + 金库宝箱 ×1',
    },
  },
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
});

export const leaderboardReducer = leaderboardSlice.reducer;
