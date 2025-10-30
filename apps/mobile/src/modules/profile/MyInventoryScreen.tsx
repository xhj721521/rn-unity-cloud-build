import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { useAppSelector } from '@state/hooks';
import { InventoryItem } from '@state/inventory/inventorySlice';

export const MyInventoryScreen = () => {
  const items = useAppSelector((state) => state.inventory.items);
  const grouped = groupByType(items);

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>我的仓库</Text>
      <Text style={styles.subHeading}>检视持有的装备、NFT 资产与消耗品。</Text>

      {grouped.map((group) => (
        <InfoCard key={group.type} title={TYPE_LABEL[group.type]}>
          {group.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {RARITY_LABEL[item.rarity]} · 数量 {item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </InfoCard>
      ))}
    </ScreenContainer>
  );
};

const groupByType = (items: InventoryItem[]) => {
  const groups = new Map<InventoryItem['type'], InventoryItem[]>();
  items.forEach((item) => {
    if (!groups.has(item.type)) {
      groups.set(item.type, []);
    }
    groups.get(item.type)?.push(item);
  });
  return Array.from(groups.entries()).map(([type, groupedItems]) => ({
    type,
    items: groupedItems,
  }));
};

const TYPE_LABEL: Record<InventoryItem['type'], string> = {
  weapon: '武器',
  armor: '护甲',
  companion: '伙伴',
  consumable: '消耗品',
};

const RARITY_LABEL: Record<InventoryItem['rarity'], string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

const styles = StyleSheet.create({
  heading: {
    color: '#F6F8FF',
    fontSize: 24,
    fontWeight: '700',
  },
  subHeading: {
    color: '#8D92A3',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#F6F8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  itemMeta: {
    color: '#8D92A3',
    fontSize: 12,
    marginTop: 4,
  },
});
