import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MarketStackParamList } from '@app/navigation/types';
import { mockOrders } from '@data/marketOrders';
import {
  MarketCategory,
  OrderSide,
  OreTier,
  MapKind,
  PersonalMapId,
  TeamMapId,
  MarketAsset,
} from '@types/market';
import PillTabs from '@components/market/PillTabs';
import MarketOrderCard from '@components/market/MarketOrderCard';
import { personalMapLabels, teamMapLabels } from '@types/market';
import MarketOrderFormSheet from '@components/market/MarketOrderFormSheet';

type RouteProps = RouteProp<MarketStackParamList, 'MarketListings'>;

const CATEGORY_TABS: { key: MarketCategory | 'all'; label: string }[] = [
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '碎片' },
  { key: 'mapNft', label: '地图 NFT' },
  { key: 'all', label: '全部' },
];

const SIDE_TABS: { key: OrderSide | 'all'; label: string }[] = [
  { key: 'sell', label: '卖单' },
  { key: 'buy', label: '求购' },
  { key: 'all', label: '全部' },
];

const ORE_FILTERS: OreTier[] = ['T1', 'T2', 'T3', 'T4', 'T5'];
const MAP_KIND_FILTERS: { key: MapKind; label: string }[] = [
  { key: 'personal', label: '个人' },
  { key: 'team', label: '团队' },
];

const sortOptions: { key: 'price' | 'quantity' | 'latest'; label: string }[] = [
  { key: 'price', label: '价格' },
  { key: 'quantity', label: '数量' },
  { key: 'latest', label: '最新' },
];

export const MarketOrderListScreen = () => {
  const route = useRoute<RouteProps>();
  const initialCategory = route.params?.type ?? 'all';
  const [category, setCategory] = useState<MarketCategory | 'all'>(initialCategory);
  const [side, setSide] = useState<OrderSide | 'all'>(route.params?.side ?? 'all');
  const [sortKey, setSortKey] = useState<'price' | 'quantity' | 'latest'>('price');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [oreFilter, setOreFilter] = useState<OreTier | 'all'>('all');
  const [mapKind, setMapKind] = useState<MapKind>('personal');
  const [mapFilter, setMapFilter] = useState<PersonalMapId | TeamMapId | 'all'>('all');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetSide, setSheetSide] = useState<OrderSide>('sell');
  const [sheetCategory, setSheetCategory] = useState<MarketCategory>('ore');
  const [sheetAsset, setSheetAsset] = useState<MarketAsset | undefined>(undefined);

  const mapLabels = mapKind === 'personal' ? personalMapLabels : teamMapLabels;
  const mapFilterKeys = Object.keys(mapLabels) as (PersonalMapId | TeamMapId)[];

  const data = useMemo(() => {
    let list = mockOrders;
    if (category !== 'all') {
      list = list.filter((o) => o.asset.category === category);
    }
    if (side !== 'all') {
      list = list.filter((o) => o.side === side);
    }
    if (category === 'ore' && oreFilter !== 'all') {
      list = list.filter((o) => o.asset.category === 'ore' && o.asset.tier === oreFilter);
    }
    if ((category === 'fragment' || category === 'mapNft') && mapFilter !== 'all') {
      list = list.filter(
        (o) =>
          o.asset.category !== 'ore' &&
          o.asset.kind === mapKind &&
          o.asset.mapId === mapFilter,
      );
    } else if (category === 'fragment' || category === 'mapNft') {
      list = list.filter(
        (o) => o.asset.category !== 'ore' && o.asset.kind === mapKind,
      );
    }

    const sorted = [...list];
    if (sortKey === 'price') {
      sorted.sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
    } else if (sortKey === 'quantity') {
      sorted.sort((a, b) => (sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity));
    }
    // latest: keep original order for now
    return sorted;
  }, [category, side, oreFilter, mapKind, mapFilter, sortKey, sortAsc]);

  const toggleSort = (key: 'price' | 'quantity' | 'latest') => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const handleOpenForm = (asset?: MarketAsset, sideOverride?: OrderSide) => {
    setSheetSide(sideOverride ?? 'sell');
    const cat =
      asset?.category ??
      (category === 'all' ? 'ore' : (category as MarketCategory));
    setSheetCategory(cat);
    setSheetAsset(asset);
    setSheetVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>挂单列表</Text>
          <Text style={styles.subtitle}>浏览全部命运集市挂单</Text>
        </View>

        <PillTabs tabs={CATEGORY_TABS} value={category} onChange={(v) => { setCategory(v); setOreFilter('all'); setMapFilter('all'); }} style={styles.sectionPad} />
        <PillTabs tabs={SIDE_TABS} value={side} onChange={setSide} style={styles.sectionPad} />

        {category === 'ore' ? (
          <View style={styles.sectionPad}>
            <PillTabs
              tabs={[{ key: 'all', label: '全部' }, ...ORE_FILTERS.map((t) => ({ key: t, label: t }))] as any}
              value={oreFilter}
              onChange={setOreFilter as any}
              small
            />
          </View>
        ) : null}

        {category === 'fragment' || category === 'mapNft' ? (
          <>
            <View style={styles.sectionPad}>
              <PillTabs tabs={MAP_KIND_FILTERS as any} value={mapKind} onChange={(v) => { setMapKind(v as MapKind); setMapFilter('all'); }} small />
            </View>
            <View style={styles.sectionPad}>
              <PillTabs
                tabs={[{ key: 'all', label: '全部' }, ...mapFilterKeys.map((m) => ({ key: m, label: mapLabels[m] }))] as any}
                value={mapFilter}
                onChange={setMapFilter as any}
                small
              />
            </View>
          </>
        ) : null}

        <View style={[styles.sectionPad, styles.sortRow]}>
          {sortOptions.map((opt) => {
            const active = sortKey === opt.key;
            const arrow = active ? (sortAsc ? '↑' : '↓') : '';
            return (
              <TouchableOpacity key={opt.key} style={[styles.sortBtn, active && styles.sortBtnActive]} onPress={() => toggleSort(opt.key)}>
                <Text style={[styles.sortText, active && styles.sortTextActive]}>{opt.label}{arrow}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MarketOrderCard order={item} onPressAction={() => handleOpenForm(item, item.side === 'sell' ? 'buy' : 'sell')} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无挂单，稍后再来看看</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.fab} onPress={() => handleOpenForm()}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <MarketOrderFormSheet
          visible={sheetVisible}
          side={sheetSide}
          defaultCategory={sheetCategory}
          defaultAsset={sheetAsset}
          onClose={() => setSheetVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 12 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.85)', fontSize: 13, marginTop: 4 },
  sectionPad: { paddingHorizontal: 16, marginTop: 12 },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
    alignItems: 'center',
  },
  sortBtnActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.18)' },
  sortText: { color: 'rgba(229,242,255,0.78)', fontSize: 12 },
  sortTextActive: { color: '#F9FAFB', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 140, paddingTop: 12, gap: 12 },
  empty: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.85)',
  },
  emptyText: { color: 'rgba(229,242,255,0.8)', fontSize: 13 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  fabText: { color: '#F9FAFB', fontSize: 28, fontWeight: '800' },
});

export default MarketOrderListScreen;
