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
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';
import { marketAssets } from '@data/marketMock';

const CATEGORY_TABS = [
  { key: 'all', label: '全部' },
  { key: 'ore', label: '矿石' },
  { key: 'fragment', label: '碎片' },
  { key: 'nft', label: '地图 NFT' },
] as const;

const SORT_OPTIONS = ['价格', '数量', '最新'] as const;

export const MarketHomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const [category, setCategory] = useState<(typeof CATEGORY_TABS)[number]['key']>('all');
  const [sortKey, setSortKey] = useState<(typeof SORT_OPTIONS)[number]>('价格');

  const filtered = useMemo(() => {
    const list = category === 'all' ? marketAssets : marketAssets.filter((a) => a.category === category);
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
            { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.pageTitle}>命运集市</Text>
            <Text style={styles.pageSubtitle}>浏览挂单 · 交易矿石 / 地图碎片 / 地图 NFT</Text>
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
            {[
              { label: '24h 成交额', value: '3,240,000 ARC' },
              { label: '挂单总数', value: '1,128 笔' },
              { label: '活跃买家', value: '8,420 人' },
            ].map((metric) => (
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

          <View style={styles.grid}>
            {filtered.slice(0, 6).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => navigation.navigate('MarketListings', { type: item.category, side: item.side })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.seller.name.charAt(0).toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.cardPrice}>{item.price} ARC</Text>
                <Text style={styles.cardSubtitle}>数量 {item.quantity}</Text>
                {item.depth ? <Text style={styles.cardSubtitle}>{item.depth}</Text> : null}
                {item.change ? <Text style={styles.cardChange}>{item.change}</Text> : null}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>地图 NFT 热门竞拍</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MarketListings', { type: 'nft', side: 'all' })}>
              <Text style={styles.linkText}>全部竞拍</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {filtered
              .filter((i) => i.category === 'nft')
              .slice(0, 4)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('MarketListings', { type: 'nft', side: 'all' })}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{item.seller.name.charAt(0).toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardPrice}>{item.price} ARC</Text>
                  <Text style={styles.cardSubtitle}>{item.depth ?? '出价 0'}</Text>
                  <TouchableOpacity
                    style={styles.ghostButton}
                    onPress={() => navigation.navigate('MarketNewAuction')}
                  >
                    <Text style={styles.ghostButtonText}>参与竞拍</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  card: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(8,18,40,0.92)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#F9FAFB', fontSize: 14, fontWeight: '600' },
  cardPrice: { color: '#7FFBFF', fontSize: 18, fontWeight: '700', marginTop: 6 },
  cardSubtitle: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 4 },
  cardChange: { color: '#34D399', fontSize: 11, marginTop: 2 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(56,189,248,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#7FFBFF', fontSize: 13, fontWeight: '700' },
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
