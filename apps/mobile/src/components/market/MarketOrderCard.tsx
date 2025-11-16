import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MarketOrder } from '@types/market';
import PlayerBadge from './PlayerBadge';
import AssetBadge from './AssetBadge';

type Props = {
  order: MarketOrder;
  onPressAction?: (order: MarketOrder) => void;
};

export const MarketOrderCard: React.FC<Props> = ({ order, onPressAction }) => {
  const actionText = order.side === 'sell' ? '买入' : '卖给 TA';
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <PlayerBadge player={order.owner} sideLabel={order.side === 'sell' ? '卖家' : '求购方'} size="sm" />
        <View style={[styles.sidePill, order.side === 'sell' ? styles.sell : styles.buy]}>
          <Text style={styles.sideText}>{order.side === 'sell' ? '卖单' : '求购'}</Text>
        </View>
      </View>

      <View style={styles.assetWrap}>
        <AssetBadge asset={order.asset} />
      </View>

      <View style={styles.metaRow}>
        <View>
          <Text style={styles.price}>{order.price} ARC</Text>
          <Text style={styles.qty}>数量 {order.quantity}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {typeof order.change24h === 'number' ? (
            <Text style={[styles.change, { color: order.change24h >= 0 ? '#34d399' : '#fb7185' }]}>
              {order.change24h >= 0 ? '+' : ''}
              {order.change24h}%
            </Text>
          ) : null}
          {order.ordersCount ? <Text style={styles.subText}>{order.side === 'sell' ? '卖' : '求'} {order.ordersCount} 手</Text> : null}
        </View>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={() => onPressAction?.(order)} activeOpacity={0.85}>
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    gap: 10,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sidePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  sell: { borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.12)' },
  buy: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.12)' },
  sideText: { color: '#F9FAFB', fontSize: 11, fontWeight: '600' },
  assetWrap: { marginTop: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#7FFBFF', fontSize: 18, fontWeight: '700' },
  qty: { color: 'rgba(229,242,255,0.85)', fontSize: 12, marginTop: 2 },
  change: { fontSize: 12, fontWeight: '600' },
  subText: { color: 'rgba(148,163,184,0.85)', fontSize: 11 },
  actionBtn: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { color: '#F9FAFB', fontSize: 14, fontWeight: '700' },
});

export default MarketOrderCard;
