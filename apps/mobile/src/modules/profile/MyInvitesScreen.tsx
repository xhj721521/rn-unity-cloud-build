import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { useAppSelector } from '@state/hooks';
import { InviteRecord } from '@state/invites/inviteSlice';

export const MyInvitesScreen = () => {
  const records = useAppSelector((state) => state.invites.records);

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>\u6211\u7684\u9080\u8bf7</Text>
      <Text style={styles.subHeading}>
        \u67e5\u770b\u9080\u8bf7\u8bb0\u5f55\u3001\u5956\u52b1\u8fdb\u5ea6\u4e0e\u9080\u8bf7\u7801\u5206\u4eab\u3002
      </Text>

      <InfoCard title="\u9080\u8bf7\u8bb0\u5f55">
        {records.map((record) => (
          <View key={record.id} style={styles.inviteRow}>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteName}>{record.invitee}</Text>
              <Text style={styles.inviteMeta}>
                {new Date(record.sentAt).toLocaleString()} · {STATUS_LABEL[record.status]}
              </Text>
            </View>
            <Text style={styles.inviteReward}>{record.reward}</Text>
          </View>
        ))}
      </InfoCard>
    </ScreenContainer>
  );
};

const STATUS_LABEL: Record<InviteRecord['status'], string> = {
  pending: '待确认',
  accepted: '已接受',
  expired: '已过期',
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
  inviteReward: {
    color: '#7A5CFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
