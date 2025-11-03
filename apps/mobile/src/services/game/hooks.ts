import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadForgeRecipes } from '@state/forge/forgeSlice';
import { loadMarketplaceData } from '@state/market/marketSlice';

export const useForgeData = () => {
  const dispatch = useAppDispatch();
  const forgeState = useAppSelector((state) => state.forge);

  useEffect(() => {
    if (forgeState.status === 'idle') {
      dispatch(loadForgeRecipes());
    }
  }, [dispatch, forgeState.status]);

  return forgeState;
};

export const useMarketplaceData = () => {
  const dispatch = useAppDispatch();
  const marketState = useAppSelector((state) => state.market);

  useEffect(() => {
    if (marketState.status === 'idle') {
      dispatch(loadMarketplaceData());
    }
  }, [dispatch, marketState.status]);

  return marketState;
};
