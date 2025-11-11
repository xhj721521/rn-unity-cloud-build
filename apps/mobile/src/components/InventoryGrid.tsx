import React, { useMemo } from 'react';
import { FlatList, StyleSheet, ViewStyle } from 'react-native';
import { InventorySlot } from './InventorySlot';
import { UIItem } from '@mock/inventory';
import { tokens } from '@theme/tokens';

type InventoryGridProps = {
  items: Array<UIItem | undefined>;
  columns?: number;
  style?: ViewStyle;
  containerWidth: number;
  innerPadding?: number;
};

export const InventoryGrid = ({
  items,
  columns = 5,
  containerWidth,
  innerPadding = 12,
  style,
}: InventoryGridProps) => {
  const gap = tokens.spacing.inventoryGap;
  const cellSize = useMemo(() => {
    const available = containerWidth - innerPadding * 2 - gap * (columns - 1);
    return Math.floor(available / columns);
  }, [containerWidth, innerPadding, gap, columns]);

  const paddedItems = useMemo(() => {
    const result = [...items];
    while (result.length % columns !== 0) {
      result.push(undefined);
    }
    return result;
  }, [items, columns]);

  const getItemLayout = (_: unknown, index: number) => {
    const length = cellSize + gap;
    const row = Math.floor(index / columns);
    return { length, offset: row * length, index };
  };

  return (
    <FlatList
      data={paddedItems}
      numColumns={columns}
      keyExtractor={(item, index) => (item ? item.id : `empty-${index}`)}
      renderItem={({ item }) => <InventorySlot item={item} size={cellSize} />}
      columnWrapperStyle={[styles.columnWrapper, { columnGap: gap }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: innerPadding,
          paddingVertical: innerPadding,
          rowGap: gap,
        },
        style,
      ]}
      removeClippedSubviews
      getItemLayout={getItemLayout}
    />
  );
};

const styles = StyleSheet.create({
  content: {},
  columnWrapper: {
    justifyContent: 'flex-start',
  },
});

export default InventoryGrid;
