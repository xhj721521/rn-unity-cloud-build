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

type TradeRecord = {
  id: string;
  buyer: string;
  seller: string;
  price: number;
  qty: number;
  total: number;
  timeAgo: string;
};

const mockHistory: TradeRecord[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `trade-${index}`,
  buyer: `Aria_${index}`,
  seller: `Pilot_${120 + index}`,
  price: 12 + index * 0.2,
  qty: 60 + index * 2,
  total: (12 + index * 0.2) * (60 + index * 2),
  timeAgo: `${index + 1} 分钟前`,
}));

export const MarketHistoryScreen = () => {
  const route = useRoute<RouteProp<MarketStackParamList, 'MarketHistory'>>();
  const [range, setRange] = useState<'4h' | '7d' | '30d'>('4h');

  const records = useMemo(() => mockHistory, [range]);
  const title = route.params.type === 'ore' ? '命运矿石成交记录' : '命运碎片成交记录';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>最近 24 小时内的成交明细，用于参考市场真实价格。</Text>
      </View>
      <View style={styles.rangeRow}>
        {(['4h', '7d', '30d'] as const).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.rangePill, range === key && styles.rangePillActive]}
            onPress={() => setRange(key)}
          >
            <Text style={[styles.rangeText, range === key && styles.rangeTextActive]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <View style={styles.recordColumn}>
              <Text style={styles.recordLabel}>买家：{maskName(item.buyer)}</Text>
              <Text style={styles.recordLabel}>卖家：{maskName(item.seller)}</Text>
            </View>
            <View style={styles.recordColumn}>
              <Text style={styles.recordValue}>价格 {item.price.toFixed(2)} ARC</Text>
              <Text style={styles.recordValue}>数量 {item.qty} 单位</Text>
            </View>
            <View style={styles.recordColumnRight}>
              <Text style={styles.recordTotal}>{item.total.toFixed(2)} ARC</Text>
              <Text style={styles.recordTime}>{item.timeAgo}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>暂时没有成交记录</Text>
            <Text style={styles.emptySubtitle}>市场还在酝酿期，耐心等等其他命运矿工出手。</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const maskName = (name: string) => `${name.slice(0, 2)}***`;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 16, paddingTop: 16 },
  header: { marginBottom: 16 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 4 },
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  rangePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
  },
  rangePillActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.18)' },
  rangeText: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  rangeTextActive: { color: '#F9FAFB', fontWeight: '600' },
  listContent: { paddingBottom: 80, gap: 10 },
  recordCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  recordColumn: { gap: 4 },
  recordColumnRight: { alignItems: 'flex-end', gap: 4 },
  recordLabel: { color: 'rgba(148,163,184,0.85)', fontSize: 12 },
  recordValue: { color: '#E5F2FF', fontSize: 13, fontWeight: '500' },
  recordTotal: { color: '#7FFBFF', fontSize: 14, fontWeight: '700' },
  recordTime: { color: 'rgba(148,163,184,0.85)', fontSize: 11 },
  emptyCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    backgroundColor: 'rgba(5,8,18,0.85)',
    alignItems: 'center',
  },
  emptyTitle: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  emptySubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 6, textAlign: 'center' },
});

export default MarketHistoryScreen;
