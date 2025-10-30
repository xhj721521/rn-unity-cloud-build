import { createSlice } from '@reduxjs/toolkit';

export type InventoryItem = {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'companion' | 'consumable';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity: number;
};

type InventoryState = {
  items: InventoryItem[];
};

const initialState: InventoryState = {
  items: [
    { id: 'void-blade', name: '虚空之刃', type: 'weapon', rarity: 'epic', quantity: 1 },
    { id: 'neon-shield', name: '霓虹护盾', type: 'armor', rarity: 'rare', quantity: 1 },
    { id: 'holo-fox', name: '全息狐伙伴', type: 'companion', rarity: 'legendary', quantity: 1 },
    { id: 'energy-pack', name: '能量包', type: 'consumable', rarity: 'common', quantity: 12 },
  ],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
});

export const inventoryReducer = inventorySlice.reducer;
