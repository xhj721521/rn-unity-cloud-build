import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { InventoryGrid } from '@components/InventoryGrid';
import { UIItem } from '@mock/inventory';

type Props = {
  items: Array<UIItem | undefined>;
};

export const WarehouseGrid = ({ items }: Props) => {
  const [width, setWidth] = useState(0);

  const paddedItems = useMemo(() => {
    const next = [...items];
    while (next.length % 5 !== 0) {
      next.push(undefined);
    }
    return next;
  }, [items]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width: nextWidth } = event.nativeEvent.layout;
      if (nextWidth && Math.abs(nextWidth - width) > 1) {
        setWidth(nextWidth);
      }
    },
    [width],
  );

  return (
    <View style={styles.shell} onLayout={handleLayout}>
      {width > 0 ? (
        <InventoryGrid items={paddedItems} columns={5} containerWidth={width} innerPadding={10} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    backgroundColor: 'rgba(5,9,15,0.9)',
    paddingVertical: 12,
  },
});

export default WarehouseGrid;
