import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchForgeRecipes,
  ForgeCategoryKey,
  ForgeRecipesResponse,
} from '@services/game/forgeClient';

type ForgeStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type ForgeState = {
  status: ForgeStatus;
  data: ForgeRecipesResponse | null;
  error?: string;
};

const initialState: ForgeState = {
  status: 'idle',
  data: null,
};

export const loadForgeRecipes = createAsyncThunk<ForgeRecipesResponse>(
  'forge/loadForgeRecipes',
  async () => {
    const response = await fetchForgeRecipes();
    return response;
  },
);

const forgeSlice = createSlice({
  name: 'forge',
  initialState,
  reducers: {
    resetForgeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadForgeRecipes.pending, (state) => {
        if (state.status === 'idle') {
          state.status = 'loading';
        }
        state.error = undefined;
      })
      .addCase(loadForgeRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = undefined;
      })
      .addCase(loadForgeRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '无法加载铸造配方，请稍后再试';
      });
  },
});

export const forgeReducer = forgeSlice.reducer;
export const { resetForgeState } = forgeSlice.actions;

export const selectForgeRecipes = (state: ForgeState['data'], key: ForgeCategoryKey) =>
  state ? state[key] : [];
