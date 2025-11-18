import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { InventoryEntry, InventoryItem, InventoryKind } from '@types/inventory';
import { ItemVisualConfig, ITEM_VISUAL_CONFIG } from '@domain/items/itemVisualConfig';
import { resolveIconSource } from '@domain/items/itemIconResolver';

type Props = {
  item: InventoryEntry;
  size: number;
  onPress?: (item: InventoryEntry) => void;
  onLongPress?: (item: InventoryEntry) => void;
  visual?: ItemVisualConfig;
  iconSource?: ImageSourcePropType;
};

const typeAccent: Record<
  InventoryKind,
  { border: string; badge: string; desc: string }
> = {
  ore: { border: 'rgba(0,229,255,0.5)', badge: 'rgba(0,229,255,0.18)', desc: 'Ore' },
  mapShard: { border: 'rgba(99,102,241,0.6)', badge: 'rgba(129,140,248,0.22)', desc: 'Map shard' },
  workerShard: { border: 'rgba(52,211,153,0.6)', badge: 'rgba(52,211,153,0.18)', desc: 'Worker shard' },
  nft: { border: 'rgba(236,72,153,0.5)', badge: 'rgba(236,72,153,0.18)', desc: 'NFT' },
  other: { border: 'rgba(148,163,184,0.4)', badge: 'rgba(148,163,184,0.16)', desc: 'Supply' },
};

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const isEmptySummary = (entry: InventoryEntry): entry is { kind: 'emptySummary'; freeSlots: number; type: InventoryKind; id: string } =>
  (entry as any).kind === 'emptySummary';

export const InventorySlotCard: React.FC<Props> = ({ item, size, onPress, onLongPress, visual, iconSource }) => {
  const baseType = isEmptySummary(item) ? item.type : item.type;
  const accent = typeAccent[baseType] ?? typeAccent.other;
  const fallbackIcon = resolveIconSource(ITEM_VISUAL_CONFIG[0]);
  const pressedScale = ({ pressed }: { pressed: boolean }) => [
    styles.card,
    {
      width: size,
      height: size,
      borderColor: accent.border,
      shadowColor: accent.border,
    },
    pressed && styles.cardPressed,
  ];

  if (isEmptySummary(item)) {
    return (
      <Pressable
        style={pressedScale}
        onPress={() => onPress?.(item)}
        onLongPress={() => onLongPress?.(item)}
        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
      >
        <LinearGradient
          colors={['rgba(7,12,22,0.9)', 'rgba(5,8,16,0.85)']}
          style={[styles.inner, { borderColor: accent.border }]}
        >
          <View style={[styles.emptyBadge, { borderColor: accent.border }]}>
            <View style={[styles.emptyPlus, { borderColor: accent.border }]}>
              <Text style={styles.emptyPlusText}>+</Text>
            </View>
            <Text style={styles.emptyTitle}>空槽 {item.freeSlots}</Text>
            <Text style={styles.emptySubtitle}>可继续存放 {accent.desc}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  const typedItem = item as InventoryItem;
  const visualConfig = visual ?? (typedItem as InventoryItem).visual;
  const tierLabel = visualConfig?.shortLabel ?? (typedItem.tier ? `T${typedItem.tier}` : undefined);
  const tierRoman = visualConfig ? undefined : typedItem.tier ? roman[Math.max(typedItem.tier - 1, 0)] : undefined;
  const showTeam = typedItem.isTeam && typedItem.type === 'mapShard';
  const isNFT = typedItem.type === 'nft';
  const displayName = visualConfig?.displayName ?? typedItem.name;
  const iconToRender = iconSource ?? typedItem.icon ?? (visualConfig ? resolveIconSource(visualConfig) : fallbackIcon);

  return (
    <Pressable
      style={pressedScale}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
      android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
    >
      <LinearGradient
        colors={
          isNFT
            ? ['rgba(24,17,48,0.96)', 'rgba(12,19,36,0.9)']
            : ['rgba(6,10,20,0.95)', 'rgba(7,13,25,0.92)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.inner, { borderColor: accent.border }]}
      >
        {isNFT ? <View style={styles.nftGlow} /> : null}
        <View style={styles.badgeRow}>
          {showTeam ? <View style={styles.teamBadge}><Text style={styles.teamText}>T</Text></View> : <View />}
          {tierLabel ? (
            <View style={[styles.tierBadge, { borderColor: accent.border, backgroundColor: accent.badge }]}>
              <Text style={styles.tierText}>{tierLabel}</Text>
              {tierRoman ? <Text style={styles.tierSub}>{tierRoman}</Text> : null}
            </View>
          ) : null}
        </View>

        <View style={styles.iconBox}>
          {iconToRender ? (
            <Image source={iconToRender} style={styles.icon} resizeMode="contain" />
          ) : (
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconPlaceholderText}>?</Text>
            </View>
          )}
        </View>

        <View style={[styles.footer, { borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={[styles.countPill, { backgroundColor: accent.badge, borderColor: accent.border }]}>
            <Text style={styles.countText}>x{typedItem.amount}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  inner: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
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
    backgroundColor: 'rgba(14,209,203,0.14)',
  },
  teamText: { color: '#7FFBFF', fontSize: 11, fontWeight: '700' },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tierText: { color: '#E5F2FF', fontSize: 11, fontWeight: '700' },
  tierSub: { color: 'rgba(229,242,255,0.8)', fontSize: 10 },
  iconBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '70%',
    height: '70%',
  },
  iconPlaceholder: {
    width: '70%',
    height: '70%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  iconPlaceholderText: { color: '#E5F2FF', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
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
  },
  countText: { color: '#E5F2FF', fontSize: 11, fontWeight: '700' },
  nftGlow: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: -10,
    height: 140,
    backgroundColor: 'rgba(236,72,153,0.08)',
    transform: [{ skewX: '-12deg' }],
  },
  emptyBadge: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
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
