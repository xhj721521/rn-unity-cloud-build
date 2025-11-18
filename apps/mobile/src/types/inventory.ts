import { ImageSourcePropType } from 'react-native';
import { ItemCategory, ItemTier, ItemVisualConfig } from '@domain/items/itemVisualConfig';

export type InventoryKind = 'ore' | 'mapShard' | 'workerShard' | 'nft' | 'other';
export type InventoryRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type InventoryItem = {
  id: string;
  name: string;
  type: InventoryKind;
  isTeam?: boolean;
  tier?: ItemTier;
  visualCategory?: ItemCategory;
  visualKey?: string;
  iconKey?: string;
  visual?: ItemVisualConfig;
  icon: ImageSourcePropType;
  amount: number;
  rarity?: InventoryRarity;
};

export type EmptySummaryItem = {
  id: string;
  kind: 'emptySummary';
  type: InventoryKind;
  freeSlots: number;
};

export type InventoryEntry = InventoryItem | EmptySummaryItem;
