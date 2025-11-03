import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { useAppSelector } from '@state/hooks';

export const MyTeamScreen = () => {
  const members = useAppSelector((state) => state.team.members);
  const memberCount = members.length;
  const totalPower = members.reduce((sum, member) => sum + member.powerScore, 0);
  const avgPower = memberCount ? Math.round(totalPower / memberCount) : 0;
  const latestOnline = members.reduce<string | null>((latest, member) => {
    const timestamp = new Date(member.lastActive).getTime();
    if (!latest) {
      return member.lastActive;
    }
    return timestamp > new Date(latest).getTime() ? member.lastActive : latest;
  }, null);

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>我的团队</Text>
      <Text style={styles.subHeading}>管理战队成员、权限与协作策略。</Text>

      <LinearGradient
        colors={['rgba(63, 242, 255, 0.18)', 'rgba(124, 92, 255, 0.24)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryMetricRow}>
          <View style={styles.summaryMetric}>
            <Text style={styles.metricLabel}>成员总数</Text>
            <Text style={styles.metricValue}>{memberCount}</Text>
          </View>
          <View style={styles.summaryMetric}>
            <Text style={styles.metricLabel}>平均战力</Text>
            <Text style={styles.metricValue}>{avgPower}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <Text style={styles.metricHint}>
          最近活跃：{latestOnline ? new Date(latestOnline).toLocaleString() : '暂无记录'}
        </Text>
      </LinearGradient>

      <View style={styles.memberGrid}>
        {members.map((member) => {
          const roleAccent = ROLE_ACCENT[member.role];
          const activity = getActivityStatus(member.lastActive);
          const statusPalette = ACTIVITY_PALETTE[activity.tone];
          return (
            <LinearGradient
              key={member.id}
              colors={['rgba(20, 22, 52, 0.9)', 'rgba(12, 10, 36, 0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.memberCard}
            >
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member.nickname}</Text>
                <View
                  style={[
                    styles.roleBadge,
                    { borderColor: roleAccent, backgroundColor: `${roleAccent}1a` },
                  ]}
                >
                  <Text style={[styles.roleText, { color: roleAccent }]}>
                    {ROLE_LABEL[member.role]}
                  </Text>
                </View>
              </View>
              <View style={styles.memberMeta}>
                <View style={styles.metaColumn}>
                  <Text style={styles.metaLabel}>战斗力</Text>
                  <Text style={styles.metaValue}>{member.powerScore}</Text>
                </View>
                <View style={styles.metaColumn}>
                  <Text style={styles.metaLabel}>最近活跃</Text>
                  <Text style={styles.metaValueSmall}>
                    {new Date(member.lastActive).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.activityBadge,
                  {
                    backgroundColor: statusPalette.background,
                    borderColor: statusPalette.border,
                  },
                ]}
              >
                <Text style={[styles.activityText, { color: statusPalette.text }]}>
                  {activity.label}
                </Text>
              </View>
            </LinearGradient>
          );
        })}
      </View>
    </ScreenContainer>
  );
};

const ROLE_LABEL: Record<'leader' | 'member' | 'support', string> = {
  leader: '队长',
  member: '队员',
  support: '支援',
};

const ROLE_ACCENT: Record<'leader' | 'member' | 'support', string> = {
  leader: '#FF6AD5',
  member: '#3FF2FF',
  support: '#FFC861',
};

type ActivityTone = 'online' | 'idle' | 'offline';

const ACTIVITY_PALETTE: Record<ActivityTone, { background: string; border: string; text: string }> =
  {
    online: {
      background: 'rgba(52, 211, 153, 0.18)',
      border: 'rgba(16, 185, 129, 0.4)',
      text: '#34D399',
    },
    idle: {
      background: 'rgba(250, 204, 21, 0.16)',
      border: 'rgba(234, 179, 8, 0.42)',
      text: '#FBBF24',
    },
    offline: {
      background: 'rgba(248, 113, 113, 0.16)',
      border: 'rgba(239, 68, 68, 0.35)',
      text: '#F87171',
    },
  };

const getActivityStatus = (lastActive: string): { label: string; tone: ActivityTone } => {
  const diffMinutes = (Date.now() - new Date(lastActive).getTime()) / 60000;
  if (diffMinutes <= 60) {
    return { label: '在线', tone: 'online' };
  }
  if (diffMinutes <= 360) {
    return { label: '近期活跃', tone: 'idle' };
  }
  return { label: '离线', tone: 'offline' };
};

const styles = StyleSheet.create({
  heading: {
    color: '#F6F8FF',
    fontSize: 24,
    fontWeight: '700',
  },
  subHeading: {
    color: '#8D92A3',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(86, 67, 178, 0.55)',
    backgroundColor: 'rgba(10, 13, 36, 0.86)',
  },
  summaryMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
  },
  summaryMetric: {
    flex: 1,
  },
  metricLabel: {
    color: '#9EA6CE',
    fontSize: 13,
    marginBottom: 6,
  },
  metricValue: {
    color: '#F8FAFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 16,
  },
  metricHint: {
    color: '#9EA6CE',
    fontSize: 12,
  },
  memberGrid: {
    gap: 16,
  },
  memberCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(54, 44, 118, 0.6)',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberName: {
    color: '#F6F8FF',
    fontSize: 18,
    fontWeight: '700',
  },
  roleBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  memberMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    color: '#8D92A3',
    fontSize: 12,
  },
  metaValue: {
    color: '#F8FAFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  metaValueSmall: {
    color: '#F8FAFF',
    fontSize: 12,
    marginTop: 6,
  },
  activityBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
