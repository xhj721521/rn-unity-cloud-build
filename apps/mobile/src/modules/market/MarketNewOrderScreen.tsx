import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';

export const MarketNewOrderScreen = () => {
  const route = useRoute<RouteProp<MarketStackParamList, 'MarketNewOrder'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const { type, mode } = route.params;
  const [price, setPrice] = useState('12.5');
  const [quantity, setQuantity] = useState('80');
  const [note, setNote] = useState('');

  const total = useMemo(() => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return (p * q).toFixed(2);
  }, [price, quantity]);

  const typeLabel = type === 'ore' ? '命运矿石' : '命运碎片';
  const modeLabel = mode === 'sell' ? '发布卖单' : '发布求购';

  const handleSubmit = () => {
    Alert.alert('挂单已发布', '稍后即可在命运集市中看到。');
    navigation.navigate('MarketListings', { type, side: mode === 'sell' ? 'sell' : 'buy' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{modeLabel}</Text>
        <Text style={styles.subtitle}>
          {typeLabel} · {mode === 'sell' ? '我要上架' : '发布求购'}
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>单价（ARC）</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>数量</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
          />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>合计金额</Text>
            <Text style={styles.summaryValue}>{total} ARC</Text>
          </View>

          <Text style={styles.label}>备注（可选）</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={note}
            onChangeText={setNote}
            placeholder="可填写交割方式或联系方式"
            placeholderTextColor="rgba(148,163,184,0.6)"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>确认发布</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>发布后将进入命运集市，其他玩家可以直接与你成交。</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1, padding: 16 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 4, marginBottom: 16 },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(8,18,40,0.92)',
    padding: 16,
    gap: 12,
  },
  label: { color: 'rgba(148,163,184,0.9)', fontSize: 13 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    padding: 12,
    color: '#F9FAFB',
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { color: 'rgba(148,163,184,0.9)' },
  summaryValue: { color: '#7FFBFF', fontWeight: '600' },
  submitButton: {
    marginTop: 20,
    borderRadius: 999,
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  hintText: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 10 },
});

export default MarketNewOrderScreen;
