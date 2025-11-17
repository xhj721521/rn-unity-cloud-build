export type AssetCategory = 'ALL' | 'ORE' | 'MAP_SHARD' | 'MAP_NFT';
export type OrderSide = 'SELL' | 'BUY';
export type OreTier = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
export type MapId =
  | 'EMBER'
  | 'NEON'
  | 'RUNE'
  | 'STAR'
  | 'ABYSS'
  | 'CORE'
  | 'FRONT'
  | 'LAVA'
  | 'STORM'
  | 'SANCT'
  | 'RIFT'
  | 'NEXUS';

export type OrderSideFilter = 'ALL' | 'SELL' | 'BUY';
export type SortField = 'PRICE' | 'AMOUNT' | 'TIME';
export type SortDirection = 'ASC' | 'DESC';

export interface Order {
  id: string;
  side: OrderSide;
  category: AssetCategory;
  tier?: OreTier;
  mapId?: MapId;
  itemName: string;
  description: string;
  unitPrice: number;
  amount: number;
  sellerName: string;
  changePercent?: number;
  createdAt: string;
}

export const oreLabelMap: Record<OreTier, string> = {
  T1: 'T1 命运矿',
  T2: 'T2 高能晶',
  T3: 'T3 星晶核',
  T4: 'T4 核晶矿',
  T5: 'T5 命运核',
};

export const mapLabelMap: Record<MapId, string> = {
  EMBER: 'Ember',
  NEON: 'Neon',
  RUNE: 'Rune',
  STAR: 'Star',
  ABYSS: 'Abyss',
  CORE: 'Core',
  FRONT: 'Front',
  LAVA: 'Lava',
  STORM: 'Storm',
  SANCT: 'Sanct',
  RIFT: 'Rift',
  NEXUS: 'Nexus',
};

export const mapGroups = {
  personal: ['EMBER', 'NEON', 'RUNE', 'STAR', 'ABYSS', 'CORE'] as MapId[],
  team: ['FRONT', 'LAVA', 'STORM', 'SANCT', 'RIFT', 'NEXUS'] as MapId[],
};
