import React from 'react';
import { StyleSheet, View } from 'react-native';
import { InventorySlot } from '@components/InventorySlot';
import { teamWarehouseItems } from '@mock/teamWarehouse';

export const WarehouseGrid = () => (
  <View style={styles.grid}>
    {teamWarehouseItems.map((item, index) => (
      <InventorySlot key={item ? item.id : `empty-${index}`} item={item} size={60} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
  },
});

export default WarehouseGrid;
