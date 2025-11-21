import { ItemCategory, ItemTier, ItemVisualConfig, getItemVisual } from '@domain/items/itemVisualConfig';
import { translate as t } from '@locale/strings';
import {
  MarketAsset,
  MapKind,
  OreTier,
  PersonalMapId,
  TeamMapId,
  categoryLabel,
  kindLabel,
  personalMapLabels,
  teamMapLabels,
} from '@schemas/market';

const oreTierMap: Record<OreTier, ItemTier> = {
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  T5: 5,
};

const personalMapKey: Record<PersonalMapId, { key: string; tier: ItemTier }> = {
  ember_pit: { key: 'ember', tier: 5 },
  neon_cave: { key: 'neon', tier: 2 },
  rune_well: { key: 'rune', tier: 3 },
  starlight_grotto: { key: 'star', tier: 4 },
  abyss_gate: { key: 'abyss', tier: 6 },
  fate_core: { key: 'core', tier: 1 },
};

const teamMapKey: Record<TeamMapId, { key: string; tier: ItemTier }> = {
  alliance_front: { key: 'front', tier: 1 },
  magma_field: { key: 'lava', tier: 2 },
  central_core: { key: 'nexus', tier: 3 },
  abyss_trench: { key: 'rift', tier: 4 },
  sanctuary_hall: { key: 'sanct', tier: 5 },
  storm_mine: { key: 'storm', tier: 6 },
};

export const resolveMarketVisual = (asset: MarketAsset): ItemVisualConfig | undefined => {
  if (asset.category === 'ore') {
    const tier = oreTierMap[asset.tier];
    if (!tier) return undefined;
    return getItemVisual(ItemCategory.Ore, tier, `t${tier}`);
  }

  if (asset.category === 'fragment') {
    if (asset.kind === 'personal') {
      const entry = personalMapKey[asset.mapId as PersonalMapId];
      if (!entry) return undefined;
      return getItemVisual(ItemCategory.PersonalMapShard, entry.tier, entry.key);
    }
    const entry = teamMapKey[asset.mapId as TeamMapId];
    if (!entry) return undefined;
    return getItemVisual(ItemCategory.TeamMapShard, entry.tier, entry.key);
  }

  if (asset.category === 'mapNft') {
    if (asset.kind === 'personal') {
      const entry = personalMapKey[asset.mapId as PersonalMapId];
      if (!entry) return undefined;
      return getItemVisual(ItemCategory.PersonalMapNft, entry.tier, entry.key);
    }
    const entry = teamMapKey[asset.mapId as TeamMapId];
    if (!entry) return undefined;
    return getItemVisual(ItemCategory.TeamMapNft, entry.tier, entry.key);
  }

  return undefined;
};

export const marketAssetToText = (asset: MarketAsset): string => {
  const visual = resolveMarketVisual(asset);
  if (visual) {
    return visual.displayName;
  }
  if (asset.category === 'fragment' || asset.category === 'mapNft') {
    return `${kindLabel[asset.kind]} ${asset.category === 'fragment' ? t('item.type.shard') : t('item.type.nft')} · ${
      mapName(asset.kind, asset.mapId) ?? ''
    }`;
  }
  return categoryLabel[asset.category];
};

export const marketAssetToDesc = (asset: MarketAsset): string => {
  switch (asset.category) {
    case 'ore':
      return t('market.desc.ore');
    case 'fragment':
      return asset.kind === 'personal'
        ? t('market.desc.fragment.personal')
        : t('market.desc.fragment.team');
    case 'mapNft':
      return asset.kind === 'personal'
        ? t('market.desc.nft.personal')
        : t('market.desc.nft.team');
    default:
      return '';
  }
};

export const mapName = (kind: MapKind, mapId: string) => {
  return kind === 'personal'
    ? personalMapLabels[mapId as keyof typeof personalMapLabels]
    : teamMapLabels[mapId as keyof typeof teamMapLabels];
};
