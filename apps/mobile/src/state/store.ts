import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from './account/accountSlice';
import { teamReducer } from './team/teamSlice';
import { inventoryReducer } from './inventory/inventorySlice';
import { inviteReducer } from './invites/inviteSlice';
import { leaderboardReducer } from './leaderboard/leaderboardSlice';
import { forgeReducer } from './forge/forgeSlice';
import { marketReducer } from './market/marketSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    team: teamReducer,
    inventory: inventoryReducer,
    invites: inviteReducer,
    leaderboard: leaderboardReducer,
    forge: forgeReducer,
    market: marketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
