import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

export type InviteeStatus = 'pending' | 'joined' | 'expired';

export type Invitee = {
  id: string;
  nickname: string;
  status: InviteeStatus;
  invitedAt: string;
  lastActiveAt?: string;
  templateId?: string;
  contrib: {
    today: number;
    total: number;
  };
};

type InviteeItemProps = {
  data: Invitee;
  onPress?: () => void;
  onPressMenu?: () => void;
};

const STATUS_LABEL: Record<InviteeStatus, string> = {
  pending: '待确认',
  joined: '已加入',
  expired: '已过期',
};

const STATUS_COLORS: Record<InviteeStatus, string> = {
  pending: '#31C3FF',
  joined: '#05FAA0',
  expired: '#F36A6A',
};

export const InviteeItem = ({ data, onPress, onPressMenu }: InviteeItemProps) => {
  const statusColor = STATUS_COLORS[data.status];
  const statusLabel = STATUS_LABEL[data.status];

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.leftBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{data.nickname.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1}>
            {data.nickname}
          </Text>
          <Text style={styles.contrib} numberOfLines={1}>
            今日贡献 {data.contrib.today} · 累计 {data.contrib.total}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            邀请 {formatTime(data.invitedAt)} · 活跃 {formatTime(data.lastActiveAt)}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={[styles.statusPill, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        <Pressable style={styles.menu} onPress={onPressMenu}>
          <Text style={styles.menuDot}>⋯</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const formatTime = (value?: string) => {
  if (!value) {
    return '--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');
  const hh = `${date.getHours()}`.padStart(2, '0');
  const min = `${date.getMinutes()}`.padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(4,10,20,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.9,
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(51,245,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginRight: 12,
  },
  avatarText: {
    ...typography.subtitle,
    color: '#E6F1FF',
  },
  detail: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
  },
  contrib: {
    ...typography.caption,
    color: 'rgba(230,241,255,0.8)',
  },
  meta: {
    ...typography.caption,
    color: 'rgba(230,241,255,0.6)',
  },
  actions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(5, 10, 25, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...typography.captionCaps,
  },
  menu: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  menuDot: {
    fontSize: 16,
    color: palette.sub,
  },
});

export default InviteeItem;
