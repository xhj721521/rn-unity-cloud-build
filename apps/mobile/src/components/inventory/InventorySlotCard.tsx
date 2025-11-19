import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { VisualItem } from '@domain/items/itemVisualAdapter';

type Props = {
  item?: VisualItem;
  size: number;
  freeSlots?: number;
  onPress?: (item?: VisualItem) => void;
  onLongPress?: (item?: VisualItem) => void;
};

export const InventorySlotCard: React.FC<Props> = ({ item, size, freeSlots = 0, onPress, onLongPress }) => {
  const isEmpty = !item;
  const badge = item?.shortLabel ?? (item?.tier ? `T${item.tier}` : undefined);
  const isTeam = item?.isTeam && item?.type === 'mapShard';
  const count = item?.amount ?? 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: size, height: size },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
      android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
    >
      <LinearGradient
        colors={['rgba(8,14,26,0.95)', 'rgba(10,18,34,0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        {isEmpty ? (
          <View style={styles.emptyBadge}>
            <View style={styles.emptyPlus}>
              <Text style={styles.emptyPlusText}>+</Text>
            </View>
            <Text style={styles.emptyTitle}>空槽 {freeSlots}</Text>
            <Text style={styles.emptySubtitle}>等待放入物品</Text>
          </View>
        ) : (
          <>
            <View style={styles.badgeRow}>
              {isTeam ? (
                <View style={styles.teamBadge}>
                  <Text style={styles.teamText}>T</Text>
                </View>
              ) : (
                <View />
              )}
              {badge ? (
                <View style={styles.tierBadge}>
                  <Text style={styles.tierText}>{badge}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.iconBox}>
              {item?.icon ? <Image source={item.icon} style={styles.icon} resizeMode="contain" /> : null}
            </View>

            <View style={styles.footer}>
              <Text style={styles.name} numberOfLines={1}>
                {item?.name ?? '未知物品'}
              </Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>x{count}</Text>
              </View>
            </View>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.95,
  },
  inner: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    padding: 10,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(14,209,203,0.8)',
    backgroundColor: 'rgba(14,209,203,0.12)',
  },
  teamText: { color: '#7FFBFF', fontSize: 11, fontWeight: '700' },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.6)',
    backgroundColor: 'rgba(77,163,255,0.16)',
  },
  tierText: { color: '#E5F2FF', fontSize: 11, fontWeight: '700' },
  iconBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: '72%', height: '72%' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
  },
  name: {
    ...typography.caption,
    color: palette.text,
    flex: 1,
    marginRight: 6,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.5)',
    backgroundColor: 'rgba(77,163,255,0.12)',
  },
  countText: { color: '#E5F2FF', fontSize: 11, fontWeight: '700' },
  emptyBadge: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.35)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyPlus: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  emptyPlusText: { color: '#E5F2FF', fontSize: 22, fontWeight: '800' },
  emptyTitle: { color: '#E5F2FF', fontSize: 13, fontWeight: '700' },
  emptySubtitle: { color: 'rgba(229,242,255,0.7)', fontSize: 12 },
});

export default InventorySlotCard;
