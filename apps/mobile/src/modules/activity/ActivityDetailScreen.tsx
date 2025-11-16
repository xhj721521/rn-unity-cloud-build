import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@app/navigation/types';
import { activities } from '@data/activities';

export const ActivityDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ActivityDetail'>>();
  const activity = activities.find((item) => item.id === route.params?.id);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#050814', '#08152F', '#042D4A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{activity?.title ?? '活动详情'}</Text>
          <Text style={styles.subtitle}>{activity?.highlightText ?? '敬请期待更多说明。'}</Text>
          {activity?.bulletPoints?.map((bp) => (
            <Text key={bp} style={styles.bullet}>
              • {bp}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  title: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(229,242,255,0.85)', fontSize: 14 },
  bullet: { color: 'rgba(229,242,255,0.8)', fontSize: 13 },
});

export default ActivityDetailScreen;
