import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MarketStackParamList } from '@app/navigation/types';

type ListingSide = 'sell' | 'buy';

type ListingItem = {
  id: string;
  seller: string;
  buyer?: string;
  price: number;
  quantity: number;
  liquidity: number;
};

const mockListings: Record<'ore' | 'shard' | 'nft', ListingItem[]> = {
  ore: Array.from({ length: 18 }).map((_, index) => ({
    id: `ore-${index}`,
    seller: `矿工 ${index + 1}`,
    price: 12.4 + index * 0.2,
    quantity: 40 + index * 6,
    liquidity: 80 - index,
  })),
  shard: Array.from({ length: 12 }).map((_, index) => ({
    id: `shard-${index}`,
    seller: `碎片大师 ${index + 1}`,
    price: 540 + index * 8,
    quantity: 2 + index,
    liquidity: 60 - index,
  })),
  nft: [],
};

export const MarketListingsScreen = () => {
  const route = useRoute<RouteProp<MarketStackParamList, 'MarketListings'>>();
  const type = (route.params?.type ?? 'ore') as 'ore' | 'shard' | 'nft';
  const [side, setSide] = useState<ListingSide>(route.params?.side === 'buy' ? 'buy' : 'sell');
  const [sortKey, setSortKey] = useState<'price' | 'quantity'>('price');

  const listings = useMemo(() => {
    const data = mockListings[type];
    const sorted = [...data].sort((a, b) =>
      sortKey === 'price' ? a.price - b.price : a.quantity - b.quantity,
    );
    return sorted;
  }, [type, sortKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          命运{type === 'ore' ? '矿石' : type === 'shard' ? '碎片' : 'NFT'}全部挂单
        </Text>
        <Text style={styles.subtitle}>实时价格、数量与深度信息，帮助你快速撮合交易。</Text>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.sideTabs}>
          {(['sell', 'buy'] as ListingSide[]).map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.sidePill, side === value && styles.sidePillActive]}
              onPress={() => setSide(value)}
            >
              <Text style={[styles.sideText, side === value && styles.sideTextActive]}>
                {value === 'sell' ? '卖单' : '求购'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sideTabs}>
          {(['price', 'quantity'] as const).map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.sortPill, sortKey === key && styles.sortPillActive]}
              onPress={() => setSortKey(key)}
            >
              <Text style={[styles.sortText, sortKey === key && styles.sortTextActive]}>
                {key === 'price' ? '价格' : '数量'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{item.seller}</Text>
              <Text style={styles.listMeta}>单价 {item.price.toFixed(2)} ARC</Text>
              <Text style={styles.listMeta}>数量 {item.quantity} 单位</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.listLiquidity}>流动性 {item.liquidity}%</Text>
              <TouchableOpacity style={styles.listAction}>
                <Text style={styles.listActionText}>{side === 'sell' ? '下单购买' : '联系卖家'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>暂时没有符合条件的挂单</Text>
            <Text style={styles.emptySubtitle}>
              {side === 'sell'
                ? '你可以成为第一个挂单的人。'
                : '目前还没有人发出求购，试试挂个卖单吧。'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 16, paddingTop: 16 },
  header: { marginBottom: 16 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 4 },
  filterRow: { gap: 12, marginBottom: 12 },
  sideTabs: { flexDirection: 'row', gap: 8 },
  sidePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
  },
  sidePillActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.18)' },
  sideText: { color: 'rgba(148,163,184,0.9)', fontSize: 13 },
  sideTextActive: { color: '#F9FAFB', fontWeight: '600' },
  sortPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
  },
  sortPillActive: { borderColor: 'rgba(56,189,248,0.7)' },
  sortText: { color: 'rgba(148,163,184,0.9)', fontSize: 11 },
  sortTextActive: { color: '#7FFBFF' },
  listContent: { paddingBottom: 80, gap: 12 },
  listCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    flexDirection: 'row',
    gap: 12,
  },
  listTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  listMeta: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 2 },
  listLiquidity: { color: '#7FFBFF', fontSize: 12 },
  listAction: {
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
  },
  listActionText: { color: '#E5F2FF', fontSize: 12 },
  emptyCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    backgroundColor: 'rgba(5,8,18,0.85)',
    alignItems: 'center',
  },
  emptyTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  emptySubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 6, textAlign: 'center' },
});

export default MarketListingsScreen;
