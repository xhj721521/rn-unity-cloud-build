import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MarketStackParamList } from '@app/navigation/types';

type RouteProps = RouteProp<MarketStackParamList, 'MarketNewOrder'>;

export const MarketNewOrderScreen = () => {
  const route = useRoute<RouteProps>();
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const side = route.params?.mode ?? 'buy';
  const type = route.params?.type ?? 'ore';

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{side === 'buy' ? '发布求购' : '发布卖单'}</Text>
          <Text style={styles.subtitle}>类型：{type === 'ore' ? '矿石' : '碎片'} · 方向：{side === 'buy' ? '买单' : '卖单'}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>价格 (ARC)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
              placeholder="输入价格"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

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

          <TouchableOpacity style={styles.submit}>
            <Text style={styles.submitText}>提交挂单（占位）</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120, gap: 16 },
  title: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.85)', fontSize: 13 },
  field: { gap: 8 },
  label: { color: 'rgba(229,242,255,0.85)', fontSize: 13 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    backgroundColor: 'rgba(5,8,18,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F9FAFB',
    fontSize: 14,
  },
  submit: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitText: { color: '#F9FAFB', fontSize: 15, fontWeight: '700' },
});

export default MarketNewOrderScreen;
