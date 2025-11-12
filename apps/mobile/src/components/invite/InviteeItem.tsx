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
  joined: '#00D7A6',
  expired: '#F36A6A',
};

export const InviteeItem = ({ data, onPress, onPressMenu }: InviteeItemProps) => (
  <Pressable
    style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    onPress={onPress}
  >
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{data.nickname.charAt(0).toUpperCase()}</Text>
    </View>
    <View style={styles.detail}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {data.nickname}
        </Text>
        <View style={[styles.statusPill, { borderColor: STATUS_COLORS[data.status] }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[data.status] }]}>
            {STATUS_LABEL[data.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.contrib} numberOfLines={1}>
        今日贡献 {data.contrib.today} · 累计 {data.contrib.total}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        邀请 {formatTime(data.invitedAt)} · 活跃 {formatTime(data.lastActiveAt)} · 来源{' '}
        {data.templateId ?? '--'}
      </Text>
    </View>
    <Pressable style={styles.menu} onPress={onPressMenu}>
      <Text style={styles.menuDot}>⋯</Text>
    </Pressable>
  </Pressable>
);

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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pressed: {
    opacity: 0.9,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  avatarText: {
    ...typography.subtitle,
    color: '#E6F1FF',
  },
  detail: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
    flex: 1,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusText: {
    ...typography.captionCaps,
  },
  contrib: {
    ...typography.caption,
    color: palette.sub,
  },
  meta: {
    ...typography.caption,
    color: 'rgba(230,241,255,0.6)',
  },
  menu: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  menuDot: {
    fontSize: 20,
    color: palette.sub,
  },
});

export default InviteeItem;
