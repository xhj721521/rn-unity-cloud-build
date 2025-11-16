export type MarketAssetCategory = 'ore' | 'fragment' | 'nft' | 'all';
export type MarketSide = 'sell' | 'buy';

export type MarketAsset = {
  id: string;
  category: MarketAssetCategory;
  subType: string; // e.g., T1~T5, map-personal-1, nft-team-2
  name: string;
  price: number; // ARC price
  quantity: number;
  depth?: string;
  seller: { name: string; avatar?: string };
  side: MarketSide;
  change?: string;
};

export type MarketHistoryRecord = {
  id: string;
  category: MarketAssetCategory;
  subType: string;
  title: string;
  side: MarketSide;
  price: number;
  amount: number;
  time: string;
  status: 'success' | 'pending' | 'failed';
};

export const marketAssets: MarketAsset[] = [
  { id: 'o1', category: 'ore', subType: 'T1', name: 'T1 矿石', price: 12.4, quantity: 1200, depth: '买盘 82 手', seller: { name: 'Aether' }, side: 'sell', change: '+3.6%' },
  { id: 'o2', category: 'ore', subType: 'T3', name: 'T3 矿石', price: 48.2, quantity: 320, depth: '买盘 44 手', seller: { name: 'Nova' }, side: 'sell', change: '+1.2%' },
  { id: 'o3', category: 'ore', subType: 'T5', name: 'T5 矿石', price: 120.6, quantity: 42, depth: '卖盘 18 手', seller: { name: 'Helix' }, side: 'buy', change: '-0.8%' },
  { id: 'f1', category: 'fragment', subType: 'map-personal-1', name: '个人地图 · 幻梦峡谷', price: 320, quantity: 12, depth: '剩余 7 份', seller: { name: 'Trinity' }, side: 'sell' },
  { id: 'f2', category: 'fragment', subType: 'map-team-2', name: '团队地图 · 裂隙矿区', price: 540, quantity: 6, depth: '剩余 4 份', seller: { name: 'Abyss' }, side: 'sell' },
  { id: 'n1', category: 'nft', subType: 'nft-personal-1', name: '个人 NFT · 幻像矿脉', price: 820, quantity: 1, depth: '出价 42', seller: { name: 'Mirage' }, side: 'sell' },
  { id: 'n2', category: 'nft', subType: 'nft-team-1', name: '团队 NFT · 星陨要塞', price: 1330, quantity: 1, depth: '出价 51', seller: { name: 'Sentinel' }, side: 'sell' },
  { id: 'b1', category: 'ore', subType: 'T2', name: 'T2 矿石', price: 22.1, quantity: 500, seller: { name: 'Orion' }, side: 'buy' },
  { id: 'b2', category: 'fragment', subType: 'map-personal-3', name: '个人地图 · 星辉林地', price: 410, quantity: 3, seller: { name: 'Lyra' }, side: 'buy' },
];

export const marketHistory: MarketHistoryRecord[] = [
  { id: 'h1', category: 'ore', subType: 'T1', title: '卖出 T1 矿石', side: 'sell', price: 12.3, amount: 200, time: '今天 12:30', status: 'success' },
  { id: 'h2', category: 'fragment', subType: 'map-personal-1', title: '买入 幻梦峡谷 碎片', side: 'buy', price: 320, amount: 2, time: '今天 10:12', status: 'pending' },
  { id: 'h3', category: 'nft', subType: 'nft-team-1', title: '卖出 星陨要塞 NFT', side: 'sell', price: 1280, amount: 1, time: '昨天 22:47', status: 'success' },
  { id: 'h4', category: 'ore', subType: 'T5', title: '买入 T5 矿石', side: 'buy', price: 122, amount: 10, time: '昨天 18:09', status: 'failed' },
];
