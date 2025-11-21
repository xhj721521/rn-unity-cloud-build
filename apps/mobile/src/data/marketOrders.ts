import {
  MarketOrder,
  MarketCategory,
  MarketAsset,
  OrderSide,
  OreTier,
  PersonalMapId,
  TeamMapId,
  MarketOrderStatus,
} from '@schemas/market';

const player = (nickname: string, id?: string) => ({ id: id ?? nickname.toLowerCase(), nickname });

const oreOrder = (
  id: string,
  side: OrderSide,
  tier: OreTier,
  price: number,
  quantity: number,
  owner: string,
  change24h?: number,
  ordersCount?: number,
  status: MarketOrderStatus = 'live',
): MarketOrder => ({
  id,
  side,
  asset: { category: 'ore', tier },
  price,
  quantity,
  owner: player(owner),
  change24h,
  ordersCount,
  status,
});

const fragOrder = (
  id: string,
  side: OrderSide,
  kind: 'personal' | 'team',
  mapId: PersonalMapId | TeamMapId,
  price: number,
  quantity: number,
  owner: string,
  ordersCount?: number,
  status: MarketOrderStatus = 'live',
): MarketOrder => ({
  id,
  side,
  asset: { category: 'fragment', kind, mapId },
  price,
  quantity,
  owner: player(owner),
  ordersCount,
  status,
});

const nftOrder = (
  id: string,
  side: OrderSide,
  kind: 'personal' | 'team',
  mapId: PersonalMapId | TeamMapId,
  price: number,
  owner: string,
  ordersCount?: number,
  status: MarketOrderStatus = 'live',
): MarketOrder => ({
  id,
  side,
  asset: { category: 'mapNft', kind, mapId },
  price,
  quantity: 1,
  owner: player(owner),
  ordersCount,
  status,
});

export const mockOrders: MarketOrder[] = [
  oreOrder('o1', 'sell', 'T1', 12.4, 1200, 'Aether', 3.6, 82, 'live'),
  oreOrder('o2', 'sell', 'T2', 22.1, 980, 'Nova', 1.2, 64, 'redeem'),
  oreOrder('o3', 'sell', 'T3', 48.2, 320, 'Helix', -0.8, 44, 'upcoming'),
  oreOrder('o4', 'sell', 'T4', 82.5, 210, 'Orion', -1.2, 36, 'live'),
  oreOrder('o5', 'sell', 'T5', 120.6, 42, 'Lyra', 0.6, 18, 'ended'),
  oreOrder('b1', 'buy', 'T2', 20.3, 500, 'Zephyr', undefined, 22, 'live'),
  oreOrder('b2', 'buy', 'T4', 80.2, 150, 'Pulse', undefined, 11, 'redeem'),

  fragOrder('f1', 'sell', 'personal', 'neon_cave', 320, 12, 'Trinity', 7, 'live'),
  fragOrder('f2', 'sell', 'personal', 'rune_well', 410, 8, 'Mirage', 4, 'redeem'),
  fragOrder('f3', 'sell', 'team', 'alliance_front', 540, 6, 'Abyss', 4, 'upcoming'),
  fragOrder('f4', 'sell', 'team', 'magma_field', 620, 5, 'Sentinel', 3, 'ended'),
  fragOrder('f5', 'buy', 'personal', 'starlight_grotto', 380, 3, 'Horizon', 2, 'live'),
  fragOrder('f6', 'buy', 'team', 'storm_mine', 510, 2, 'Vertex', 1, 'redeem'),

  nftOrder('n1', 'sell', 'personal', 'ember_pit', 820, 'Mirage', 42, 'live'),
  nftOrder('n2', 'sell', 'personal', 'fate_core', 1220, 'Spectre', 18, 'upcoming'),
  nftOrder('n3', 'sell', 'team', 'central_core', 1330, 'Sentinel', 12, 'redeem'),
  nftOrder('n4', 'buy', 'team', 'sanctuary_hall', 1280, 'Helios', 5, 'ended'),
];

export const metrics = [
  { label: '24h 成交额', value: '3,240,000 ARC' },
  { label: '挂单总数', value: '1,128 笔' },
  { label: '活跃买家', value: '8,420 人' },
];

export const marketCategories: { key: MarketCategory; label: string }[] = [
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '地图碎片' },
  { key: 'mapNft', label: '地图 NFT' },
];

export type MarketAssetCategory = 'ore' | 'fragment' | 'nft';

export type MarketHistoryItem = {
  id: string;
  title: string;
  time: string;
  category: MarketAssetCategory;
  price: number;
  amount: number;
  status: 'success' | 'pending' | 'failed';
};

export const marketHistory: MarketHistoryItem[] = [
  {
    id: 'h1',
    title: 'T3 星晶矿 · 成交',
    time: '10:24 · 今日',
    category: 'ore',
    price: 320,
    amount: 80,
    status: 'success',
  },
  {
    id: 'h2',
    title: '个人地图碎片 · Rune Well',
    time: '10:02 · 今日',
    category: 'fragment',
    price: 540,
    amount: 3,
    status: 'pending',
  },
  {
    id: 'h3',
    title: '团队地图 NFT · Central Core',
    time: '09:40 · 今日',
    category: 'nft',
    price: 1280,
    amount: 1,
    status: 'success',
  },
  {
    id: 'h4',
    title: 'T5 命运矿 · 求购',
    time: '09:22 · 今日',
    category: 'ore',
    price: 1120,
    amount: 30,
    status: 'failed',
  },
];
