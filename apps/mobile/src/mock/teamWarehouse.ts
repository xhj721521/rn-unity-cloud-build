import { StandardItem } from '@domain/items/itemModel';
import { toVisualItem, VisualItem } from '@domain/items/itemVisualAdapter';

const baseItems: StandardItem[] = [
  { id: 'w1', type: 'ore', key: 't1', tier: 1, name: 'T1 矿石', amount: 12, rarity: 'common' },
  { id: 'w2', type: 'ore', key: 't2', tier: 2, name: 'T2 矿石', amount: 6, rarity: 'rare' },
  { id: 'w3', type: 'other', key: 'worker_1', tier: 1, name: '矿工碎片', amount: 3, rarity: 'epic' },
  { id: 'w4', type: 'mapShard', key: 'ember', tier: 5, isTeam: false, name: 'EMBER 地图碎片', amount: 2, rarity: 'rare' },
  { id: 'w5', type: 'nft', key: 'neon', tier: 2, isTeam: false, name: 'NEON 地图 NFT', amount: 1, rarity: 'legend', badges: ['nft'] },
  { id: 'w6', type: 'nft', key: 'front', tier: 1, isTeam: true, name: 'FRONT 团队 NFT', amount: 1, rarity: 'legend', badges: ['nft'] },
];

export const teamWarehouseItems: Array<VisualItem | undefined> = [
  ...baseItems.map(toVisualItem),
  undefined,
  undefined,
];
