import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AssetCategory, MapId, Order, OrderSide, OrderSideFilter, OreTier, SortDirection, SortField, mapGroups, mapLabelMap } from '@types/fateMarket';
import { initialOrders } from '@data/fateOrders';
import OrderCard from '@components/fateMarket/OrderCard';
import CreateOrderModal from '@components/fateMarket/CreateOrderModal';
import BuyModal from '@components/fateMarket/BuyModal';

type AssetCategoryTab = { key: AssetCategory; label: string } | { key: 'ALL'; label: string };

const assetTabs: AssetCategoryTab[] = [
  { key: 'ORE', label: '矿石' },
  { key: 'MAP_SHARD', label: '地图碎片' },
  { key: 'MAP_NFT', label: '地图 NFT' },
  { key: 'ALL', label: '全部' },
];

const oreTiers: OreTier[] = ['T1', 'T2', 'T3', 'T4', 'T5'];
const mapKindTabs = [
  { key: 'personal', label: '个人地图' },
  { key: 'team', label: '团队地图' },
];

const orderTypeTabs: { key: OrderSideFilter; label: string }[] = [
  { key: 'ALL', label: '全部' },
  { key: 'SELL', label: '卖单' },
  { key: 'BUY', label: '求购' },
];

const sortTabs: { key: SortField; label: string }[] = [
  { key: 'PRICE', label: '价格' },
  { key: 'AMOUNT', label: '数量' },
  { key: 'TIME', label: '最新' },
];

export const FateMarketScreen = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [category, setCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [oreFilter, setOreFilter] = useState<OreTier | 'ALL'>('ALL');
  const [mapKind, setMapKind] = useState<'personal' | 'team'>('personal');
  const [mapFilter, setMapFilter] = useState<MapId | 'ALL'>('ALL');
  const [sideFilter, setSideFilter] = useState<OrderSideFilter>('ALL');
  const [sortField, setSortField] = useState<SortField>('PRICE');
  const [sortDir, setSortDir] = useState<SortDirection>('DESC');

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (category !== 'ALL') {
      list = list.filter((o) => o.category === category);
    }
    if (category === 'ORE' && oreFilter !== 'ALL') {
      list = list.filter((o) => o.tier === oreFilter);
    }
    if ((category === 'MAP_SHARD' || category === 'MAP_NFT') && mapKind) {
      list = list.filter((o) => {
        if (o.category === 'MAP_SHARD' || o.category === 'MAP_NFT') {
          const isPersonal = mapGroups.personal.includes(o.mapId as MapId);
          if (mapKind === 'personal' && !isPersonal) return false;
          if (mapKind === 'team' && isPersonal) return false;
          if (mapFilter !== 'ALL') {
            return o.mapId === mapFilter;
          }
        }
        return true;
      });
    }
    if (sideFilter !== 'ALL') {
      list = list.filter((o) => o.side === sideFilter);
    }
    list.sort((a, b) => {
      if (sortField === 'PRICE') {
        return sortDir === 'DESC' ? b.unitPrice - a.unitPrice : a.unitPrice - b.unitPrice;
      }
      if (sortField === 'AMOUNT') {
        return sortDir === 'DESC' ? b.amount - a.amount : a.amount - b.amount;
      }
      return sortDir === 'DESC'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return list;
  }, [orders, category, oreFilter, mapKind, mapFilter, sideFilter, sortField, sortDir]);

  const windowHeight = Dimensions.get('window').height;
  const listHeight = windowHeight * 0.6;

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(sortDir === 'DESC' ? 'ASC' : 'DESC');
    } else {
      setSortField(field);
      setSortDir('DESC');
    }
  };

  const handleCreateOrder = (payload: { side: OrderSide; category: AssetCategory; tier?: OreTier; mapId?: MapId; unitPrice: number; amount: number }) => {
    const newOrder: Order = {
      id: `new-${Date.now()}`,
      side: payload.side,
      category: payload.category,
      tier: payload.tier,
      mapId: payload.mapId,
      itemName:
        payload.category === 'ORE'
          ? `${payload.tier} 矿石`
          : `${payload.mapId ?? ''} ${payload.category === 'MAP_SHARD' ? '地图碎片' : '地图 NFT'}`,
      description:
        payload.category === 'ORE'
          ? '可交易 · 可合成 · 可锻造'
          : payload.category === 'MAP_SHARD'
            ? '可合成拓展地图'
            : '永久解锁地图权益',
      unitPrice: payload.unitPrice,
      amount: payload.amount,
      sellerName: 'Pilot Zero',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const renderCategoryFilters = () => {
    if (category === 'ORE') {
      return (
        <View style={styles.segmentRow}>
          {(['ALL', ...oreTiers] as (OreTier | 'ALL')[]).map((t) => {
            const active = oreFilter === t;
            return (
              <TouchableOpacity key={t} style={[styles.segment, active && styles.segmentActive]} onPress={() => setOreFilter(t as any)}>
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t === 'ALL' ? '全部' : t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    if (category === 'MAP_SHARD' || category === 'MAP_NFT') {
      const maps = mapKind === 'personal' ? mapGroups.personal : mapGroups.team;
      return (
        <View style={{ gap: 8 }}>
          <View style={styles.segmentRow}>
            {mapKindTabs.map((tab) => {
              const active = mapKind === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => {
                    setMapKind(tab.key as any);
                    setMapFilter('ALL');
                  }}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.mapRow}>
            {(['ALL', ...maps] as (MapId | 'ALL')[]).map((id) => {
              const active = mapFilter === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.mapChip, active && styles.mapChipActive]}
                  onPress={() => setMapFilter(id)}
                >
                  <Text style={[styles.mapChipText, active && styles.mapChipTextActive]}>
                    {id === 'ALL' ? '全部' : mapLabelMap[id]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }
    return null;
  };

  const sortArrow = (field: SortField) => (sortField === field ? (sortDir === 'DESC' ? '↓' : '↑') : '');

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>命运集市</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setOrderModalVisible(true)}>
            <Text style={styles.primaryBtnText}>发布挂单</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.segmentRow}>
          {assetTabs.map((tab) => {
            const active = category === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => {
                  setCategory(tab.key as AssetCategory | 'ALL');
                  setOreFilter('ALL');
                  setMapFilter('ALL');
                }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {renderCategoryFilters()}

        <View style={styles.panel}>
          <View style={styles.statsRow}>
            {[
              { label: '24h 成交额', value: '3,240,000 ARC' },
              { label: '挂单总数', value: `${orders.length} 笔` },
              { label: '活跃买家', value: '8,420 人' },
            ].map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.listContainer, { height: listHeight }]}>
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <OrderCard
                  {...item}
                  onPressBuy={() => {
                    setSelectedOrder(item);
                    setBuyModalVisible(true);
                  }}
                />
              )}
              contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.bottomBar}>
            <View style={[styles.segmentRow, { flex: 1 }]}>
              {orderTypeTabs.map((tab) => {
                const active = sideFilter === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.segment, active && styles.segmentActive, { flex: 1 }]}
                    onPress={() => setSideFilter(tab.key)}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.sortGroup}>
              {sortTabs.map((tab) => {
                const active = sortField === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.sortBtn, active && styles.sortBtnActive]}
                    onPress={() => toggleSort(tab.key)}
                  >
                    <Text style={[styles.sortText, active && styles.sortTextActive]}>
                      {tab.label} {sortArrow(tab.key)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <CreateOrderModal
          visible={orderModalVisible}
          onClose={() => setOrderModalVisible(false)}
          onSubmit={handleCreateOrder}
        />
        <BuyModal
          visible={buyModalVisible}
          itemName={selectedOrder?.itemName ?? ''}
          unitPrice={selectedOrder?.unitPrice ?? 0}
          amount={selectedOrder?.amount ?? 0}
          sellerName={selectedOrder?.sellerName ?? ''}
          onClose={() => setBuyModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pageTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
  },
  primaryBtnText: { color: '#F9FAFB', fontWeight: '700' },
  segmentRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 12, flexWrap: 'wrap' },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  segmentActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  segmentText: { color: 'rgba(229,242,255,0.78)', fontSize: 13 },
  segmentTextActive: { color: '#F9FAFB', fontWeight: '700' },
  mapRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8, marginTop: 4, flexWrap: 'wrap' },
  mapChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  mapChipActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  mapChipText: { color: 'rgba(229,242,255,0.78)', fontSize: 12 },
  mapChipTextActive: { color: '#F9FAFB', fontWeight: '700' },
  panel: {
    marginTop: 16,
    marginHorizontal: 12,
    borderRadius: 20,
    padding: 14,
    backgroundColor: 'rgba(8,18,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  statsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(10,20,45,0.8)',
  },
  statLabel: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  statValue: { color: '#F9FAFB', fontSize: 15, fontWeight: '700', marginTop: 4 },
  listContainer: { marginTop: 12 },
  bottomBar: { marginTop: 12, gap: 10 },
  sortGroup: { flexDirection: 'row', gap: 8, justifyContent: 'flex-start' },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  sortBtnActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  sortText: { color: 'rgba(229,242,255,0.78)', fontSize: 12 },
  sortTextActive: { color: '#F9FAFB', fontWeight: '700' },
});

export default FateMarketScreen;
