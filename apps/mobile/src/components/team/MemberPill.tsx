import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Member } from '@mock/team.members';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  member: Member;
  metricMode: 'today' | 'total';
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

const ROLE_BADGE: Record<Member['role'], string> = {
  leader: '#FF6B6B',
  officer: '#22E3FF',
  member: 'rgba(255,255,255,0.4)',
};

export const MemberPill = ({ member, metricMode, selected, onPress, onLongPress }: Props) => {
  const metricValue =
    metricMode === 'today' ? member.intelToday ?? 0 : member.intelTotal ?? member.intelToday ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 },
        selected && styles.selected,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.avatarShell}>
        {member.avatar ? (
          <Image source={member.avatar} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>{member.name.slice(0, 1).toUpperCase()}</Text>
        )}
        <View style={[styles.presenceDot, member.online ? styles.onlineDot : styles.offlineDot]} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={styles.metric}>
          {metricMode === 'today' ? '今日情报' : '累计情报'} · {metricValue}
        </Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: ROLE_BADGE[member.role] }]} />
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
  selected: {
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
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
  presenceDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#05080F',
  },
  onlineDot: {
    backgroundColor: '#21D07A',
  },
  offlineDot: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
  },
  metric: {
    ...typography.caption,
    color: palette.sub,
  },
  roleBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default MemberPill;
