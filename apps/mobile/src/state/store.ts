import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from './account/accountSlice';
import { teamReducer } from './team/teamSlice';
import { inventoryReducer } from './inventory/inventorySlice';
import { inviteReducer } from './invites/inviteSlice';
import { leaderboardReducer } from './leaderboard/leaderboardSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    team: teamReducer,
    inventory: inventoryReducer,
    invites: inviteReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
