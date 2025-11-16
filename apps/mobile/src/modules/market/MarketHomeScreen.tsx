import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';
import { mockOrders, marketCategories, metrics } from '@data/marketOrders';
import MarketOrderCard from '@components/market/MarketOrderCard';
import { MarketCategory, OrderSide } from '@types/market';
import PillTabs from '@components/market/PillTabs';

const CATEGORY_TABS: ({ key: MarketCategory; label: string } | { key: 'all'; label: string })[] = [
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '碎片' },
  { key: 'mapNft', label: '地图 NFT' },
  { key: 'all', label: '全部' },
];

const SORT_OPTIONS = ['价格', '数量', '最新'] as const;

export const MarketHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [sortKey, setSortKey] = useState<(typeof SORT_OPTIONS)[number]>('价格');

  const filtered = useMemo(() => {
    const list = category === 'all' ? mockOrders : mockOrders.filter((a) => a.asset.category === category);
    switch (sortKey) {
      case '数量':
        return [...list].sort((a, b) => b.quantity - a.quantity);
      case '最新':
        return list;
      default:
        return [...list].sort((a, b) => b.price - a.price);
    }
  }, [category, sortKey]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#050814', '#08152F', '#042D4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 120 },
        ]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.pageTitle}>命运集市</Text>
            <Text style={styles.pageSubtitle}>浏览挂单 · 交易矿石 / 地图碎片 / 地图 NFT</Text>
          </View>

        <PillTabs tabs={CATEGORY_TABS as any} value={category} onChange={(v) => setCategory(v)} />

          <View style={styles.sortRow}>
            <View style={styles.sortGroup}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortPill, sortKey === option && styles.sortPillActive]}
                  onPress={() => setSortKey(option)}
                >
                  <Text style={[styles.sortText, sortKey === option && styles.sortTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                category === 'nft'
                  ? navigation.navigate('MarketNewAuction')
                  : navigation.navigate('MarketNewOrder', {
                      type: category === 'all' ? 'ore' : (category as 'ore' | 'fragment'),
                      mode: 'buy',
                    })
              }
            >
              <Text style={styles.primaryButtonText}>{category === 'nft' ? '发起拍卖' : '发布求购'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricRow}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>热门挂单</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MarketListings', { type: category, side: 'all' })}>
              <Text style={styles.linkText}>浏览全部</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderGrid}>
            {filtered.slice(0, 6).map((item) => (
              <MarketOrderCard
                key={item.id}
                order={item}
                onPressAction={(order) => navigation.navigate('MarketListings', { type: order.asset.category, side: 'all' })}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  pageTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
    backgroundColor: 'rgba(5,8,18,0.75)',
  },
  tabPillActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.18)',
  },
  tabLabel: { color: 'rgba(148,163,184,0.9)', fontSize: 13 },
  tabLabelActive: { color: '#F9FAFB', fontWeight: '600' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sortGroup: { flexDirection: 'row', flexWrap: 'wrap', flex: 1, gap: 6 },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  sortPillActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.15)' },
  sortText: { color: 'rgba(148,163,184,0.9)', fontSize: 11 },
  sortTextActive: { color: '#7FFBFF', fontWeight: '600' },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#0EA5E9',
  },
  primaryButtonText: { color: '#F9FAFB', fontSize: 14, fontWeight: '600' },
  metricRow: { flexDirection: 'row', gap: 12 },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(8,18,40,0.92)',
  },
  metricLabel: { color: 'rgba(148,163,184,0.85)', fontSize: 12 },
  metricValue: { color: '#F9FAFB', fontSize: 15, fontWeight: '600', marginTop: 6 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionLabel: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  linkText: { color: '#7FFBFF', fontSize: 12 },
  orderGrid: { gap: 12, marginTop: 8 },
});

export default MarketHomeScreen;
