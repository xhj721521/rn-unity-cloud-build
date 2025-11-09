import { ChatCursor, ChatMessage } from './chatTypes';

type FetchParams = ChatCursor & {
  limit?: number;
};

type FetchResult = {
  items: ChatMessage[];
  nextBefore?: number;
};

const DEFAULT_TEAM_ID = 'alpha-squad';

const teamStore: Record<string, ChatMessage[]> = {
  [DEFAULT_TEAM_ID]: seedMessages(),
};

let seqCounter =
  Math.max(
    ...Object.values(teamStore)
      .flat()
      .map((msg) => msg.seq),
  ) || 0;

export const fetchTeamMessages = async (
  teamId: string,
  params: FetchParams = {},
): Promise<FetchResult> => {
  const { before, limit = 30, after } = params;
  const list = ensureTeam(teamId);
  const sorted = [...list].sort((a, b) => a.seq - b.seq);
  let items: ChatMessage[] = [];

  if (typeof after === 'number') {
    items = sorted.filter((msg) => msg.seq > after);
  } else if (typeof before === 'number') {
    const filtered = sorted.filter((msg) => msg.seq < before);
    items = filtered.slice(-limit);
  } else {
    items = sorted.slice(-limit);
  }

  const nextBefore =
    items.length && sorted.some((msg) => msg.seq < items[0].seq) ? items[0].seq : undefined;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items,
        nextBefore,
      });
    }, 220);
  });
};

export const sendTeamMessage = async (
  teamId: string,
  user: ChatMessage['user'],
  text: string,
): Promise<ChatMessage> => {
  const message: ChatMessage = {
    id: `srv-${Date.now()}`,
    teamId,
    user,
    kind: 'text',
    text,
    createdAt: Date.now(),
    seq: ++seqCounter,
  };
  ensureTeam(teamId).push(message);
  return new Promise((resolve) => {
    setTimeout(() => resolve(message), 240);
  });
};

export const injectSystemMessage = (teamId: string, text: string) => {
  const message: ChatMessage = {
    id: `sys-${Date.now()}`,
    teamId,
    user: { id: 'system', name: 'System' },
    kind: 'system',
    text,
    createdAt: Date.now(),
    seq: ++seqCounter,
  };
  ensureTeam(teamId).push(message);
  return message;
};

const ensureTeam = (teamId: string) => {
  if (!teamStore[teamId]) {
    teamStore[teamId] = [];
  }
  return teamStore[teamId];
};

function seedMessages(): ChatMessage[] {
  const now = Date.now();
  const baseUsers = [
    { id: 'alpha', name: 'PhotonBlade', role: 'leader' as const },
    { id: 'beta', name: 'NeonScout', role: 'member' as const },
    { id: 'gamma', name: 'SynthMedic', role: 'member' as const },
  ];

  return [
    {
      id: 'seed-1',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[0],
      kind: 'system',
      text: 'PhotonBlade 创建了队伍 “Alpha 特遣队”。',
      createdAt: now - 1000 * 60 * 60 * 24,
      seq: 1,
    },
    {
      id: 'seed-2',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[1],
      kind: 'text',
      text: '昨晚的链上试炼有人参加吗？我掉了两枚稀有碎片。',
      createdAt: now - 1000 * 60 * 60 * 20,
      seq: 2,
    },
    {
      id: 'seed-3',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[0],
      kind: 'text',
      text: '记得今天 21:00 的盲盒唤醒，掉率 +30%。',
      createdAt: now - 1000 * 60 * 60 * 12,
      seq: 3,
    },
    {
      id: 'seed-4',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[2],
      kind: 'text',
      text: '我能带上一位补给手吗？想让他体验训练。',
      createdAt: now - 1000 * 60 * 60 * 10,
      seq: 4,
    },
    {
      id: 'seed-5',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[0],
      kind: 'system',
      text: 'NeonScout 升任战术副手。',
      createdAt: now - 1000 * 60 * 60 * 4,
      seq: 5,
    },
    {
      id: 'seed-6',
      teamId: DEFAULT_TEAM_ID,
      user: baseUsers[1],
      kind: 'text',
      text: '副本 buff 已刷新，大家上线记得领取。',
      createdAt: now - 1000 * 60 * 30,
      seq: 6,
    },
  ];
}
