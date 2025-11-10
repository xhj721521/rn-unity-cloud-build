import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const useBottomGutter = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const paddingBottom = tabBarHeight + insets.bottom + 16;

  const inset = useMemo(() => ({ bottom: paddingBottom }), [paddingBottom]);

  return {
    paddingBottom,
    contentContainerStyle: { paddingBottom },
    contentInset: inset,
    scrollIndicatorInsets: inset,
  };
};
