// Trading categories
export type MarketCategory = 'ore' | 'fragment' | 'mapNft';

// Ore tiers
export type OreTier = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

// Map type
export type MapKind = 'personal' | 'team';

// Personal map ids
export type PersonalMapId =
  | 'ember_pit'
  | 'neon_cave'
  | 'rune_well'
  | 'starlight_grotto'
  | 'abyss_gate'
  | 'fate_core';

// Team map ids
export type TeamMapId =
  | 'alliance_front'
  | 'magma_field'
  | 'storm_mine'
  | 'sanctuary_hall'
  | 'abyss_trench'
  | 'central_core';

// NFT target
export type MapNftTarget =
  | { kind: 'personal'; mapId: PersonalMapId }
  | { kind: 'team'; mapId: TeamMapId };

// Order direction
export type OrderSide = 'sell' | 'buy';

// Player info
export interface PlayerInfo {
  id: string;
  nickname: string;
  avatarUrl?: string;
}

// Market asset
export type MarketAsset =
  | { category: 'ore'; tier: OreTier }
  | { category: 'fragment'; kind: MapKind; mapId: PersonalMapId | TeamMapId }
  | { category: 'mapNft'; kind: MapKind; mapId: PersonalMapId | TeamMapId };

// Order item
export interface MarketOrder {
  id: string;
  side: OrderSide;
  asset: MarketAsset;
  price: number;
  quantity: number;
  owner: PlayerInfo;
  change24h?: number;
  ordersCount?: number;
}

export const oreLabels: Record<OreTier, string> = {
  T1: 'T1 基础矿',
  T2: 'T2 碎片矿',
  T3: 'T3 星晶矿',
  T4: 'T4 核晶矿',
  T5: 'T5 命运矿',
};

export const personalMapLabels: Record<PersonalMapId, string> = {
  ember_pit: '余烬坑',
  neon_cave: '霓虹洞',
  rune_well: '符文井',
  starlight_grotto: '星辉窟',
  abyss_gate: '深渊门',
  fate_core: '命运核',
};

export const teamMapLabels: Record<TeamMapId, string> = {
  alliance_front: '联盟前线',
  magma_field: '熔火矿场',
  storm_mine: '风暴矿区',
  sanctuary_hall: '圣所矿厅',
  abyss_trench: '深渊矿沟',
  central_core: '中枢矿核',
};

export const kindLabel: Record<MapKind, string> = {
  personal: '个人',
  team: '团队',
};

export const categoryLabel: Record<MarketCategory, string> = {
  ore: '矿石',
  fragment: '地图碎片',
  mapNft: '地图 NFT',
};
