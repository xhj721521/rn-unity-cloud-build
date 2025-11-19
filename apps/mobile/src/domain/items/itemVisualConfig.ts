export enum ItemCategory {
  Ore = 'ORE',
  PersonalMapShard = 'PERSONAL_MAP_SHARD',
  TeamMapShard = 'TEAM_MAP_SHARD',
  PersonalMapNft = 'PERSONAL_MAP_NFT',
  TeamMapNft = 'TEAM_MAP_NFT',
}

export type ItemTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface ItemVisualConfig {
  id: string;
  category: ItemCategory;
  tier: ItemTier;
  key: string;
  iconKey: string;
  displayName: string;
  shortLabel: string;
  badgeColor?: string;
}

export const ITEM_VISUAL_CONFIG: ItemVisualConfig[] = [
  { id: 'ORE_T1', category: ItemCategory.Ore, tier: 1, key: 't1', iconKey: 't1', displayName: 'T1 ore', shortLabel: 'T1 I' },
  { id: 'ORE_T2', category: ItemCategory.Ore, tier: 2, key: 't2', iconKey: 't2', displayName: 'T2 ore', shortLabel: 'T2 II' },
  { id: 'ORE_T3', category: ItemCategory.Ore, tier: 3, key: 't3', iconKey: 't3', displayName: 'T3 ore', shortLabel: 'T3 III' },
  { id: 'ORE_T4', category: ItemCategory.Ore, tier: 4, key: 't4', iconKey: 't4', displayName: 'T4 ore', shortLabel: 'T4 IV' },
  { id: 'ORE_T5', category: ItemCategory.Ore, tier: 5, key: 't5', iconKey: 't5', displayName: 'T5 ore', shortLabel: 'T5 V' },

  { id: 'P_CORE_T1', category: ItemCategory.PersonalMapShard, tier: 1, key: 'core', iconKey: 'personal_core', displayName: 'CORE map shard', shortLabel: 'I' },
  { id: 'P_NEON_T2', category: ItemCategory.PersonalMapShard, tier: 2, key: 'neon', iconKey: 'personal_neon', displayName: 'NEON map shard', shortLabel: 'II' },
  { id: 'P_RUNE_T3', category: ItemCategory.PersonalMapShard, tier: 3, key: 'rune', iconKey: 'personal_rune', displayName: 'RUNE map shard', shortLabel: 'III' },
  { id: 'P_STAR_T4', category: ItemCategory.PersonalMapShard, tier: 4, key: 'star', iconKey: 'personal_star', displayName: 'STAR map shard', shortLabel: 'IV' },
  { id: 'P_EMBER_T5', category: ItemCategory.PersonalMapShard, tier: 5, key: 'ember', iconKey: 'personal_ember', displayName: 'EMBER map shard', shortLabel: 'V' },
  { id: 'P_ABYSS_T6', category: ItemCategory.PersonalMapShard, tier: 6, key: 'abyss', iconKey: 'personal_abyss', displayName: 'ABYSS map shard', shortLabel: 'VI' },

  { id: 'T_FRONT_T1', category: ItemCategory.TeamMapShard, tier: 1, key: 'front', iconKey: 'team_front', displayName: 'FRONT team shard', shortLabel: 'I' },
  { id: 'T_LAVA_T2', category: ItemCategory.TeamMapShard, tier: 2, key: 'lava', iconKey: 'team_lava', displayName: 'LAVA team shard', shortLabel: 'II' },
  { id: 'T_NEXUS_T3', category: ItemCategory.TeamMapShard, tier: 3, key: 'nexus', iconKey: 'team_nexus', displayName: 'NEXUS team shard', shortLabel: 'III' },
  { id: 'T_RIFT_T4', category: ItemCategory.TeamMapShard, tier: 4, key: 'rift', iconKey: 'team_rift', displayName: 'RIFT team shard', shortLabel: 'IV' },
  { id: 'T_SANCT_T5', category: ItemCategory.TeamMapShard, tier: 5, key: 'sanct', iconKey: 'team_sanct', displayName: 'SANCT team shard', shortLabel: 'V' },
  { id: 'T_STORM_T6', category: ItemCategory.TeamMapShard, tier: 6, key: 'storm', iconKey: 'team_storm', displayName: 'STORM team shard', shortLabel: 'VI' },

  { id: 'P_CORE_NFT_T1', category: ItemCategory.PersonalMapNft, tier: 1, key: 'core', iconKey: 'personal_core_nft', displayName: 'CORE map NFT', shortLabel: 'I' },
  { id: 'P_NEON_NFT_T2', category: ItemCategory.PersonalMapNft, tier: 2, key: 'neon', iconKey: 'personal_neon_nft', displayName: 'NEON map NFT', shortLabel: 'II' },
  { id: 'P_RUNE_NFT_T3', category: ItemCategory.PersonalMapNft, tier: 3, key: 'rune', iconKey: 'personal_rune_nft', displayName: 'RUNE map NFT', shortLabel: 'III' },
  { id: 'P_STAR_NFT_T4', category: ItemCategory.PersonalMapNft, tier: 4, key: 'star', iconKey: 'personal_star_nft', displayName: 'STAR map NFT', shortLabel: 'IV' },
  { id: 'P_EMBER_NFT_T5', category: ItemCategory.PersonalMapNft, tier: 5, key: 'ember', iconKey: 'personal_ember_nft', displayName: 'EMBER map NFT', shortLabel: 'V' },
  { id: 'P_ABYSS_NFT_T6', category: ItemCategory.PersonalMapNft, tier: 6, key: 'abyss', iconKey: 'personal_abyss_nft', displayName: 'ABYSS map NFT', shortLabel: 'VI' },

  { id: 'T_FRONT_NFT_T1', category: ItemCategory.TeamMapNft, tier: 1, key: 'front', iconKey: 'team_front_nft', displayName: 'FRONT team NFT', shortLabel: 'I' },
  { id: 'T_LAVA_NFT_T2', category: ItemCategory.TeamMapNft, tier: 2, key: 'lava', iconKey: 'team_lava_nft', displayName: 'LAVA team NFT', shortLabel: 'II' },
  { id: 'T_NEXUS_NFT_T3', category: ItemCategory.TeamMapNft, tier: 3, key: 'nexus', iconKey: 'team_nexus_nft', displayName: 'NEXUS team NFT', shortLabel: 'III' },
  { id: 'T_RIFT_NFT_T4', category: ItemCategory.TeamMapNft, tier: 4, key: 'rift', iconKey: 'team_rift_nft', displayName: 'RIFT team NFT', shortLabel: 'IV' },
  { id: 'T_SANCT_NFT_T5', category: ItemCategory.TeamMapNft, tier: 5, key: 'sanct', iconKey: 'team_sanct_nft', displayName: 'SANCT team NFT', shortLabel: 'V' },
  { id: 'T_STORM_NFT_T6', category: ItemCategory.TeamMapNft, tier: 6, key: 'storm', iconKey: 'team_storm_nft', displayName: 'STORM team NFT', shortLabel: 'VI' },
];

export function getItemVisual(category: ItemCategory, tier: ItemTier, key: string): ItemVisualConfig | undefined {
  return ITEM_VISUAL_CONFIG.find(
    (c) => c.category === category && c.tier === tier && c.key === key,
  );
}

export function getItemVisualByIconKey(iconKey: string): ItemVisualConfig | undefined {
  return ITEM_VISUAL_CONFIG.find((c) => c.iconKey === iconKey);
}
