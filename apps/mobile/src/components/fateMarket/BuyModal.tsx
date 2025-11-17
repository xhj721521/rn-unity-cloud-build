import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BuyModalProps = {
  visible: boolean;
  itemName: string;
  unitPrice: number;
  amount: number;
  sellerName: string;
  onClose: () => void;
  onConfirm?: (quantity: number) => void;
};

export const BuyModal: React.FC<BuyModalProps> = ({
  visible,
  itemName,
  unitPrice,
  amount,
  sellerName,
  onClose,
  onConfirm,
}) => {
  const [qty, setQty] = useState('');
  const numericQty = useMemo(() => Math.max(0, Number(qty) || 0), [qty]);
  const total = useMemo(() => +(numericQty * unitPrice).toFixed(2), [numericQty, unitPrice]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.mask}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>买入 {itemName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.line}>单价：{unitPrice} ARC</Text>
          <Text style={styles.line}>可买数量：{amount}</Text>
          <Text style={styles.line}>卖家 / 求购方：{sellerName}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>购买数量</Text>
            <TextInput
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={styles.input}
              placeholder="输入数量"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
            <TouchableOpacity style={styles.maxBtn} onPress={() => setQty(String(amount))}>
              <Text style={styles.maxText}>全部买入</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.total}>合计 {total} ARC</Text>

          <TouchableOpacity
            style={styles.submit}
            activeOpacity={0.88}
            onPress={() => {
              if (numericQty > 0) {
                onConfirm?.(numericQty);
                onClose();
              }
            }}
          >
            <Text style={styles.submitText}>
              确认买入 {numericQty || 0} 个（{total} ARC）
            </Text>
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
    gap: 8,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#F9FAFB', fontSize: 18, fontWeight: '700' },
  close: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  line: { color: 'rgba(229,242,255,0.85)', fontSize: 13 },
  field: { gap: 6, marginTop: 6 },
  label: { color: 'rgba(229,242,255,0.85)', fontSize: 13 },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    backgroundColor: 'rgba(5,8,18,0.8)',
    paddingHorizontal: 10,
    color: '#F9FAFB',
  },
  maxBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
  },
  maxText: { color: '#7FFBFF', fontSize: 12, fontWeight: '600' },
  total: { color: '#F9FAFB', fontSize: 15, fontWeight: '700', marginTop: 4 },
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

export default BuyModal;
