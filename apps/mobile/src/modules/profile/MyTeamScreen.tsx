import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { useAppSelector } from '@state/hooks';

export const MyTeamScreen = () => {
  const members = useAppSelector((state) => state.team.members);

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>\u6211\u7684\u56e2\u961f</Text>
      <Text style={styles.subHeading}>
        \u7ba1\u7406\u6218\u961f\u6210\u5458\u3001\u6743\u9650\u4e0e\u534f\u4f5c\u7b56\u7565\u3002
      </Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.cellName]}>成员</Text>
        <Text style={[styles.cell, styles.cellRole]}>职责</Text>
        <Text style={[styles.cell, styles.cellPower]}>战力</Text>
        <Text style={[styles.cell, styles.cellActive]}>最近活跃</Text>
      </View>

      {members.map((member) => (
        <View key={member.id} style={styles.tableRow}>
          <Text style={[styles.cell, styles.cellName]}>{member.nickname}</Text>
          <Text style={[styles.cell, styles.cellRole]}>{ROLE_LABEL[member.role]}</Text>
          <Text style={[styles.cell, styles.cellPower]}>{member.powerScore}</Text>
          <Text style={[styles.cell, styles.cellActive]}>
            {new Date(member.lastActive).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
};

const ROLE_LABEL: Record<'leader' | 'member' | 'support', string> = {
  leader: '队长',
  member: '队员',
  support: '支援',
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
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#12122B',
    borderWidth: 1,
    borderColor: '#24244F',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A4F',
  },
  cell: {
    color: '#F6F8FF',
    fontSize: 13,
  },
  cellName: {
    flex: 1.2,
    fontWeight: '600',
  },
  cellRole: {
    flex: 0.8,
    color: '#8D92A3',
  },
  cellPower: {
    flex: 0.6,
    textAlign: 'right',
  },
  cellActive: {
    flex: 1.4,
    textAlign: 'right',
    color: '#8D92A3',
  },
});
