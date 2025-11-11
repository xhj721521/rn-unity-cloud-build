import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { CategoryChips } from '@components/inventory/CategoryChips';
import { InventoryToolbar } from '@components/inventory/Toolbar';
import { SkeletonGrid } from '@components/inventory/SkeletonGrid';
import { InventoryGrid } from '@components/InventoryGrid';
import { inventoryItems, ItemType, UIItem } from '@mock/inventory';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { tokens } from '@theme/tokens';

const CATEGORY_OPTIONS: Array<{ key: ItemType | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'ore', label: '矿石' },
  { key: 'mapshard', label: '地图碎片' },
  { key: 'minershard', label: '矿工碎片' },
  { key: 'nft', label: 'NFT' },
  { key: 'other', label: '其他' },
];

export const InventoryScreen = () => {
  const [category, setCategory] = useState<ItemType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UIItem[]>([]);
  const [boardWidth, setBoardWidth] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setItems(inventoryItems);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    if (category === 'all') {
      return items;
    }
    return items.filter((item) => item.type === category);
  }, [category, items]);

  const handleGridLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (width && Math.abs(width - boardWidth) > 1) {
        setBoardWidth(width);
      }
    },
    [boardWidth],
  );

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <Text style={styles.heading}>仓库</Text>
        <Text style={styles.subHeading}>加载中...</Text>
        <SkeletonGrid />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="plain" edgeVignette scrollable>
      <Text style={styles.heading}>仓库</Text>
      <Text style={styles.subHeading}>所有资源与 NFT 均在此管理</Text>
      <CategoryChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      <InventoryToolbar />
      <View style={styles.gridWrapper} onLayout={handleGridLayout}>
        {boardWidth > 0 ? (
          <InventoryGrid
            items={filtered}
            columns={5}
            containerWidth={boardWidth}
            innerPadding={tokens.spacing.inventoryGap}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    ...typography.heading,
    fontSize: 22,
    color: palette.text,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  subHeading: {
    ...typography.body,
    color: palette.sub,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  gridWrapper: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: tokens.colors.backgroundDeep,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 32,
  },
});
