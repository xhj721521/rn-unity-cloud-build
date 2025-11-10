import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import RipplePressable from '@components/RipplePressable';
import { NeonPanel } from '@components/common/NeonPanel';
import { InviteRecord } from '@mock/invites';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { translate as t } from '@locale/strings';

const STATUS_STYLE: Record<
  InviteRecord['status'],
  { bg: string; text: string; border: string; label: string }
> = {
  pending: {
    bg: 'rgba(49,195,255,0.15)',
    text: '#31C3FF',
    border: 'rgba(49,195,255,0.4)',
    label: t('invite.tabs.pending', '待确认'),
  },
  joined: {
    bg: 'rgba(0,215,166,0.18)',
    text: '#00D7A6',
    border: 'rgba(0,215,166,0.45)',
    label: t('invite.tabs.joined', '已加入'),
  },
  expired: {
    bg: 'rgba(243,106,106,0.16)',
    text: '#F36A6A',
    border: 'rgba(243,106,106,0.42)',
    label: t('invite.tabs.expired', '已过期'),
  },
};

const AVATAR_COLORS = ['#00F5D4', '#7B61FF', '#6EE7B7', '#F472B6', '#60A5FA', '#FACC15'];

const SOURCE_LABEL: Record<InviteRecord['source'], string> = {
  link: '复制链接',
  qrcode: '二维码',
  share: '转发分享',
};

const formatDate = (value: string) => {
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

type InviteRecordItemProps = {
  record: InviteRecord;
  onPress: (record: InviteRecord) => void;
};

export const InviteRecordItem = ({ record, onPress }: InviteRecordItemProps) => {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0);

  const avatarColor = useMemo(() => {
    const idx = Math.abs(record.nickname.charCodeAt(0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  }, [record.nickname]);

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 120 });
    shadow.value = withTiming(1, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
    shadow.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.2 + shadow.value * 0.4,
  }));

  const statusStyle = STATUS_STYLE[record.status];

  return (
    <RipplePressable
      style={styles.pressable}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(record)}
    >
      <Animated.View style={[animatedStyle]}>
        <NeonPanel padding={16} borderRadius={20}>
          <View style={styles.row}>
            <View style={styles.avatar} accessible accessibilityLabel="invite-avatar">
              <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarText}>{record.nickname.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.nickname} numberOfLines={1}>
                  {record.nickname}
                </Text>
                <Text style={styles.meta}>
                  {formatDate(record.datetime)} · {SOURCE_LABEL[record.source]}
                </Text>
              </View>
            </View>

            <View style={styles.statusColumn}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
                ]}
              >
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {statusStyle.label}
                </Text>
              </View>
              {record.reward ? (
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardText}>{record.reward}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </NeonPanel>
      </Animated.View>
    </RipplePressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  avatar: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.subtitle,
    color: '#04010F',
  },
  avatarInfo: {
    flex: 1,
  },
  nickname: {
    ...typography.subtitle,
    color: palette.text,
  },
  meta: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
  statusColumn: {
    alignItems: 'flex-end',
    gap: 10,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusText: {
    ...typography.captionCaps,
  },
  rewardBadge: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  rewardText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default InviteRecordItem;
