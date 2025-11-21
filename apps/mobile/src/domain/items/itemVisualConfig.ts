import { translate as t } from '@locale/strings';

export enum ItemCategory {
  Ore = 'ORE',
  PersonalMapShard = 'PERSONAL_MAP_SHARD',
  TeamMapShard = 'TEAM_MAP_SHARD',
  PersonalMapNft = 'PERSONAL_MAP_NFT',
  TeamMapNft = 'TEAM_MAP_NFT',
}

export type ItemTier = 1 | 2 | 3 | 4 | 5 | 6;

export type ItemKind = 'ore' | 'shard' | 'nft';

export interface ItemVisualConfig {
  id: string;
  category: ItemCategory;
  itemType: ItemKind;
  tier: ItemTier;
  key: string;
  iconKey: string;
  displayName: string;
  shortLabel: string;
  typeLabel: string;
  ownership?: 'personal' | 'team';
}

const typeLabels: Record<ItemKind, string> = {
  ore: t('item.type.ore'),
  shard: t('item.type.shard'),
  nft: t('item.type.nft'),
};

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

const oreName = (tier: ItemTier) => t(`item.ore.t${tier}` as const);
const personalShardName = (key: string) => t(`item.shard.personal.${key}` as const);
const teamShardName = (key: string) => t(`item.shard.team.${key}` as const);
const personalNftName = (key: string) => t(`item.nft.personal.${key}` as const);
const teamNftName = (key: string) => t(`item.nft.team.${key}` as const);

export const ITEM_VISUAL_CONFIG: ItemVisualConfig[] = [
  { id: 'ORE_T1', category: ItemCategory.Ore, itemType: 'ore', tier: 1, key: 't1', iconKey: 't1', displayName: oreName(1), shortLabel: roman[0], typeLabel: typeLabels.ore },
  { id: 'ORE_T2', category: ItemCategory.Ore, itemType: 'ore', tier: 2, key: 't2', iconKey: 't2', displayName: oreName(2), shortLabel: roman[1], typeLabel: typeLabels.ore },
  { id: 'ORE_T3', category: ItemCategory.Ore, itemType: 'ore', tier: 3, key: 't3', iconKey: 't3', displayName: oreName(3), shortLabel: roman[2], typeLabel: typeLabels.ore },
  { id: 'ORE_T4', category: ItemCategory.Ore, itemType: 'ore', tier: 4, key: 't4', iconKey: 't4', displayName: oreName(4), shortLabel: roman[3], typeLabel: typeLabels.ore },
  { id: 'ORE_T5', category: ItemCategory.Ore, itemType: 'ore', tier: 5, key: 't5', iconKey: 't5', displayName: oreName(5), shortLabel: roman[4], typeLabel: typeLabels.ore },

  { id: 'P_CORE_T1', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 1, key: 'core', iconKey: 'personal_core', displayName: personalShardName('core'), shortLabel: roman[0], typeLabel: typeLabels.shard, ownership: 'personal' },
  { id: 'P_NEON_T2', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 2, key: 'neon', iconKey: 'personal_neon', displayName: personalShardName('neon'), shortLabel: roman[1], typeLabel: typeLabels.shard, ownership: 'personal' },
  { id: 'P_RUNE_T3', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 3, key: 'rune', iconKey: 'personal_rune', displayName: personalShardName('rune'), shortLabel: roman[2], typeLabel: typeLabels.shard, ownership: 'personal' },
  { id: 'P_STAR_T4', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 4, key: 'star', iconKey: 'personal_star', displayName: personalShardName('star'), shortLabel: roman[3], typeLabel: typeLabels.shard, ownership: 'personal' },
  { id: 'P_EMBER_T5', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 5, key: 'ember', iconKey: 'personal_ember', displayName: personalShardName('ember'), shortLabel: roman[4], typeLabel: typeLabels.shard, ownership: 'personal' },
  { id: 'P_ABYSS_T6', category: ItemCategory.PersonalMapShard, itemType: 'shard', tier: 6, key: 'abyss', iconKey: 'personal_abyss', displayName: personalShardName('abyss'), shortLabel: roman[5], typeLabel: typeLabels.shard, ownership: 'personal' },

  { id: 'T_FRONT_T1', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 1, key: 'front', iconKey: 'team_front', displayName: teamShardName('front'), shortLabel: roman[0], typeLabel: typeLabels.shard, ownership: 'team' },
  { id: 'T_LAVA_T2', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 2, key: 'lava', iconKey: 'team_lava', displayName: teamShardName('lava'), shortLabel: roman[1], typeLabel: typeLabels.shard, ownership: 'team' },
  { id: 'T_NEXUS_T3', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 3, key: 'nexus', iconKey: 'team_nexus', displayName: teamShardName('nexus'), shortLabel: roman[2], typeLabel: typeLabels.shard, ownership: 'team' },
  { id: 'T_RIFT_T4', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 4, key: 'rift', iconKey: 'team_rift', displayName: teamShardName('rift'), shortLabel: roman[3], typeLabel: typeLabels.shard, ownership: 'team' },
  { id: 'T_SANCT_T5', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 5, key: 'sanct', iconKey: 'team_sanct', displayName: teamShardName('sanct'), shortLabel: roman[4], typeLabel: typeLabels.shard, ownership: 'team' },
  { id: 'T_STORM_T6', category: ItemCategory.TeamMapShard, itemType: 'shard', tier: 6, key: 'storm', iconKey: 'team_storm', displayName: teamShardName('storm'), shortLabel: roman[5], typeLabel: typeLabels.shard, ownership: 'team' },

  { id: 'P_CORE_NFT_T1', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 1, key: 'core', iconKey: 'personal_core_nft', displayName: personalNftName('core'), shortLabel: roman[0], typeLabel: typeLabels.nft, ownership: 'personal' },
  { id: 'P_NEON_NFT_T2', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 2, key: 'neon', iconKey: 'personal_neon_nft', displayName: personalNftName('neon'), shortLabel: roman[1], typeLabel: typeLabels.nft, ownership: 'personal' },
  { id: 'P_RUNE_NFT_T3', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 3, key: 'rune', iconKey: 'personal_rune_nft', displayName: personalNftName('rune'), shortLabel: roman[2], typeLabel: typeLabels.nft, ownership: 'personal' },
  { id: 'P_STAR_NFT_T4', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 4, key: 'star', iconKey: 'personal_star_nft', displayName: personalNftName('star'), shortLabel: roman[3], typeLabel: typeLabels.nft, ownership: 'personal' },
  { id: 'P_EMBER_NFT_T5', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 5, key: 'ember', iconKey: 'personal_ember_nft', displayName: personalNftName('ember'), shortLabel: roman[4], typeLabel: typeLabels.nft, ownership: 'personal' },
  { id: 'P_ABYSS_NFT_T6', category: ItemCategory.PersonalMapNft, itemType: 'nft', tier: 6, key: 'abyss', iconKey: 'personal_abyss_nft', displayName: personalNftName('abyss'), shortLabel: roman[5], typeLabel: typeLabels.nft, ownership: 'personal' },

  { id: 'T_FRONT_NFT_T1', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 1, key: 'front', iconKey: 'team_front_nft', displayName: teamNftName('front'), shortLabel: roman[0], typeLabel: typeLabels.nft, ownership: 'team' },
  { id: 'T_LAVA_NFT_T2', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 2, key: 'lava', iconKey: 'team_lava_nft', displayName: teamNftName('lava'), shortLabel: roman[1], typeLabel: typeLabels.nft, ownership: 'team' },
  { id: 'T_NEXUS_NFT_T3', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 3, key: 'nexus', iconKey: 'team_nexus_nft', displayName: teamNftName('nexus'), shortLabel: roman[2], typeLabel: typeLabels.nft, ownership: 'team' },
  { id: 'T_RIFT_NFT_T4', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 4, key: 'rift', iconKey: 'team_rift_nft', displayName: teamNftName('rift'), shortLabel: roman[3], typeLabel: typeLabels.nft, ownership: 'team' },
  { id: 'T_SANCT_NFT_T5', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 5, key: 'sanct', iconKey: 'team_sanct_nft', displayName: teamNftName('sanct'), shortLabel: roman[4], typeLabel: typeLabels.nft, ownership: 'team' },
  { id: 'T_STORM_NFT_T6', category: ItemCategory.TeamMapNft, itemType: 'nft', tier: 6, key: 'storm', iconKey: 'team_storm_nft', displayName: teamNftName('storm'), shortLabel: roman[5], typeLabel: typeLabels.nft, ownership: 'team' },
];

export function getItemVisual(category: ItemCategory, tier: ItemTier, key: string): ItemVisualConfig | undefined {
  return ITEM_VISUAL_CONFIG.find(
    (c) => c.category === category && c.tier === tier && c.key === key,
  );
}

export function getItemVisualByIconKey(iconKey: string): ItemVisualConfig | undefined {
  return ITEM_VISUAL_CONFIG.find((c) => c.iconKey === iconKey);
}
