import { ImageSourcePropType } from 'react-native';
import { ItemCategory, ItemTier, ItemVisualConfig, ITEM_VISUAL_CONFIG, getItemVisual } from '@domain/items/itemVisualConfig';
import { resolveIconSource } from '@domain/items/itemIconResolver';

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
  isTeam?: boolean;
  tier?: ItemTier;
  visualCategory?: ItemCategory;
  visualKey?: string;
  visual?: ItemVisualConfig;
};

const fallbackVisual = ITEM_VISUAL_CONFIG[0];

const tierByPersonalKey: Record<string, ItemTier> = {
  core: 1,
  neon: 2,
  rune: 3,
  star: 4,
  ember: 5,
  abyss: 6,
};

const tierByTeamKey: Record<string, ItemTier> = {
  front: 1,
  lava: 2,
  nexus: 3,
  rift: 4,
  sanct: 5,
  storm: 6,
};

const resolveVisual = (category: ItemCategory, key: string, tier: ItemTier): { visual?: ItemVisualConfig; icon: ImageSourcePropType } => {
  const visual = getItemVisual(category, tier, key);
  const fallbackIcon = resolveIconSource(fallbackVisual);
  if (!visual) {
    return { visual: undefined, icon: fallbackIcon };
  }
  return { visual, icon: resolveIconSource(visual) };
};

const oreItems: UIItem[] = (['t1', 't2', 't3', 't4', 't5'] as const).map((key, index) => {
  const tier = (index + 1) as ItemTier;
  const { visual, icon } = resolveVisual(ItemCategory.Ore, key, tier);
  return {
    id: `ore-${key}`,
    type: 'ore',
    rarity: index % 2 === 0 ? 'common' : 'rare',
    name: visual?.displayName ?? `T${tier} ore`,
    qty: 12 + index * 3,
    icon,
    tier,
    visualCategory: ItemCategory.Ore,
    visualKey: key,
    visual,
  };
});

const mapShardEntries: Array<{ key: keyof typeof tierByPersonalKey | keyof typeof tierByTeamKey; isTeam: boolean }> = [
  { key: 'core', isTeam: false },
  { key: 'neon', isTeam: false },
  { key: 'rune', isTeam: false },
  { key: 'star', isTeam: false },
  { key: 'ember', isTeam: false },
  { key: 'abyss', isTeam: false },
  { key: 'front', isTeam: true },
  { key: 'lava', isTeam: true },
  { key: 'nexus', isTeam: true },
  { key: 'rift', isTeam: true },
  { key: 'sanct', isTeam: true },
  { key: 'storm', isTeam: true },
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

const mapNftEntries: Array<{ key: keyof typeof tierByPersonalKey | keyof typeof tierByTeamKey; isTeam: boolean }> = [
  { key: 'core', isTeam: false },
  { key: 'neon', isTeam: false },
  { key: 'rune', isTeam: false },
  { key: 'star', isTeam: false },
  { key: 'ember', isTeam: false },
  { key: 'abyss', isTeam: false },
  { key: 'front', isTeam: true },
  { key: 'lava', isTeam: true },
  { key: 'nexus', isTeam: true },
  { key: 'rift', isTeam: true },
  { key: 'sanct', isTeam: true },
  { key: 'storm', isTeam: true },
];

export const inventoryItems: UIItem[] = [
  ...oreItems,
  ...mapShardEntries.map((entry) => {
    const category = entry.isTeam ? ItemCategory.TeamMapShard : ItemCategory.PersonalMapShard;
    const tierMap = entry.isTeam ? tierByTeamKey : tierByPersonalKey;
    const tier = tierMap[entry.key];
    const { visual, icon } = resolveVisual(category, entry.key, tier);
    return {
      id: `map-${entry.key}`,
      type: 'mapshard',
      rarity: entry.isTeam ? 'epic' : 'rare',
      name: visual?.displayName ?? `${entry.isTeam ? '团队' : '个人'}地图碎片 ${entry.key}`,
      qty: entry.isTeam ? 1 : 2,
      icon,
      badges: entry.isTeam ? ['locked'] : undefined,
      isTeam: entry.isTeam,
      tier,
      visualCategory: category,
      visualKey: entry.key,
      visual,
    };
  }),
  ...mapNftEntries.map((entry, index) => {
    const category = entry.isTeam ? ItemCategory.TeamMapNft : ItemCategory.PersonalMapNft;
    const tierMap = entry.isTeam ? tierByTeamKey : tierByPersonalKey;
    const tier = tierMap[entry.key];
    const { visual, icon } = resolveVisual(category, entry.key, tier);
    return {
      id: `map-nft-${entry.key}`,
      type: 'nft',
      rarity: (['epic', 'legend', 'mythic'] as Rarity[])[index % 3],
      name: visual?.displayName ?? `${entry.key} 地图 NFT`,
      qty: 1,
      icon,
      badges: ['nft'],
      visualCategory: category,
      visualKey: entry.key,
      tier,
      visual,
    };
  }),
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
