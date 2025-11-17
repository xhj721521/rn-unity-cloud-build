import { AssetCategory, MapId, Order, OrderSide } from '@types/fateMarket';

const now = () => new Date().toISOString();

const ore = (
  id: string,
  side: OrderSide,
  tier: Order['tier'],
  price: number,
  amount: number,
  seller: string,
  changePercent?: number,
): Order => ({
  id,
  side,
  category: 'ORE',
  tier,
  itemName: `${tier} ore`,
  description: 'Tradable / Craftable / Forgable',
  unitPrice: price,
  amount,
  sellerName: seller,
  changePercent,
  createdAt: now(),
});

const mapOrder = (
  id: string,
  side: OrderSide,
  category: AssetCategory,
  mapId: MapId,
  price: number,
  amount: number,
  seller: string,
): Order => ({
  id,
  side,
  category,
  mapId,
  itemName: `${mapId} ${category === 'MAP_SHARD' ? 'map shard' : 'map NFT'}`,
  description: category === 'MAP_SHARD' ? 'Can be forged into maps' : 'Unlock map entitlement',
  unitPrice: price,
  amount,
  sellerName: seller,
  createdAt: now(),
});

export const initialOrders: Order[] = [
  ore('o1', 'SELL', 'T5', 120.6, 42, 'Lyra', 0.6),
  ore('o2', 'SELL', 'T3', 48.2, 320, 'Helix', -0.8),
  ore('o3', 'BUY', 'T2', 20.3, 500, 'Zephyr'),
  ore('o4', 'SELL', 'T4', 82.5, 210, 'Orion', -1.2),
  ore('o5', 'BUY', 'T1', 12.3, 200, 'Nova'),

  mapOrder('m1', 'SELL', 'MAP_SHARD', 'EMBER', 320, 12, 'Trinity'),
  mapOrder('m2', 'SELL', 'MAP_SHARD', 'LAVA', 540, 6, 'Abyss'),
  mapOrder('m3', 'BUY', 'MAP_SHARD', 'STAR', 380, 3, 'Horizon'),

  mapOrder('n1', 'SELL', 'MAP_NFT', 'CORE', 1220, 1, 'Spectre'),
  mapOrder('n2', 'SELL', 'MAP_NFT', 'NEXUS', 1330, 1, 'Sentinel'),
  mapOrder('n3', 'BUY', 'MAP_NFT', 'SANCT', 1280, 1, 'Helios'),
];
