import { ItemCategory, ITEM_VISUAL_CONFIG } from '@domain/items/itemVisualConfig';
import { resolveIconSource } from '@domain/items/itemIconResolver';
import { StandardItem } from '@domain/items/itemModel';
import { toVisualItem, VisualItem } from '@domain/items/itemVisualAdapter';

const oreKeys = ['t1', 't2', 't3', 't4', 't5'] as const;
const personalKeys = ['core', 'neon', 'rune', 'star', 'ember', 'abyss'] as const;
const teamKeys = ['front', 'lava', 'nexus', 'rift', 'sanct', 'storm'] as const;

const oreItems: StandardItem[] = oreKeys.map((key, index) => ({
  id: `ore-${key}`,
  type: 'ore',
  key,
  tier: index + 1,
  name: `T${index + 1} 矿石`,
  amount: 12 + index * 3,
  rarity: index % 2 === 0 ? 'common' : 'rare',
}));

const mapShardItems: StandardItem[] = [
  ...personalKeys.map((key, idx) => ({
    id: `map-${key}`,
    type: 'mapShard',
    key,
    tier: idx + 1,
    isTeam: false,
    name: `${key.toUpperCase()} 地图碎片`,
    amount: 2 + idx,
    rarity: 'rare' as const,
  })),
  ...teamKeys.map((key, idx) => ({
    id: `map-team-${key}`,
    type: 'mapShard',
    key,
    tier: idx + 1,
    isTeam: true,
    name: `${key.toUpperCase()} 团队碎片`,
    amount: 1 + idx,
    rarity: 'epic' as const,
    badges: ['locked'] as const,
  })),
];

const mapNftItems: StandardItem[] = [
  ...personalKeys.map((key, idx) => ({
    id: `nft-${key}`,
    type: 'nft',
    key: `${key}`,
    tier: idx + 1,
    isTeam: false,
    name: `${key.toUpperCase()} 地图 NFT`,
    amount: 1,
    rarity: (['epic', 'legend', 'mythic'] as const)[idx % 3],
    badges: ['nft'] as const,
  })),
  ...teamKeys.map((key, idx) => ({
    id: `nft-team-${key}`,
    type: 'nft',
    key: `${key}`,
    tier: idx + 1,
    isTeam: true,
    name: `${key.toUpperCase()} 团队 NFT`,
    amount: 1,
    rarity: (['epic', 'legend', 'mythic'] as const)[(idx + 1) % 3],
    badges: ['nft'] as const,
  })),
];

const workerItems: StandardItem[] = Array.from({ length: 8 }).map((_, idx) => ({
  id: `miner-${idx + 1}`,
  type: 'other',
  key: `worker_${idx + 1}`,
  tier: 1,
  name: `矿工碎片 ${idx + 1}`,
  amount: 5 + idx,
  rarity: idx % 2 === 0 ? 'epic' : 'legendary',
}));

const otherItems: StandardItem[] = ['supply_1', 'supply_2', 'supply_3'].map((id, idx) => ({
  id,
  type: 'other',
  key: id,
  tier: 1,
  name: `补给 ${idx + 1}`,
  amount: 10 + idx * 5,
  rarity: 'common',
}));

export const standardItems: StandardItem[] = [
  ...oreItems,
  ...mapShardItems,
  ...mapNftItems,
  ...workerItems,
  ...otherItems,
];

export const inventoryItems: VisualItem[] = standardItems.map(toVisualItem);

// 保持兼容旧引用
export type UIItem = VisualItem;
export type ItemType = 'ore' | 'mapshard' | 'minershard' | 'nft' | 'other';
export type { VisualItem };

// 占位符资源，供空槽等场景使用
export const placeholderIcon = resolveIconSource(ITEM_VISUAL_CONFIG[0]);
