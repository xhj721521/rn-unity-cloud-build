import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Activity, activities, ActivityCategory, ActivityStatus } from '@data/activities';
import ActivityCard from '@components/ActivityCard';
import { RootStackParamList } from '@app/navigation/types';
import { useFateResourceStore } from '@store/useFateResourceStore';

const STATUS_TABS: { key: ActivityStatus; label: string }[] = [
  { key: 'ongoing', label: '进行中' },
  { key: 'upcoming', label: '预告' },
  { key: 'ended', label: '已结束' },
];

const CATEGORY_TABS: { key: ActivityCategory; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'member', label: '会员' },
  { key: 'challenge', label: '挑战' },
  { key: 'raffle', label: '抽签' },
  { key: 'exchange', label: '兑换' },
];

export const ActivityHubScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [status, setStatus] = useState<ActivityStatus>('ongoing');
  const [category, setCategory] = useState<ActivityCategory>('all');
  const [exchangeActivity, setExchangeActivity] = useState<Activity | null>(null);
  const [exchangeAmount, setExchangeAmount] = useState<string>('0');

  const { fatePoints, fateOre, spendFatePoints, addFateOre } = useFateResourceStore();

  const filtered = useMemo(
    () =>
      activities.filter(
        (item) => item.status === status && (category === 'all' || item.category === category),
      ),
    [status, category],
  );

  const handleCtaPress = (activity: Activity) => {
    switch (activity.ctaType) {
      case 'gotoTrial':
        navigation.navigate('Tabs', { screen: 'Trials' });
        break;
      case 'gotoFateMineralExchange':
        setExchangeActivity(activity);
        if (activity.costPointsPerOre) {
          const max = Math.floor(fatePoints / activity.costPointsPerOre);
          setExchangeAmount(String(Math.max(max, 0)));
        }
        break;
      case 'gotoRaffle':
        navigation.navigate('ActivityDetail', { id: activity.id, type: 'raffle' });
        break;
      case 'gotoMember':
        navigation.navigate('Tabs', { screen: 'Profile', params: { screen: 'Member' } });
        break;
      case 'gotoTeam':
        navigation.navigate('Tabs', { screen: 'Profile', params: { screen: 'MyTeam' } });
        break;
      case 'openDetail':
      default:
        navigation.navigate('ActivityDetail', { id: activity.id });
        break;
    }
  };

  const confirmExchange = () => {
    if (!exchangeActivity?.costPointsPerOre) {
      setExchangeActivity(null);
      return;
    }
    const amount = Math.max(0, Math.floor(Number(exchangeAmount) || 0));
    const cost = amount * exchangeActivity.costPointsPerOre;
    if (amount <= 0 || cost <= 0) {
      setExchangeActivity(null);
      return;
    }
    const ok = spendFatePoints(cost);
    if (!ok) {
      // show toast via console for now
      console.warn('命运积分不足，去挑战获取更多吧');
      return;
    }
    addFateOre(amount);
    setExchangeActivity(null);
  };

  const maxExchange =
    exchangeActivity?.costPointsPerOre && exchangeActivity.costPointsPerOre > 0
      ? Math.floor(fatePoints / exchangeActivity.costPointsPerOre)
      : 0;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#050814', '#08152F', '#042D4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.pageTitle}>活动指挥部</Text>
              <Text style={styles.pageSubtitle}>限时挑战 · 注能增益 · 兑换奖励</Text>
            </View>
            <TouchableOpacity
              style={styles.myActivityBtn}
              onPress={() => navigation.navigate('MyActivities')}
            >
              <Text style={styles.myActivityText}>我的活动</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            {STATUS_TABS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, status === item.key && styles.filterPillActive]}
                onPress={() => setStatus(item.key)}
              >
                <Text style={[styles.filterText, status === item.key && styles.filterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.filterRow, { marginTop: 10 }]}>
            {CATEGORY_TABS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPillSmall, category === item.key && styles.filterPillActive]}
                onPress={() => setCategory(item.key)}
              >
                <Text
                  style={[styles.filterText, category === item.key && styles.filterTextActive, { fontSize: 12 }]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 16 }}>
            {filtered.map((item) => (
              <ActivityCard
                key={item.id}
                activity={item}
                onPressCta={handleCtaPress}
                fatePoints={fatePoints}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!exchangeActivity} transparent animationType="slide" onRequestClose={() => setExchangeActivity(null)}>
        <View style={styles.modalMask}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>命运秘矿兑换</Text>
            <Text style={styles.modalLine}>当前命运积分：{fatePoints}</Text>
            <Text style={styles.modalLine}>
              兑换比例：{exchangeActivity?.costPointsPerOre} 积分 = 1 命运秘矿
            </Text>
            <Text style={styles.modalLine}>最多可兑换：{maxExchange} 单位</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>兑换数量</Text>
              <TextInput
                value={exchangeAmount}
                keyboardType="numeric"
                onChangeText={setExchangeAmount}
                style={styles.input}
                placeholder="输入数量"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
              <TouchableOpacity style={styles.maxBtn} onPress={() => setExchangeAmount(String(maxExchange))}>
                <Text style={styles.maxBtnText}>最大</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setExchangeActivity(null)}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmExchange}>
                <Text style={styles.confirmText}>确认兑换</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHint}>命运秘矿可用于高级副本与秘矿玩法。</Text>
            <Text style={styles.modalHint}>当前持有命运秘矿：{fateOre}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 4 },
  myActivityBtn: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(56,189,248,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.5)',
  },
  myActivityText: { color: '#7FFBFF', fontSize: 13, fontWeight: '600' },
  filterRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  filterPill: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,8,18,0.6)',
  },
  filterPillSmall: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,8,18,0.45)',
  },
  filterPillActive: {
    borderColor: 'rgba(56,189,248,0.7)',
    backgroundColor: 'rgba(14,165,233,0.2)',
  },
  filterText: { color: 'rgba(229,242,255,0.75)', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#F9FAFB', fontWeight: '700' },
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'rgba(8,18,40,0.98)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
  },
  modalTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '700' },
  modalLine: { color: 'rgba(229,242,255,0.85)', fontSize: 13, marginTop: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  inputLabel: { color: 'rgba(229,242,255,0.8)', fontSize: 13, marginRight: 8 },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.5)',
    paddingHorizontal: 10,
    color: '#F9FAFB',
    backgroundColor: 'rgba(5,8,18,0.8)',
  },
  maxBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.6)',
  },
  maxBtnText: { color: '#7FFBFF', fontSize: 12, fontWeight: '600' },
  modalActions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
  },
  cancelText: { color: 'rgba(229,242,255,0.8)', fontSize: 14 },
  confirmText: { color: '#F9FAFB', fontSize: 15, fontWeight: '700' },
  modalHint: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 6 },
});

export default ActivityHubScreen;
