import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MarketStackParamList } from '@app/navigation/types';

const DURATION_OPTIONS = ['4 小时', '48 小时', '72 小时'] as const;

export const MarketNewAuctionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const [nftName, setNftName] = useState('星辉随身灯塔');
  const [startPrice, setStartPrice] = useState('520');
  const [step, setStep] = useState('20');
  const [duration, setDuration] = useState<(typeof DURATION_OPTIONS)[number]>('48 小时');

  const handleSubmit = () => {
    Alert.alert('拍卖已创建', '拍卖期间可以在 NFT 拍卖区随时查看出价情况。');
    navigation.navigate('MarketHome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>发起拍卖</Text>
        <Text style={styles.subtitle}>选择命运 NFT，设置起拍价与加价幅度，即可开始拍卖。</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>选择 NFT</Text>
          <TextInput
            style={styles.input}
            value={nftName}
            onChangeText={setNftName}
            placeholder="输入或选择 NFT 名称"
            placeholderTextColor="rgba(148,163,184,0.6)"
          />
          <Text style={styles.label}>起拍价（ARC）</Text>
          <TextInput
            style={styles.input}
            value={startPrice}
            onChangeText={setStartPrice}
            keyboardType="decimal-pad"
          />
          <Text style={styles.label}>最小加价幅度（ARC）</Text>
          <TextInput
            style={styles.input}
            value={step}
            onChangeText={setStep}
            keyboardType="decimal-pad"
          />
          <Text style={styles.label}>拍卖时长</Text>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.durationPill, duration === option && styles.durationPillActive]}
                onPress={() => setDuration(option)}
              >
                <Text style={[styles.durationText, duration === option && styles.durationTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>发起拍卖</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>拍卖结束后系统会自动结算，奖励将直接发放至你的命运账户。</Text>
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
  optionRow: { flexDirection: 'row', gap: 8 },
  durationPill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  durationPillActive: { borderColor: 'rgba(56,189,248,0.7)', backgroundColor: 'rgba(14,165,233,0.2)' },
  durationText: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  durationTextActive: { color: '#F9FAFB', fontWeight: '600' },
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

export default MarketNewAuctionScreen;
