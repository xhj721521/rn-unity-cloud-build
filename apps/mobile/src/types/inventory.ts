import { ImageSourcePropType } from 'react-native';

export type InventoryKind = 'ore' | 'mapShard' | 'workerShard' | 'nft' | 'other';
export type InventoryRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type InventoryItem = {
  id: string;
  name: string;
  type: InventoryKind;
  isTeam?: boolean;
  tier?: number;
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
