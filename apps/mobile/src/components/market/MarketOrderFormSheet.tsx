import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  MarketAsset,
  MarketCategory,
  MapKind,
  OrderSide,
  OreTier,
  PersonalMapId,
  TeamMapId,
  personalMapLabels,
  teamMapLabels,
  oreLabels,
  categoryLabel,
} from '@types/market';

type Props = {
  visible: boolean;
  side: OrderSide;
  defaultCategory: MarketCategory;
  defaultAsset?: MarketAsset;
  onSubmit?: (payload: { side: OrderSide; asset: MarketAsset; price: number; quantity: number }) => void;
  onClose: () => void;
};

const oreTiers: OreTier[] = ['T1', 'T2', 'T3', 'T4', 'T5'];
const mapKinds: MapKind[] = ['personal', 'team'];

export const MarketOrderFormSheet: React.FC<Props> = ({
  visible,
  side,
  defaultCategory,
  defaultAsset,
  onSubmit,
  onClose,
}) => {
  const [category, setCategory] = useState<MarketCategory>(defaultCategory);
  const [kind, setKind] = useState<MapKind>(
    defaultAsset?.category === 'ore' ? 'personal' : (defaultAsset as any)?.kind ?? 'personal',
  );
  const [oreTier, setOreTier] = useState<OreTier>(
    defaultAsset?.category === 'ore' ? defaultAsset.tier : 'T1',
  );
  const [mapId, setMapId] = useState<PersonalMapId | TeamMapId>(
    defaultAsset && defaultAsset.category !== 'ore' ? defaultAsset.mapId : 'ember_pit',
  );
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const mapOptions = useMemo(
    () => (kind === 'personal' ? personalMapLabels : teamMapLabels),
    [kind],
  );

  const currentAsset: MarketAsset =
    category === 'ore'
      ? { category: 'ore', tier: oreTier }
      : { category: category === 'fragment' ? 'fragment' : 'mapNft', kind, mapId };

  const handleSubmit = () => {
    const p = Number(price);
    const q = Number(quantity);
    if (!Number.isFinite(p) || !Number.isFinite(q) || p <= 0 || q <= 0) {
      return;
    }
    onSubmit?.({ side, asset: currentAsset, price: p, quantity: q });
    onClose();
  };

  const renderAssetSelector = () => {
    if (category === 'ore') {
      return (
        <View style={styles.rowWrap}>
          {oreTiers.map((t) => {
            const active = oreTier === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setOreTier(t)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return (
      <>
        <View style={styles.rowWrap}>
          {mapKinds.map((k) => {
            const active = kind === k;
            return (
              <TouchableOpacity
                key={k}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => {
                  setKind(k);
                  setMapId(k === 'personal' ? ('ember_pit' as PersonalMapId) : ('alliance_front' as TeamMapId));
                }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{k === 'personal' ? '个人' : '团队'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rowWrap}>
          {[{ key: 'all', label: '全部' }, ...Object.keys(mapOptions).map((k) => ({ key: k, label: mapOptions[k as keyof typeof mapOptions] }))].map((item) => {
            if (item.key === 'all') {
              return null;
            }
            const active = mapId === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setMapId(item.key as any)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.mask}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{side === 'sell' ? '发布卖单' : '发布求购'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>交易品类</Text>
          <View style={styles.rowWrap}>
            {(['ore', 'fragment', 'mapNft'] as MarketCategory[]).map((c) => {
              const active = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{categoryLabel[c]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {renderAssetSelector()}

          <View style={styles.field}>
            <Text style={styles.label}>数量</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              placeholder="输入数量"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>单价 (ARC)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
              placeholder="输入单价"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <TouchableOpacity style={styles.submit} onPress={handleSubmit} activeOpacity={0.9}>
            <Text style={styles.submitText}>确认发布</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: 'rgba(8,18,40,0.98)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    gap: 10,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#F9FAFB', fontSize: 18, fontWeight: '700' },
  close: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  label: { color: 'rgba(229,242,255,0.85)', fontSize: 13 },
  field: { gap: 6 },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    backgroundColor: 'rgba(5,8,18,0.8)',
    paddingHorizontal: 10,
    color: '#F9FAFB',
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  chipActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  chipText: { color: 'rgba(229,242,255,0.78)', fontSize: 12 },
  chipTextActive: { color: '#F9FAFB', fontWeight: '700' },
  submit: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitText: { color: '#F9FAFB', fontSize: 15, fontWeight: '700' },
});

export default MarketOrderFormSheet;
