import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { activities } from '@data/activities';
import ActivityCard from '@components/ActivityCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@app/navigation/types';
import { useFateResourceStore } from '@store/useFateResourceStore';

export const MyActivitiesScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { fatePoints } = useFateResourceStore();
  const joined = useMemo(() => activities.filter((item) => item.participated), []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>我的活动</Text>
            <Text style={styles.subtitle}>记录已报名 / 进行中的活动</Text>
          </View>
          <View style={{ marginTop: 12 }}>
            {joined.map((item) => (
              <View key={item.id} style={styles.cardWrap}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.status === 'ongoing' ? '进行中' : item.status === 'upcoming' ? '已报名' : '已结束'}
                  </Text>
                </View>
                <ActivityCard activity={item} onPressCta={() => navigation.navigate('ActivityDetail', { id: item.id })} fatePoints={fatePoints} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 },
  headerRow: {},
  title: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 13, marginTop: 4 },
  cardWrap: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.5)',
  },
  badgeText: { color: '#F9FAFB', fontSize: 11, fontWeight: '600' },
});

export default MyActivitiesScreen;
