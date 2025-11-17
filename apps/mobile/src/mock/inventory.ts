import { ImageSourcePropType } from 'react-native';
import { MapId, mapLabelMap } from '@types/fateMarket';
import mapNftIcons from '../assets/mapnfts';

export type ItemType = 'ore' | 'mapshard' | 'minershard' | 'nft' | 'other';
export type Rarity = 'common' | 'rare' | 'epic' | 'legend' | 'mythic';

export type UIItem = {
  id: string;
  type: ItemType;
  rarity: Rarity;
  name: string;
  qty: number;
  icon: ImageSourcePropType;
  badges?: Array<'nft' | 'locked' | 'equipped'>;
};

const oreIcons = [
  require('../assets/ores/ore_t1.webp'),
  require('../assets/ores/ore_t2.webp'),
  require('../assets/ores/ore_t3.webp'),
  require('../assets/ores/ore_t4.webp'),
  require('../assets/ores/ore_t5.webp'),
];

const mapIcons = [
  require('../assets/mapshards/personal_ember.webp'),
  require('../assets/mapshards/personal_neon.webp'),
  require('../assets/mapshards/personal_rune.webp'),
  require('../assets/mapshards/personal_star.webp'),
  require('../assets/mapshards/personal_abyss.webp'),
  require('../assets/mapshards/personal_core.webp'),
  require('../assets/mapshards/team_front.webp'),
  require('../assets/mapshards/team_lava.webp'),
  require('../assets/mapshards/team_storm.webp'),
  require('../assets/mapshards/team_sanct.webp'),
  require('../assets/mapshards/team_rift.webp'),
  require('../assets/mapshards/team_nexus.webp'),
];

const minerIcons = [
  require('../assets/items/minershards/miner_1.png'),
  require('../assets/items/minershards/miner_2.png'),
  require('../assets/items/minershards/miner_3.png'),
  require('../assets/items/minershards/miner_4.png'),
  require('../assets/items/minershards/miner_5.png'),
  require('../assets/items/minershards/miner_6.png'),
  require('../assets/items/minershards/miner_7.png'),
  require('../assets/items/minershards/miner_8.png'),
];

const nftIcons = [
  require('../assets/items/nfts/nft_1.png'),
  require('../assets/items/nfts/nft_2.png'),
  require('../assets/items/nfts/nft_3.png'),
  require('../assets/items/nfts/nft_4.png'),
  require('../assets/items/nfts/nft_5.png'),
  require('../assets/items/nfts/nft_6.png'),
  require('../assets/items/nfts/nft_7.png'),
  require('../assets/items/nfts/nft_8.png'),
  require('../assets/items/nfts/nft_9.png'),
  require('../assets/items/nfts/nft_10.png'),
  require('../assets/items/nfts/nft_11.png'),
  require('../assets/items/nfts/nft_12.png'),
  require('../assets/items/nfts/nft_13.png'),
  require('../assets/items/nfts/nft_14.png'),
  require('../assets/items/nfts/nft_15.png'),
  require('../assets/items/nfts/nft_16.png'),
  require('../assets/items/nfts/nft_17.png'),
  require('../assets/items/nfts/nft_18.png'),
  require('../assets/items/nfts/nft_19.png'),
  require('../assets/items/nfts/nft_20.png'),
  require('../assets/items/nfts/nft_21.png'),
  require('../assets/items/nfts/nft_22.png'),
  require('../assets/items/nfts/nft_23.png'),
  require('../assets/items/nfts/nft_24.png'),
  require('../assets/items/nfts/nft_25.png'),
];

const otherIcons = [
  require('../assets/items/others/other_1.png'),
  require('../assets/items/others/other_2.png'),
  require('../assets/items/others/other_3.png'),
  require('../assets/items/others/other_4.png'),
  require('../assets/items/others/other_5.png'),
  require('../assets/items/others/other_6.png'),
  require('../assets/items/others/other_7.png'),
  require('../assets/items/others/other_8.png'),
  require('../assets/items/others/other_9.png'),
  require('../assets/items/others/other_10.png'),
];

const mapNftIconEntries = Object.entries(mapNftIcons) as [MapId, ImageSourcePropType][];

export const inventoryItems: UIItem[] = [
  ...oreIcons.map((icon, index) => ({
    id: `ore-${index + 1}`,
    type: 'ore' as ItemType,
    rarity: index % 2 === 0 ? 'common' : 'rare',
    name: `Ore Sample ${index + 1}`,
    qty: 12 + index * 3,
    icon,
  })),
  ...mapIcons.map((icon, index) => ({
    id: `map-${index + 1}`,
    type: 'mapshard' as ItemType,
    rarity: index % 3 === 0 ? 'epic' : 'rare',
    name: `Map Shard ${index + 1}`,
    qty: 1 + (index % 4),
    icon,
    badges: index % 4 === 0 ? ['locked'] : undefined,
  })),
  ...mapNftIconEntries.map(([mapId, icon], index) => ({
    id: `map-nft-${mapId.toLowerCase()}`,
    type: 'nft' as ItemType,
    rarity: (['epic', 'legend', 'mythic'] as Rarity[])[index % 3],
    name: `${mapLabelMap[mapId]} 地图 NFT`,
    qty: 1,
    icon,
    badges: ['nft'],
  })),
  ...minerIcons.map((icon, index) => ({
    id: `miner-${index + 1}`,
    type: 'minershard' as ItemType,
    rarity: index % 2 === 0 ? 'legend' : 'epic',
    name: `Miner Core ${index + 1}`,
    qty: 3 + index,
    icon,
    badges: index % 3 === 0 ? ['equipped'] : undefined,
  })),
  ...nftIcons.map((icon, index) => ({
    id: `nft-${index + 1}`,
    type: 'nft' as ItemType,
    rarity: (['epic', 'legend', 'mythic'] as Rarity[])[index % 3],
    name: `Unity NFT ${index + 1}`,
    qty: 1,
    icon,
    badges: ['nft'],
  })),
  ...otherIcons.map((icon, index) => ({
    id: `other-${index + 1}`,
    type: 'other' as ItemType,
    rarity: 'common',
    name: `Supply ${index + 1}`,
    qty: 20 + index * 5,
    icon,
  })),
];
