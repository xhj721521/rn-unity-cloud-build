import { UIItem } from '@mock/inventory';

export const teamWarehouseItems: Array<UIItem | undefined> = [
  {
    id: 'w1',
    type: 'ore',
    rarity: 'common',
    name: 'Ore Sample',
    qty: 12,
    icon: require('../assets/items/ores/ore_1.png'),
  },
  {
    id: 'w2',
    type: 'ore',
    rarity: 'rare',
    name: 'Ore Core',
    qty: 6,
    icon: require('../assets/items/ores/ore_2.png'),
  },
  {
    id: 'w3',
    type: 'minershard',
    rarity: 'epic',
    name: 'Miner Core',
    qty: 3,
    icon: require('../assets/items/minershards/miner_1.png'),
  },
  undefined,
  undefined,
  {
    id: 'w4',
    type: 'nft',
    rarity: 'legend',
    name: 'Unity Relic',
    qty: 1,
    icon: require('../assets/items/nfts/nft_5.png'),
  },
];
