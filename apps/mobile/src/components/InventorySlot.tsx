import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@theme/tokens';
import { UIItem } from '@mock/inventory';

type InventorySlotProps = {
  item?: UIItem;
  size: number;
};

export const InventorySlot = ({ item, size }: InventorySlotProps) => {
  const outerStyle = [
    styles.outer,
    {
      width: size,
      height: size,
      borderRadius: tokens.radius.inventoryOuter,
      borderColor: tokens.colors.accentCyanSoft,
    },
  ];
  const innerStyle = [
    styles.inner,
    {
      borderRadius: tokens.radius.inventoryInner,
      borderColor: tokens.colors.accentCyanInner,
    },
  ];

  if (!item) {
    return (
      <View style={outerStyle}>
        <View style={innerStyle}>
          <Text style={styles.emptyPlus}>+</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={outerStyle}>
      <View style={innerStyle}>
        <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        <View style={styles.countPill}>
          <Text style={styles.countText}>x{item.qty}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    padding: 4,
  },
  inner: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'rgba(5,10,16,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPlus: {
    color: 'rgba(0,229,255,0.7)',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,229,255,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  icon: {
    width: '70%',
    height: '70%',
  },
  countPill: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(5,8,16,0.8)',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default InventorySlot;
