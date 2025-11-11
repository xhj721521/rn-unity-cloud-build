import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { InventorySlot } from './InventorySlot';
import { UIItem } from '@mock/inventory';
import { tokens } from '@theme/tokens';

type InventoryGridProps = {
  items: Array<UIItem | undefined>;
  columns?: number;
  showRarityDot?: boolean;
  selectedIds?: Set<string>;
  onPressItem?: (item: UIItem) => void;
  onLongPressItem?: (item: UIItem) => void;
  style?: ViewStyle;
  contentBottomPadding?: number;
  scrollIndicatorInsets?: { bottom: number };
};

export const InventoryGrid = ({
  items,
  columns = 5,
  showRarityDot = true,
  selectedIds,
  onPressItem,
  onLongPressItem,
  style,
  contentBottomPadding,
  scrollIndicatorInsets,
}: InventoryGridProps) => {
  const { width } = useWindowDimensions();
  const gap = tokens.spacing.inventoryGap;
  const horizontalPadding = tokens.spacing.page * 2;
  const cellSize = useMemo(() => {
    const available = width - horizontalPadding - gap * (columns - 1);
    return Math.max(60, available / columns);
  }, [width, columns, gap, horizontalPadding]);

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
      renderItem={({ item }) => (
        <Pressable
          disabled={!item}
          onPress={item ? () => onPressItem?.(item) : undefined}
          onLongPress={item ? () => onLongPressItem?.(item) : undefined}
        >
          <InventorySlot
            item={item}
            size={cellSize}
            selected={item ? selectedIds?.has(item.id) : false}
            showRarityDot={showRarityDot}
          />
        </Pressable>
      )}
      columnWrapperStyle={[styles.columnWrapper, { columnGap: gap }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: tokens.spacing.page,
          rowGap: gap,
          paddingBottom: contentBottomPadding ?? tokens.spacing.page * 2,
        },
        style,
      ]}
      style={{ backgroundColor: tokens.colors.backgroundDeep }}
      removeClippedSubviews
      scrollIndicatorInsets={scrollIndicatorInsets ?? { bottom: contentBottomPadding ?? 0 }}
      getItemLayout={getItemLayout}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: tokens.spacing.inventoryGap,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default InventoryGrid;
