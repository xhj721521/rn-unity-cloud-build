import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Activity } from '@data/activities';

type ActivityCardProps = {
  activity: Activity;
  onPressCta: (activity: Activity) => void;
  fatePoints?: number;
  style?: ViewStyle;
};

const statusMap: Record<Activity['status'], { label: string; color: string }> = {
  ongoing: { label: '进行中', color: '#34D399' },
  upcoming: { label: '预告', color: '#FBBF24' },
  ended: { label: '已结束', color: '#94A3B8' },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPressCta, fatePoints = 0, style }) => {
  const status = statusMap[activity.status];
  const banner = activity.bannerImage
    ? { uri: activity.bannerImage }
    : undefined;
  const progress = activity.progressRatio ?? 0;
  const canPress = activity.status !== 'ended';

  const exchangeMax =
    activity.category === 'exchange' && activity.costPointsPerOre
      ? Math.floor(fatePoints / activity.costPointsPerOre)
      : 0;

  return (
    <View style={[styles.card, style, activity.glowColor ? { shadowColor: activity.glowColor } : null]}>
      <View style={styles.tagsRow}>
        <View style={styles.tagsLeft}>
          {activity.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <ImageBackground source={banner} style={styles.bannerImage} imageStyle={styles.bannerImageStyle}>
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.55)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.title}>{activity.title}</Text>
            {activity.subtitle || activity.highlightText ? (
              <Text style={styles.subtitle}>{activity.subtitle ?? activity.highlightText}</Text>
            ) : null}
          </View>
        </ImageBackground>
      </View>

      {activity.bulletPoints && activity.bulletPoints.length ? (
        <View style={styles.bulletSection}>
          {activity.bulletPoints.slice(0, 3).map((point) => (
            <View key={point} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {activity.progressRatio !== undefined || activity.stockText ? (
        <View style={styles.progressWrap}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(1, Math.max(0, progress)) * 100}%` }]} />
          </View>
          {activity.stockText ? <Text style={styles.progressText}>{activity.stockText}</Text> : null}
        </View>
      ) : null}

      {activity.category === 'challenge' && activity.rewardPointsPerRun ? (
        <Text style={styles.smallHint}>完成一次可获得 {activity.rewardPointsPerRun} 点命运积分</Text>
      ) : null}

      {activity.category === 'exchange' && activity.costPointsPerOre ? (
        <View style={styles.exchangeInfo}>
          <Text style={styles.exchangeLine}>当前命运积分：{fatePoints}</Text>
          <Text style={styles.exchangeLine}>
            兑换比例：{activity.costPointsPerOre} 积分 = 1 命运秘矿
          </Text>
          <Text style={styles.exchangeLine}>预计可兑换：{exchangeMax} 单位</Text>
        </View>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => canPress && onPressCta(activity)}
        style={[
          styles.ctaButton,
          activity.status === 'ongoing' && styles.ctaPrimary,
          activity.status === 'upcoming' && styles.ctaGhost,
          activity.status === 'ended' && styles.ctaDisabled,
        ]}
        disabled={!canPress}
      >
        <Text
          style={[
            styles.ctaText,
            activity.status === 'upcoming' && styles.ctaTextGhost,
            activity.status === 'ended' && styles.ctaTextDisabled,
          ]}
        >
          {activity.ctaText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 14,
    backgroundColor: 'rgba(8,18,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.32)',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 14,
  },
  tagsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagsLeft: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(56,189,248,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
  },
  tagText: { color: '#7FFBFF', fontSize: 11, fontWeight: '600' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#E5F2FF', fontSize: 12 },
  banner: { marginTop: 10, borderRadius: 16, overflow: 'hidden' },
  bannerImage: { height: 140, justifyContent: 'flex-end' },
  bannerImageStyle: { resizeMode: 'cover' },
  bannerTextWrap: { padding: 12 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  subtitle: { color: 'rgba(229,242,255,0.8)', marginTop: 4, fontSize: 12 },
  bulletSection: { marginTop: 10, gap: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'center' },
  bulletDot: { color: '#7FFBFF', fontSize: 14, marginRight: 6, marginTop: -2 },
  bulletText: { color: 'rgba(229,242,255,0.85)', fontSize: 12, flex: 1 },
  progressWrap: { marginTop: 10 },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#38BDF8' },
  progressText: { color: 'rgba(229,242,255,0.8)', fontSize: 11, marginTop: 6 },
  smallHint: { color: 'rgba(148,163,184,0.9)', fontSize: 12, marginTop: 8 },
  exchangeInfo: { marginTop: 8, gap: 4 },
  exchangeLine: { color: 'rgba(229,242,255,0.85)', fontSize: 12 },
  ctaButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimary: {
    backgroundColor: '#0EA5E9',
  },
  ctaGhost: {
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.6)',
    backgroundColor: 'rgba(56,189,248,0.12)',
  },
  ctaDisabled: {
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  ctaText: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  ctaTextGhost: { color: '#7FFBFF' },
  ctaTextDisabled: { color: 'rgba(255,255,255,0.55)' },
});

export default ActivityCard;
