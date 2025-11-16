import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const MarketNewAuctionScreen = () => {
  const [reserve, setReserve] = useState('');
  const [duration, setDuration] = useState('24');

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>发起地图 NFT 竞拍</Text>
          <Text style={styles.subtitle}>填写底价与时长（占位表单）</Text>

          <View style={styles.field}>
            <Text style={styles.label}>底价 (ARC)</Text>
            <TextInput
              value={reserve}
              onChangeText={setReserve}
              keyboardType="numeric"
              style={styles.input}
              placeholder="输入底价"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>持续时长（小时）</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              style={styles.input}
              placeholder="24"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <TouchableOpacity style={styles.submit}>
            <Text style={styles.submitText}>发起竞拍（占位）</Text>
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

export default MarketNewAuctionScreen;
