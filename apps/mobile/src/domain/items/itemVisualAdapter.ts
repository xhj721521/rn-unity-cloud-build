import { resolveIconSource } from './itemIconResolver';
import { ItemCategory, ItemVisualConfig, ItemTier, ITEM_VISUAL_CONFIG, getItemVisual } from './itemVisualConfig';
import { normalizeItem, StandardItem } from './itemModel';
import { ImageSourcePropType } from 'react-native';

export interface VisualItem {
  id: string;
  name: string;
  type: StandardItem['type'];
  amount: number;
  qty?: number; // 兼容旧字段
  isTeam?: boolean;
  rarity?: StandardItem['rarity'];
  badges?: StandardItem['badges'];
  tier?: ItemTier;
  visualCategory?: ItemCategory;
  visualKey?: string;
  visual?: ItemVisualConfig;
  icon: ImageSourcePropType;
  shortLabel?: string;
}

export function toVisualItem(raw: StandardItem): VisualItem {
  const normalized = normalizeItem(raw);
  const { type, key, tier, isTeam } = normalized;

  let category: ItemCategory | undefined;
  if (type === 'ore') category = ItemCategory.Ore;
  if (type === 'mapShard') category = isTeam ? ItemCategory.TeamMapShard : ItemCategory.PersonalMapShard;
  if (type === 'nft') category = isTeam ? ItemCategory.TeamMapNft : ItemCategory.PersonalMapNft;

  const visual = category && tier ? getItemVisual(category, tier as ItemTier, key) : undefined;
  const icon = visual ? resolveIconSource(visual) : resolveIconSource(ITEM_VISUAL_CONFIG[0]);

  return {
    id: normalized.id,
    name: visual?.displayName ?? normalized.name ?? '未知物品',
    type: normalized.type,
    amount: normalized.amount ?? 0,
    qty: normalized.amount ?? 0,
    isTeam: normalized.isTeam,
    rarity: normalized.rarity,
    badges: normalized.badges,
    tier: visual?.tier ?? (tier as ItemTier | undefined),
    visualCategory: visual?.category ?? category,
    visualKey: visual?.iconKey ?? key,
    visual,
    icon,
    shortLabel: visual?.shortLabel,
  };
}
