import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Member } from '@mock/team.members';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  member: Member;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
};

const ROLE_LABEL: Record<Member['role'], string> = {
  leader: '队长',
  officer: '副官',
  member: '成员',
};

export const MemberPill = ({ member, style, onPress, onLongPress }: Props) => {
  const metricValue = member.intelToday ?? member.contribWeek ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.92 }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.avatarShell}>
        {member.avatar ? (
          <Image source={member.avatar} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {member.name}
      </Text>
      <View style={styles.roleTag}>
        <Text style={styles.roleText}>{ROLE_LABEL[member.role]}</Text>
      </View>
      <Text style={styles.metric}>今日情报 · {metricValue}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 88,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  avatarShell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  name: {
    ...typography.captionCaps,
    color: palette.text,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleText: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.8)',
  },
  metric: {
    ...typography.caption,
    color: palette.sub,
  },
});

export default MemberPill;
