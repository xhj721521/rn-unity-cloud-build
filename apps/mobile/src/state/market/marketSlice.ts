import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMarketplaceData, MarketCategory } from '@services/game/marketClient';

type MarketStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type MarketState = {
  status: MarketStatus;
  data: MarketCategory[] | null;
  error?: string;
};

const initialState: MarketState = {
  status: 'idle',
  data: null,
};

export const loadMarketplaceData = createAsyncThunk<MarketCategory[]>(
  'market/loadMarketplaceData',
  async () => {
    const response = await fetchMarketplaceData();
    return response;
  },
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    resetMarketState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMarketplaceData.pending, (state) => {
        if (state.status === 'idle') {
          state.status = 'loading';
        }
        state.error = undefined;
      })
      .addCase(loadMarketplaceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = undefined;
      })
      .addCase(loadMarketplaceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '无法加载集市数据，请稍后再试';
      });
  },
});

export const marketReducer = marketSlice.reducer;
export const { resetMarketState } = marketSlice.actions;
