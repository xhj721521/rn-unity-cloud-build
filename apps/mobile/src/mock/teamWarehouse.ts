import { ImageSourcePropType } from 'react-native';
import { ItemCategory, ItemTier, ItemVisualConfig, ITEM_VISUAL_CONFIG, getItemVisual } from '@domain/items/itemVisualConfig';
import { resolveIconSource } from '@domain/items/itemIconResolver';
import { UIItem } from '@mock/inventory';

const fallbackVisual = ITEM_VISUAL_CONFIG[0];

const tierByPersonalKey: Record<string, ItemTier> = {
  core: 1,
  neon: 2,
  rune: 3,
  star: 4,
  ember: 5,
  abyss: 6,
};

const resolveVisual = (category: ItemCategory, key: string, tier: ItemTier): { visual?: ItemVisualConfig; icon: ImageSourcePropType } => {
  const visual = getItemVisual(category, tier, key);
  const fallbackIcon = resolveIconSource(fallbackVisual);
  if (!visual) {
    return { visual: undefined, icon: fallbackIcon };
  }
  return { visual, icon: resolveIconSource(visual) };
};

const oreItem = (id: string, tier: ItemTier, rarity: UIItem['rarity'], qty: number): UIItem => {
  const { visual, icon } = resolveVisual(ItemCategory.Ore, `t${tier}`, tier);
  return {
    id,
    type: 'ore',
    rarity,
    name: visual?.displayName ?? `T${tier} ore`,
    qty,
    icon,
    tier,
    visualCategory: ItemCategory.Ore,
    visualKey: `t${tier}`,
    visual,
  };
};

export const teamWarehouseItems: Array<UIItem | undefined> = [
  oreItem('w1', 1, 'common', 12),
  oreItem('w2', 2, 'rare', 6),
  {
    id: 'w3',
    type: 'minershard',
    rarity: 'epic',
    name: 'Miner Core',
    qty: 3,
    icon: require('../assets/items/minershards/miner_1.png'),
  },
  (() => {
    const tier = tierByPersonalKey.ember;
    const { visual, icon } = resolveVisual(ItemCategory.PersonalMapShard, 'ember', tier);
    return {
      id: 'w4',
      type: 'mapshard',
      rarity: 'rare',
      name: visual?.displayName ?? 'Ember 地图碎片',
      qty: 2,
      icon,
      tier,
      visualCategory: ItemCategory.PersonalMapShard,
      visualKey: 'ember',
      visual,
    } as UIItem;
  })(),
  (() => {
    const tier = tierByPersonalKey.neon;
    const { visual, icon } = resolveVisual(ItemCategory.PersonalMapNft, 'neon', tier);
    return {
      id: 'w5',
      type: 'nft',
      rarity: 'legend',
      name: visual?.displayName ?? 'NEON map NFT',
      qty: 1,
      icon,
      badges: ['nft'],
      tier,
      visualCategory: ItemCategory.PersonalMapNft,
      visualKey: 'neon',
      visual,
    } as UIItem;
  })(),
  undefined,
  undefined,
  {
    id: 'w6',
    type: 'nft',
    rarity: 'legend',
    name: 'Unity Relic',
    qty: 1,
    icon: require('../assets/items/nfts/nft_5.png'),
  },
];
