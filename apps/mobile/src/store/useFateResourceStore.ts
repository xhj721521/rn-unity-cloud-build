import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type FateResourceState = {
  fatePoints: number;
  fateOre: number;
  addFatePoints: (amount: number) => void;
  spendFatePoints: (amount: number) => boolean;
  addFateOre: (amount: number) => void;
};

export const useFateResourceStore = create<FateResourceState>()(
  persist(
    (set, get) => ({
      fatePoints: 520,
      fateOre: 6,
      addFatePoints: (amount) => set((state) => ({ fatePoints: state.fatePoints + Math.max(amount, 0) })),
      spendFatePoints: (amount) => {
        const canSpend = get().fatePoints >= amount;
        if (!canSpend) {
          return false;
        }
        set((state) => ({ fatePoints: state.fatePoints - amount }));
        return true;
      },
      addFateOre: (amount) => set((state) => ({ fateOre: state.fateOre + Math.max(amount, 0) })),
    }),
    {
      name: 'fate-resource-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ fatePoints: state.fatePoints, fateOre: state.fateOre }),
    },
  ),
);
