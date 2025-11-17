import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  AssetCategory,
  MapId,
  OrderSide,
  OreTier,
  mapGroups,
  mapLabelMap,
} from '@types/fateMarket';

type Props = {
  visible: boolean;
  defaultSide?: OrderSide;
  defaultCategory?: AssetCategory;
  onClose: () => void;
  onSubmit: (order: { side: OrderSide; category: AssetCategory; tier?: OreTier; mapId?: MapId; unitPrice: number; amount: number }) => void;
};

const catOptions: { key: AssetCategory; label: string }[] = [
  { key: 'ORE', label: '矿石' },
  { key: 'MAP_SHARD', label: '地图碎片' },
  { key: 'MAP_NFT', label: '地图 NFT' },
];

const oreOptions: OreTier[] = ['T1', 'T2', 'T3', 'T4', 'T5'];

export const CreateOrderModal: React.FC<Props> = ({
  visible,
  defaultSide = 'SELL',
  defaultCategory = 'ORE',
  onClose,
  onSubmit,
}) => {
  const [side, setSide] = useState<OrderSide>(defaultSide);
  const [category, setCategory] = useState<AssetCategory>(defaultCategory);
  const [oreTier, setOreTier] = useState<OreTier>('T1');
  const [mapKind, setMapKind] = useState<'personal' | 'team'>('personal');
  const firstMap = mapGroups.personal[0];
  const [mapId, setMapId] = useState<MapId>(firstMap);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const mapList = useMemo(() => (mapKind === 'personal' ? mapGroups.personal : mapGroups.team), [mapKind]);

  const handleSubmit = () => {
    const p = Number(price);
    const a = Number(amount);
    if (!Number.isFinite(p) || !Number.isFinite(a) || p <= 0 || a <= 0) {
      return;
    }
    onSubmit({
      side,
      category,
      tier: category === 'ORE' ? oreTier : undefined,
      mapId: category !== 'ORE' ? mapId : undefined,
      unitPrice: p,
      amount: a,
    });
    onClose();
  };

  const renderCategoryOptions = () => {
    if (category === 'ORE') {
      return (
        <View style={styles.rowWrap}>
          {oreOptions.map((t) => {
            const active = oreTier === t;
            return (
              <TouchableOpacity key={t} style={[styles.chip, active && styles.chipActive]} onPress={() => setOreTier(t)}>
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
          {(['personal', 'team'] as const).map((k) => {
            const active = mapKind === k;
            return (
              <TouchableOpacity
                key={k}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => {
                  setMapKind(k);
                  const first = (k === 'personal' ? mapGroups.personal[0] : mapGroups.team[0]) as MapId;
                  setMapId(first);
                }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{k === 'personal' ? '个人地图' : '团队地图'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rowWrap}>
          {mapList.map((id) => {
            const active = mapId === id;
            return (
              <TouchableOpacity key={id} style={[styles.chip, active && styles.chipActive]} onPress={() => setMapId(id)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{mapLabelMap[id]}</Text>
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
            <View style={styles.segmentRow}>
              {(['SELL', 'BUY'] as OrderSide[]).map((s) => {
                const active = side === s;
                return (
                  <TouchableOpacity key={s} style={[styles.segment, active && styles.segmentActive]} onPress={() => setSide(s)}>
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {s === 'SELL' ? '发布卖单' : '发布求购'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>交易品类</Text>
          <View style={styles.rowWrap}>
            {catOptions.map((opt) => {
              const active = category === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.chip, active && styles.chipActive]} onPress={() => setCategory(opt.key)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {renderCategoryOptions()}

          <View style={styles.field}>
            <Text style={styles.label}>数量</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
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
  segmentRow: { flexDirection: 'row', gap: 8 },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    backgroundColor: 'rgba(5,8,18,0.7)',
  },
  segmentActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  segmentText: { color: 'rgba(229,242,255,0.78)' },
  segmentTextActive: { color: '#F9FAFB', fontWeight: '700' },
  close: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  label: { color: 'rgba(229,242,255,0.85)', fontSize: 13 },
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

export default CreateOrderModal;
