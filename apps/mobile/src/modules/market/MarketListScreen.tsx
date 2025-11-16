import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MarketStackParamList } from '@app/navigation/types';
import { marketAssets, MarketAssetCategory, MarketSide } from '@data/marketMock';

type RouteProps = RouteProp<MarketStackParamList, 'MarketListings'>;

const CATEGORY_FILTERS: { key: MarketAssetCategory; label: string }[] = [
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '碎片' },
  { key: 'nft', label: '地图 NFT' },
  { key: 'all', label: '全部' },
];

const SIDE_FILTERS: { key: MarketSide | 'all'; label: string }[] = [
  { key: 'sell', label: '卖单' },
  { key: 'buy', label: '买单' },
  { key: 'all', label: '全部' },
];

const SUB_FILTERS: Record<MarketAssetCategory, { key: string; label: string }[]> = {
  ore: ['T1', 'T2', 'T3', 'T4', 'T5'].map((t) => ({ key: t, label: t })),
  fragment: [
    { key: 'map-personal', label: '个人地图' },
    { key: 'map-team', label: '团队地图' },
  ],
  nft: [
    { key: 'nft-personal', label: '个人 NFT' },
    { key: 'nft-team', label: '团队 NFT' },
  ],
  all: [],
};

export const MarketListScreen = () => {
  const route = useRoute<RouteProps>();
  const [category, setCategory] = useState<MarketAssetCategory>(route.params?.type ?? 'all');
  const [side, setSide] = useState<MarketSide | 'all'>(route.params?.side ?? 'all');
  const [sub, setSub] = useState<string | undefined>();

  const data = useMemo(() => {
    return marketAssets.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (side !== 'all' && item.side !== side) return false;
      if (sub) {
        return item.subType.startsWith(sub);
      }
      return true;
    });
  }, [category, side, sub]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>挂单列表</Text>
          <Text style={styles.subtitle}>查看全部命运集市挂单</Text>
        </View>

        <View style={styles.chipRow}>
          {CATEGORY_FILTERS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, category === item.key && styles.chipActive]}
              onPress={() => {
                setCategory(item.key);
                setSub(undefined);
              }}
            >
              <Text style={[styles.chipText, category === item.key && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chipRow}>
          {SIDE_FILTERS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chipSmall, side === item.key && styles.chipActive]}
              onPress={() => setSide(item.key)}
            >
              <Text style={[styles.chipText, side === item.key && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {category !== 'all' ? (
          <View style={styles.chipRow}>
            {SUB_FILTERS[category].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.chipSmall, sub === item.key && styles.chipActive]}
                onPress={() => setSub(sub === item.key ? undefined : item.key)}
              >
                <Text style={[styles.chipText, sub === item.key && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.seller.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.name}</Text>
                  <Text style={styles.rowSubtitle}>
                    {item.category === 'ore' ? item.subType : item.category === 'fragment' ? '地图碎片' : '地图 NFT'} · {item.quantity} 单位
                  </Text>
                  {item.depth ? <Text style={styles.rowHint}>{item.depth}</Text> : null}
                </View>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowPrice}>{item.price} ARC</Text>
                <View style={[styles.sidePill, item.side === 'sell' ? styles.sell : styles.buy]}>
                  <Text style={styles.sideText}>{item.side === 'sell' ? '卖单' : '买单'}</Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无挂单，稍后再来看看</Text>
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginTop: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  chipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.6)',
  },
  chipActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.2)',
  },
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
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(56,189,248,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#7FFBFF', fontSize: 15, fontWeight: '700' },
  rowTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  rowSubtitle: { color: 'rgba(229,242,255,0.78)', fontSize: 12, marginTop: 2 },
  rowHint: { color: 'rgba(148,163,184,0.8)', fontSize: 11, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 6 },
  rowPrice: { color: '#7FFBFF', fontSize: 16, fontWeight: '700' },
  sidePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  sell: { borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.1)' },
  buy: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.1)' },
  sideText: { color: '#F9FAFB', fontSize: 11, fontWeight: '600' },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    padding: 24,
    backgroundColor: 'rgba(5,8,18,0.85)',
    alignItems: 'center',
  },
  emptyText: { color: 'rgba(229,242,255,0.8)', fontSize: 13 },
});

export default MarketListScreen;
