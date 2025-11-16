import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { marketHistory, MarketAssetCategory } from '@data/marketMock';

const FILTERS: { key: MarketAssetCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '碎片' },
  { key: 'nft', label: '地图 NFT' },
];

export const MarketHistoryScreen = () => {
  const [filter, setFilter] = useState<MarketAssetCategory | 'all'>('all');

  const data = useMemo(
    () => (filter === 'all' ? marketHistory : marketHistory.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>成交与历史</Text>
          <Text style={styles.subtitle}>查看近期成交记录</Text>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, filter === item.key && styles.chipActive]}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[styles.chipText, filter === item.key && styles.chipTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.time}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowPrice}>{item.price} ARC</Text>
                <Text style={styles.rowAmount}>数量 {item.amount}</Text>
                <View style={[styles.status, item.status === 'success' ? styles.ok : item.status === 'pending' ? styles.pending : styles.failed]}>
                  <Text style={styles.statusText}>
                    {item.status === 'success' ? '成功' : item.status === 'pending' ? '审核中' : '失败'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无记录</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 12 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.85)', fontSize: 13, marginTop: 4 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.65)',
  },
  chipActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.18)' },
  chipText: { color: 'rgba(229,242,255,0.78)', fontSize: 13 },
  chipTextActive: { color: '#F9FAFB', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 12, gap: 12 },
  row: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  rowSubtitle: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  rowPrice: { color: '#7FFBFF', fontSize: 15, fontWeight: '700' },
  rowAmount: { color: 'rgba(229,242,255,0.8)', fontSize: 12 },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  ok: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.12)' },
  pending: { borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.12)' },
  failed: { borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.12)' },
  statusText: { color: '#F9FAFB', fontSize: 11, fontWeight: '600' },
  empty: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.85)',
  },
  emptyText: { color: 'rgba(229,242,255,0.8)', fontSize: 13 },
});

export default MarketHistoryScreen;
