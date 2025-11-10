import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { teamTokens } from '@theme/tokens.team';
import GlassCard from '@components/shared/GlassCard';
import ProgressEnergyBar from '@components/shared/ProgressEnergyBar';
import BadgeChip from '@components/shared/BadgeChip';
import { translate as t } from '@locale/strings';

export type MemberRole = 'leader' | 'officer' | 'member';

export type MemberEntity = {
  id: string;
  name: string;
  role: MemberRole;
  online: boolean;
  lastSeen: string;
  contribWeek: number;
};

type MemberCardProps = {
  member: MemberEntity;
  onPress?: (member: MemberEntity) => void;
};

const ROLE_TEXT: Record<MemberRole, string> = {
  leader: '队长',
  officer: '副官',
  member: '成员',
};

export const MemberCard = ({ member, onPress }: MemberCardProps) => {
  const initials = member.name.slice(0, 1).toUpperCase();
  return (
    <Pressable
      style={({ pressed }) => [pressed ? { opacity: 0.9 } : null]}
      onPress={() => onPress?.(member)}
      testID={`memberCard-${member.id}`}
    >
      <GlassCard padding={12}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
            <View
              style={[
                styles.presenceDot,
                {
                  backgroundColor: member.online
                    ? teamTokens.colors.online
                    : teamTokens.colors.offline,
                },
              ]}
            />
          </View>
          <View style={styles.meta}>
            <Text style={styles.name} numberOfLines={1}>
              {member.name}
            </Text>
            <Text style={styles.lastSeen}>
              {t('member.lastSeen', '上次在线 {time}', { time: member.lastSeen })}
            </Text>
          </View>
          <BadgeChip
            label={ROLE_TEXT[member.role]}
            tone={
              member.role === 'leader'
                ? 'danger'
                : member.role === 'officer'
                ? 'default'
                : 'offline'
            }
          />
        </View>
        <View style={styles.progressBlock}>
          <ProgressEnergyBar progress={Math.min(member.contribWeek / 500, 1)} />
          <Text style={styles.contrib}>贡献：{member.contribWeek}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: teamTokens.layout.avatarSize,
    height: teamTokens.layout.avatarSize,
    borderRadius: teamTokens.layout.avatarSize / 2,
    backgroundColor: 'rgba(18, 28, 52, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#F4F6FF',
    fontSize: 20,
    fontWeight: '700',
  },
  presenceDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#05060C',
  },
  meta: {
    flex: 1,
  },
  name: {
    color: '#F6F8FF',
    fontWeight: '700',
  },
  lastSeen: {
    color: '#94A0C0',
    fontSize: 12,
    marginTop: 2,
  },
  progressBlock: {
    marginTop: 12,
    gap: 4,
  },
  contrib: {
    color: '#CED6FB',
    fontSize: 12,
  },
});

export default MemberCard;
