import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { useAppSelector } from '@state/hooks';
import { InviteRecord } from '@state/invites/inviteSlice';

export const MyInvitesScreen = () => {
  const records = useAppSelector((state) => state.invites.records);
  const handleShare = () => {
    Alert.alert('功能建设中', '专属邀请链接生成正在集成，敬请期待。');
  };
  const handleDownload = () => {
    Alert.alert('功能建设中', '战报导出将在后续版本提供。');
  };

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>我的邀请</Text>
      <Text style={styles.subHeading}>查看邀请记录、奖励进度与邀请码分享。</Text>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionChip, styles.actionChipPrimary]} onPress={handleShare}>
          <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>生成邀请链接</Text>
        </Pressable>
        <Pressable style={styles.actionChip} onPress={handleDownload}>
          <Text style={styles.actionLabel}>导出战报</Text>
        </Pressable>
      </View>

      <InfoCard title="邀请记录">
        {records.map((record) => (
          <View key={record.id} style={styles.inviteRow}>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteName}>{record.invitee}</Text>
              <Text style={styles.inviteMeta}>{new Date(record.sentAt).toLocaleString()}</Text>
            </View>
            <View style={styles.inviteMetaSide}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: STATUS_PALETTE[record.status].background,
                    borderColor: STATUS_PALETTE[record.status].border,
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: STATUS_PALETTE[record.status].text }]}>
                  {STATUS_LABEL[record.status]}
                </Text>
              </View>
              <Text style={styles.inviteReward}>{record.reward}</Text>
            </View>
          </View>
        ))}
      </InfoCard>
    </ScreenContainer>
  );
};

const STATUS_LABEL: Record<InviteRecord['status'], string> = {
  pending: '待确认',
  accepted: '已加入',
  expired: '已过期',
};

const STATUS_PALETTE: Record<
  InviteRecord['status'],
  { background: string; border: string; text: string }
> = {
  pending: {
    background: 'rgba(96, 165, 250, 0.14)',
    border: 'rgba(96, 165, 250, 0.36)',
    text: '#60A5FA',
  },
  accepted: {
    background: 'rgba(52, 211, 153, 0.16)',
    border: 'rgba(16, 185, 129, 0.42)',
    text: '#34D399',
  },
  expired: {
    background: 'rgba(248, 113, 113, 0.16)',
    border: 'rgba(239, 68, 68, 0.35)',
    text: '#F87171',
  },
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionChip: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
  },
  actionChipPrimary: {
    backgroundColor: 'rgba(124, 92, 255, 0.28)',
    borderColor: 'rgba(167, 139, 250, 0.6)',
  },
  actionLabel: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  actionLabelPrimary: {
    color: '#F8FAFF',
  },
  inviteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A4F',
  },
  inviteInfo: {
    flex: 1,
    marginRight: 12,
  },
  inviteName: {
    color: '#F6F8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  inviteMeta: {
    color: '#8D92A3',
    fontSize: 12,
    marginTop: 4,
  },
  inviteMetaSide: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inviteReward: {
    color: '#7A5CFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
