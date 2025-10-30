import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMockAccountSummary } from '@services/web3/mockClient';
import { AccountSummary } from '@services/web3/types';

type AccountStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type AccountState = {
  status: AccountStatus;
  data: AccountSummary | null;
  error?: string;
};

const initialState: AccountState = {
  status: 'idle',
  data: null,
  error: undefined,
};

export const loadAccountSummary = createAsyncThunk<AccountSummary>(
  'account/loadAccountSummary',
  async () => {
    const response = await fetchMockAccountSummary();
    return response;
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountSummary.pending, (state) => {
        state.status = state.status === 'succeeded' ? state.status : 'loading';
        state.error = undefined;
      })
      .addCase(loadAccountSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = undefined;
      })
      .addCase(loadAccountSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load account summary';
      });
  },
});

export const accountReducer = accountSlice.reducer;
