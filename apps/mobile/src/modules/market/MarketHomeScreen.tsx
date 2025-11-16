import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';

const CATEGORY_TABS = [
  { key: 'all', label: '全部' },
  { key: 'ore', label: '矿石' },
  { key: 'shard', label: '碎片' },
  { key: 'nft', label: 'NFT' },
] as const;

const SORT_OPTIONS = ['价格', '数量', '最新', '流动性'] as const;

const METRIC_CARDS = [
  { key: 'volume', label: '24h 成交量', value: '3,240,000 ARC' },
  { key: 'orders', label: '挂单总数', value: '1,128 单' },
  { key: 'buyers', label: '活跃买家', value: '8,420 人' },
];

const MARKET_OVERVIEW = [
  { key: 'ore', title: '命运矿石市场', price: '12.4 ARC', change: '+3.6%', depth: '82 单' },
  { key: 'shard', title: '命运碎片市场', price: '540 ARC', change: '+1.2%', depth: '34 单' },
];

const NFT_GRID = [
  { id: 'n1', title: '灵能矩阵 · S1', current: '820 ARC', bidders: 42, endsIn: '42 分钟' },
  { id: 'n2', title: '巡航机兵核心', current: '610 ARC', bidders: 51, endsIn: '2 小时' },
  { id: 'n3', title: '星陨臂铠 · MkII', current: '420 ARC', bidders: 27, endsIn: '4 小时' },
  { id: 'n4', title: '幻影飞翼', current: '510 ARC', bidders: 33, endsIn: '8 小时' },
];

export const MarketHomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const [category, setCategory] = useState<(typeof CATEGORY_TABS)[number]['key']>('all');
  const [sortKey, setSortKey] = useState<(typeof SORT_OPTIONS)[number]>('价格');

  const filteredOverview = useMemo(() => {
    if (category === 'all') {
      return MARKET_OVERVIEW;
    }
    return MARKET_OVERVIEW.filter((item) => item.key === category);
  }, [category]);

  const handlePublish = () => {
    if (category === 'nft') {
      navigation.navigate('MarketNewAuction');
      return;
    }
    const targetType = category === 'all' ? 'ore' : (category as 'ore' | 'shard');
    navigation.navigate('MarketNewOrder', { type: targetType, mode: 'buy' });
  };

  const handleOpenListings = (type: 'ore' | 'shard' | 'nft', side: 'sell' | 'buy' | 'all') => {
    navigation.navigate('MarketListings', { type, side });
  };

  const handleOpenHistory = (type: 'ore' | 'shard') => {
    navigation.navigate('MarketHistory', { type });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.pageTitle}>命运集市</Text>
          <Text style={styles.pageSubtitle}>
            链上实时价格脉动 · 交易命运矿石 / 命运碎片 / 命运 NFT
          </Text>
        </View>

        <View style={styles.tabRow}>
          {CATEGORY_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, category === tab.key && styles.tabPillActive]}
              onPress={() => setCategory(tab.key)}
            >
              <Text style={[styles.tabLabel, category === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          <TouchableOpacity style={styles.primaryButton} onPress={handlePublish}>
            <Text style={styles.primaryButtonText}>
              {category === 'nft' ? '发起拍卖' : '发布求购'}
            </Text>
          </TouchableOpacity>
        </View>

        {category !== 'nft' ? (
          <View style={styles.metricRow}>
            {METRIC_CARDS.map((metric) => (
              <View key={metric.key} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {(category === 'all' || category === 'nft') && (
          <View style={styles.nftHeroCard}>
            <Text style={styles.sectionLabel}>NFT 焦点</Text>
            <Text style={styles.heroTitle}>量子流光战衣 · Ω</Text>
            <Text style={styles.heroStats}>当前出价 820 ARC · 86 名矿工参与拍卖</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => handleOpenListings('nft', 'all')}
              >
                <Text style={styles.heroButtonText}>查看拍卖</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroGhostButton} onPress={handlePublish}>
                <Text style={styles.heroGhostText}>发起拍卖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(category === 'all' || category === 'ore' || category === 'shard') && (
          <View style={styles.marketSection}>
            {filteredOverview.map((market) => (
              <View key={market.key} style={styles.marketCard}>
                <Text style={styles.marketTitle}>{market.title}</Text>
                <Text style={styles.marketPrice}>{market.price}</Text>
                <Text style={styles.marketChange}>{market.change}</Text>
                <Text style={styles.marketDepth}>深度 {market.depth}</Text>
                <View style={styles.marketButtons}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                      handleOpenListings(
                        market.key as 'ore' | 'shard',
                        category === 'shard' ? 'buy' : 'sell',
                      )
                    }
                  >
                    <Text style={styles.secondaryButtonText}>全部挂单</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => handleOpenHistory(market.key as 'ore' | 'shard')}
                  >
                    <Text style={styles.secondaryButtonText}>成交记录</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {(category === 'all' || category === 'nft') && (
          <View style={styles.auctionSection}>
            <Text style={styles.sectionLabel}>NFT 拍卖区</Text>
            <View style={styles.auctionGrid}>
              {NFT_GRID.map((lot) => (
                <View key={lot.id} style={styles.auctionCard}>
                  <Text style={styles.auctionTitle}>{lot.title}</Text>
                  <Text style={styles.auctionMeta}>当前出价 {lot.current}</Text>
                  <Text style={styles.auctionMetaSecondary}>{lot.bidders} 人参与 · {lot.endsIn}</Text>
                  <TouchableOpacity
                    style={styles.ghostButton}
                    onPress={() => handleOpenListings('nft', 'all')}
                  >
                    <Text style={styles.ghostButtonText}>查看详情</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
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
  nftHeroCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(12,18,34,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  sectionLabel: { color: 'rgba(148,163,184,0.85)', fontSize: 12 },
  heroTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '700', marginTop: 8 },
  heroStats: { color: 'rgba(148,163,184,0.85)', marginTop: 6, fontSize: 13 },
  heroActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  heroButton: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#0EA5E9',
  },
  heroButtonText: { color: '#F9FAFB', fontWeight: '600' },
  heroGhostButton: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
  },
  heroGhostText: { color: '#E5F2FF', fontWeight: '500' },
  marketSection: { gap: 12 },
  marketCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(8,18,40,0.92)',
  },
  marketTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  marketPrice: { color: '#7FFBFF', fontSize: 20, fontWeight: '700', marginTop: 8 },
  marketChange: { color: '#34D399', fontSize: 12, marginTop: 4 },
  marketDepth: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 2 },
  marketButtons: { flexDirection: 'row', gap: 8, marginTop: 12 },
  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#E5F2FF', fontSize: 13, fontWeight: '500' },
  auctionSection: { marginTop: 4, gap: 12 },
  auctionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  auctionCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    padding: 12,
  },
  auctionTitle: { color: '#F9FAFB', fontSize: 14, fontWeight: '600' },
  auctionMeta: { color: '#7FFBFF', fontSize: 12, marginTop: 6 },
  auctionMetaSecondary: { color: 'rgba(148,163,184,0.85)', fontSize: 11, marginTop: 2 },
  ghostButton: {
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  ghostButtonText: { color: '#E5F2FF', fontSize: 12 },
});

export default MarketHomeScreen;
