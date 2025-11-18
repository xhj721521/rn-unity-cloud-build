export type ItemType = 'ore' | 'mapShard' | 'nft' | 'other';

// 标准化的物品数据结构，供所有 UI 使用（仓库、团队仓库、集市）
export interface StandardItem {
  id: string;
  type: ItemType;
  key: string; // ore: t1...t5; map shard/nft: core/neon/.../front/...
  tier: number; // 1~6
  isTeam?: boolean; // map 类型用来区分个人/团队
  name?: string; // 展示名称，优先使用视觉配置的 displayName
  amount?: number; // 数量/堆叠数
  rarity?: 'common' | 'rare' | 'epic' | 'legend' | 'legendary' | 'mythic';
  badges?: Array<'nft' | 'locked' | 'equipped'>;
}

// 将后端/杂项来源的任意字段映射为 StandardItem
export type PartialItemInput = Partial<StandardItem> & {
  id: string;
  type?: ItemType | string;
  key?: string;
  tier?: number;
  level?: number; // 兼容可能的 level 字段
  isTeam?: boolean;
  name?: string;
  amount?: number;
  rarity?: StandardItem['rarity'];
  badges?: StandardItem['badges'];
};

const personalKeyTier: Record<string, number> = {
  core: 1,
  neon: 2,
  rune: 3,
  star: 4,
  ember: 5,
  abyss: 6,
};

const teamKeyTier: Record<string, number> = {
  front: 1,
  lava: 2,
  nexus: 3,
  rift: 4,
  sanct: 5,
  storm: 6,
};

const decodeUnicode = (text?: string) => {
  if (!text) return text;
  try {
    return JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
  } catch {
    return text;
  }
};

export function normalizeItem(input: PartialItemInput): StandardItem {
  const type = (input.type as ItemType) ?? 'other';
  const key = input.key ?? '';
  const lowerKey = key.toLowerCase();
  const tierFromKey = personalKeyTier[lowerKey] ?? teamKeyTier[lowerKey];
  const tier = (input.tier ?? input.level ?? tierFromKey ?? 1) as number;
  const isTeam = input.isTeam ?? ['front', 'lava', 'nexus', 'rift', 'sanct', 'storm'].includes(lowerKey);

  return {
    id: input.id,
    type: type === 'mapshard' ? 'mapShard' : (type as ItemType),
    key: lowerKey,
    tier: Math.max(1, Math.min(6, tier)),
    isTeam,
    name: decodeUnicode(input.name),
    amount: input.amount ?? 0,
    rarity: input.rarity,
    badges: input.badges,
  };
}
