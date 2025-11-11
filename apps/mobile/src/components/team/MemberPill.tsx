import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Member } from '@mock/team.members';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  member: Member;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
};

export const MemberPill = ({ member, onPress, onLongPress, style }: Props) => {
  const roleLabel = member.role === 'leader' ? '队长' : member.role === 'officer' ? '副官' : '成员';
  const metricValue = member.intelToday ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.9 }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.avatarShell}>
        {member.avatar ? (
          <Image source={member.avatar} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>{member.name.slice(0, 1).toUpperCase()}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={styles.role}>{roleLabel}</Text>
        <Text style={styles.metric}>今日情报 · {metricValue}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.25)',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  avatarShell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  avatarText: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
  },
  role: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.6)',
  },
  metric: {
    ...typography.caption,
    color: palette.sub,
  },
});

export default MemberPill;
