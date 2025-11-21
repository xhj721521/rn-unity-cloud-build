import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';
import { mockOrders, metrics } from '@data/marketOrders';
import { MarketOrder, MarketOrderStatus } from '@schemas/market';
import { translate as t } from '@locale/strings';
import EnergyItemIcon from '@components/items/EnergyItemIcon';
import { marketAssetToDesc, marketAssetToText, resolveMarketVisual } from '@components/market/utils';

const STATUS_TABS: Array<{ key: MarketOrderStatus; labelKey: string }> = [
  { key: 'live', labelKey: 'market.filter.live' },
  { key: 'redeem', labelKey: 'market.filter.redeem' },
  { key: 'upcoming', labelKey: 'market.filter.upcoming' },
  { key: 'ended', labelKey: 'market.filter.ended' },
];

const GROUPS = [
  { key: 'ore', labelKey: 'market.section.ore', matcher: (order: MarketOrder) => order.asset.category === 'ore' },
  { key: 'fragment', labelKey: 'market.section.fragment', matcher: (order: MarketOrder) => order.asset.category === 'fragment' },
  { key: 'mapNft', labelKey: 'market.section.nft', matcher: (order: MarketOrder) => order.asset.category === 'mapNft' },
] as const;

export const MarketHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const [status, setStatus] = useState<MarketOrderStatus>('live');
  const { width } = useWindowDimensions();
  const contentPadding = 16;
  const gap = 12;
  const columns = width >= 420 ? 3 : 2;
  const cardWidth = (width - contentPadding * 2 - gap * (columns - 1)) / columns;

  const filtered = useMemo(
    () => mockOrders.filter((order) => (order.status ?? 'live') === status),
    [status],
  );

  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({
        key: group.key,
        label: t(group.labelKey),
        items: filtered.filter(group.matcher),
      })).filter((group) => group.items.length > 0),
    [filtered],
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.contentContainer, { paddingHorizontal: contentPadding, paddingBottom: 140 }]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.pageTitle}>{t('market.title')}</Text>
            <Text style={styles.pageSubtitle}>{t('market.subtitle')}</Text>
          </View>

          <View style={styles.filterRow}>
            {STATUS_TABS.map((tab) => {
              const active = status === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setStatus(tab.key)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{t(tab.labelKey)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.metricRow}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          {grouped.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('market.status.empty')}</Text>
            </View>
          ) : (
            grouped.map((group) => (
              <View key={group.key} style={styles.groupBlock}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('MarketListings', {
                        type: group.key === 'ore' ? 'ore' : group.key === 'fragment' ? 'fragment' : 'mapNft',
                        side: 'all',
                      })
                    }
                  >
                    <Text style={styles.linkText}>{t('market.action.viewAll')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.gridWrap, { marginHorizontal: -(gap / 2) }]}>
                  {group.items.map((order) => (
                    <MarketGridItem
                      key={order.id}
                      order={order}
                      width={cardWidth}
                      onPress={() =>
                        navigation.navigate('MarketListings', {
                          type: order.asset.category,
                          side: 'all',
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

type GridItemProps = {
  order: MarketOrder;
  width: number;
  onPress: () => void;
};

const MarketGridItem: React.FC<GridItemProps> = ({ order, width, onPress }) => {
  const visual = resolveMarketVisual(order.asset);
  const title = visual?.displayName ?? marketAssetToText(order.asset);
  const desc = marketAssetToDesc(order.asset);
  const priceLabel = `${order.price} ARC`;
  const quantityLabel = `${t('market.label.quantity')} ${order.quantity}`;
  const actionLabel = order.side === 'sell' ? t('market.action.buy') : t('market.action.sell');

  return (
    <View style={[styles.itemCard, { width: width, marginHorizontal: 6, marginBottom: 12 }]}>
      {visual ? (
        <EnergyItemIcon visual={visual} size={width * 0.65} />
      ) : (
        <View style={[styles.iconFallback, { width: width * 0.65, height: width * 0.65 }]}>
          <Text style={styles.iconFallbackText}>{title.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.itemName} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.itemDesc} numberOfLines={1}>
        {desc}
      </Text>
      <Text style={styles.itemPrice}>{priceLabel}</Text>
      <Text style={styles.itemMeta}>{quantityLabel}</Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.itemActionButton,
          order.side === 'sell' ? styles.itemActionBuy : styles.itemActionSell,
          pressed && styles.itemActionPressed,
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.12)', borderless: false }}
      >
        <Text
          style={[
            styles.itemActionText,
            order.side === 'sell' ? styles.itemActionTextDark : styles.itemActionTextLight,
          ]}
        >
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    gap: 20,
  },
  pageTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 4 },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  filterChip: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31,42,68,0.8)',
    backgroundColor: 'rgba(4,8,20,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    borderColor: '#4DA3FF',
    backgroundColor: 'rgba(77,163,255,0.18)',
  },
  filterText: { color: '#7E8AA6', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#EAF2FF', fontWeight: '700' },
  metricRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  linkText: { color: '#7FFBFF', fontSize: 12 },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 60,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyText: { color: 'rgba(148,163,184,0.85)', fontSize: 13 },
  groupBlock: { marginTop: 12 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  groupLabel: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  itemCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(6,10,24,0.92)',
    padding: 12,
    alignItems: 'center',
  },
  iconFallback: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(12,20,45,0.6)',
    marginBottom: 6,
  },
  iconFallbackText: { color: '#7FFBFF', fontSize: 22, fontWeight: '700' },
  itemName: { color: '#F9FAFB', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  itemDesc: { color: 'rgba(148,163,184,0.85)', fontSize: 11, textAlign: 'center', marginTop: 2 },
  itemPrice: { color: '#7FFBFF', fontSize: 16, fontWeight: '700', marginTop: 6 },
  itemMeta: { color: 'rgba(229,242,255,0.8)', fontSize: 11, marginTop: 2 },
  itemActionButton: {
    marginTop: 10,
    borderRadius: 12,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  itemActionBuy: {
    backgroundColor: '#0EA5E9',
    borderColor: '#38bdf8',
  },
  itemActionSell: {
    backgroundColor: 'rgba(52,211,153,0.15)',
    borderColor: '#34d399',
  },
  itemActionPressed: {
    transform: [{ scale: 0.95 }],
  },
  itemActionText: { fontSize: 13, fontWeight: '600' },
  itemActionTextDark: { color: '#0B0F1E' },
  itemActionTextLight: { color: '#34d399' },
});

export default MarketHomeScreen;
