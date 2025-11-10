import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { CategoryChips } from '@components/inventory/CategoryChips';
import { InventoryToolbar } from '@components/inventory/Toolbar';
import { ItemSlot } from '@components/inventory/ItemSlot';
import { SkeletonGrid } from '@components/inventory/SkeletonGrid';
import { inventoryItems, ItemType, UIItem } from '@mock/inventory';
import { useBottomGutter } from '@hooks/useBottomGutter';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

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

  const bottomGutter = useBottomGutter();
  const { width: windowWidth } = useWindowDimensions();

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

  const data = useMemo(() => filtered, [filtered]);

  const handleItemPress = (item: UIItem) => {
    Alert.alert('物品详情', `${item.name} · ${item.qty} 件`);
  };

  const boardWidth = windowWidth - 32; // ScreenContainer horizontal padding
  const columns = 4;
  const gap = 8;
  const cellSize = Math.max(64, (boardWidth - gap * (columns - 1)) / columns);

  const renderGrid = () => (
    <View style={[styles.boardFrame, { paddingBottom: bottomGutter.paddingBottom }]}>
      <View style={[styles.board, { columnGap: gap, rowGap: gap }]}>
        {data.map((item, index) => (
          <View
            key={item ? item.id : `empty-${index}`}
            style={[styles.cell, { width: cellSize, height: cellSize }]}
          >
            <ItemSlot
              item={item}
              onPressEmpty={() => Alert.alert('提示', '空槽位')}
              onPressItem={handleItemPress}
            />
          </View>
        ))}
      </View>
    </View>
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
      {renderGrid()}
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
  boardFrame: {
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(5,8,18,0.85)',
    padding: 12,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cell: {
    borderRadius: 18,
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
});
