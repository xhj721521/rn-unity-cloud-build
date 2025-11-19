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

const ROLE_COLORS: Record<Member['role'], string> = {
  leader: '#8A5CFF',
  officer: '#00E5FF',
  member: 'rgba(255,255,255,0.4)',
};

export const MemberPill = ({ member, style, onPress, onLongPress }: Props) => {
  const intel = member.intelToday ?? member.contribWeek ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.row, style, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.avatar}>
        {member.avatar ? (
          <Image
            source={typeof member.avatar === 'string' ? { uri: member.avatar } : member.avatar}
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {member.name}
      </Text>
      <View style={[styles.rolePill, { borderColor: ROLE_COLORS[member.role] }]}>
        <Text style={[styles.roleText, { color: ROLE_COLORS[member.role] }]}>
          {ROLE_LABEL[member.role]}
        </Text>
      </View>
      <View style={styles.infoChip}>
        <Text style={styles.infoText}>情报 {intel}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: 'rgba(4,10,18,0.9)',
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
    flexShrink: 1,
  },
  rolePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  roleText: {
    ...typography.captionCaps,
  },
  infoChip: {
    marginLeft: 'auto',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,229,255,0.08)',
  },
  infoText: {
    ...typography.captionCaps,
    color: '#00E5FF',
  },
});

export default MemberPill;
