import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';

export const useAccountSummary = () => {
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.account);

  useEffect(() => {
    if (accountState.status === 'idle') {
      dispatch(loadAccountSummary());
    }
  }, [accountState.status, dispatch]);

  const loading = accountState.status === 'loading' || accountState.status === 'idle';
  const { data, error } = accountState;
  return {
    data,
    loading,
    error,
  };
};
