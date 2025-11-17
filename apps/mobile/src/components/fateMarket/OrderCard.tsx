import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AssetCategory, MapId, OrderSide } from '@types/fateMarket';
import oreIcons from '../../assets/ores';
import mapShardIcons from '../../assets/mapshards';
import mapNftIcons from '../../assets/mapnfts';

export type OrderCardProps = {
  id: string;
  side: OrderSide;
  category: AssetCategory;
  tier?: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  mapId?: MapId;
  itemName: string;
  description: string;
  unitPrice: number;
  amount: number;
  sellerName: string;
  changePercent?: number;
  onPressBuy: () => void;
};

export const OrderCard: React.FC<OrderCardProps> = ({
  category,
  side,
  tier,
  mapId,
  itemName,
  description,
  unitPrice,
  amount,
  sellerName,
  changePercent,
  onPressBuy,
}) => {
  const isSell = side === 'SELL';
  const iconSource: ImageSourcePropType | undefined =
    category === 'ORE' && tier
      ? oreIcons[tier]
      : category === 'MAP_SHARD' && mapId
      ? mapShardIcons[mapId]
      : category === 'MAP_NFT' && mapId
      ? mapNftIcons[mapId]
      : undefined;

  return (
    <LinearGradient
      colors={['rgba(8,18,40,0.92)', 'rgba(10,26,60,0.88)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          {iconSource ? (
            <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
          ) : (
            <Text style={styles.iconText}>{itemName.charAt(0)}</Text>
          )}
        </View>

        <View style={styles.midCol}>
          <Text style={styles.title} numberOfLines={1}>
            {itemName}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.price}>{unitPrice} ARC</Text>
            <Text style={styles.meta} numberOfLines={1}>
              数量 {amount} · 卖家 {sellerName}
            </Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={[styles.sideBadge, isSell ? styles.sell : styles.buy]}>
            <Text style={[styles.sideText, isSell ? styles.sellText : styles.buyText]}>
              {isSell ? '卖单' : '求购'}
            </Text>
          </View>
          {typeof changePercent === 'number' ? (
            <Text style={[styles.change, { color: changePercent >= 0 ? '#34d399' : '#fb7185' }]}>
              {changePercent >= 0 ? '+' : ''}
              {changePercent}%
            </Text>
          ) : null}
          <TouchableOpacity style={styles.buyBtn} activeOpacity={0.85} onPress={onPressBuy}>
            <Text style={styles.buyText}>买入</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.5)',
    backgroundColor: 'rgba(56,189,248,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconImage: { width: 40, height: 40 },
  iconText: { color: '#7FFBFF', fontSize: 20, fontWeight: '700' },
  midCol: { flex: 1, minWidth: 0 },
  title: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  desc: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 4 },
  price: { color: '#7FFBFF', fontSize: 18, fontWeight: '700' },
  meta: { color: 'rgba(148,163,184,0.8)', fontSize: 12, marginTop: 2 },
  rightCol: { width: 82, alignItems: 'center', gap: 8 },
  sideBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  sell: { borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.12)' },
  buy: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.12)' },
  sideText: { fontSize: 11, fontWeight: '700' },
  sellText: { color: '#fb7185' },
  buyText: { color: '#34d399' },
  change: { fontSize: 12, fontWeight: '600' },
  buyBtn: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    width: '85%',
    alignItems: 'center',
  },
  buyText: { color: '#F9FAFB', fontWeight: '700', fontSize: 13 },
});

export default OrderCard;
