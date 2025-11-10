import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
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

  const [extraSlots, setExtraSlots] = useState(0);

  const data = useMemo(() => {
    const list = [...filtered];
    if (extraSlots > 0) {
      for (let i = 0; i < extraSlots; i++) {
        list.push(undefined as unknown as UIItem);
      }
    }
    return list;
  }, [filtered, extraSlots]);

  const handleLoadMore = () => {
    setExtraSlots((prev) => prev + 2);
  };

  const handleItemPress = (item: UIItem) => {
    Alert.alert('物品详情', `${item.name} · ${item.qty} 件`);
  };

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
    <ScreenContainer variant="plain" edgeVignette scrollable={false}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => (item ? item.id : `empty-${index}`)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomGutter.paddingBottom }]}
        contentInset={bottomGutter.contentInset}
        scrollIndicatorInsets={bottomGutter.scrollIndicatorInsets}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>仓库</Text>
            <Text style={styles.subHeading}>所有资源与 NFT 均在此管理</Text>
            <CategoryChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
            <InventoryToolbar />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.slotWrapper}>
            <ItemSlot
              item={item}
              onPressEmpty={() => Alert.alert('提示', '空槽位')}
              onPressItem={handleItemPress}
            />
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  slotWrapper: {
    flex: 1,
  },
});
