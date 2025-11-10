import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { InviteRecord } from '@mock/invites';
import RipplePressable from '@components/RipplePressable';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { translate as t } from '@locale/strings';

export type InviteSortOption = 'timeDesc' | 'status' | 'reward';

type InviteDetailSheetProps = {
  visible: boolean;
  mode: 'detail' | 'qr' | 'sort';
  record?: InviteRecord;
  onClose: () => void;
  selectedSort?: InviteSortOption;
  onSelectSort?: (value: InviteSortOption) => void;
};

const SORT_OPTIONS: Array<{ key: InviteSortOption; label: string }> = [
  { key: 'timeDesc', label: '时间 ↓' },
  { key: 'status', label: '状态' },
  { key: 'reward', label: '奖励' },
];

export const InviteDetailSheet = ({
  visible,
  mode,
  record,
  onClose,
  selectedSort,
  onSelectSort,
}: InviteDetailSheetProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [80, 0]) }],
    opacity: progress.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.6]),
  }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>
        <Animated.View style={[styles.sheet, containerStyle]}>
          {mode === 'detail' && record ? (
            <>
              <Text style={styles.sheetTitle}>{record.nickname}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>时间</Text>
                <Text style={styles.detailValue}>{formatDate(record.datetime)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>来源</Text>
                <Text style={styles.detailValue}>{SOURCE_LABEL[record.source]}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>状态</Text>
                <Text style={[styles.detailValue, { color: STATUS_COLOR[record.status] }]}>
                  {STATUS_LABEL[record.status]}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>奖励</Text>
                <Text style={styles.detailValue}>
                  {record.reward ?? t('invite.reward.none', '暂无奖励')}
                </Text>
              </View>
              <View style={styles.sheetButtons}>
                <RipplePressable style={[styles.sheetBtn, styles.sheetBtnDisabled]}>
                  <Text style={styles.sheetBtnText}>重新发送（占位）</Text>
                </RipplePressable>
                <RipplePressable style={[styles.sheetBtn, styles.sheetBtnDisabled]}>
                  <Text style={styles.sheetBtnText}>撤回（占位）</Text>
                </RipplePressable>
              </View>
            </>
          ) : null}

          {mode === 'qr' ? (
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>QR</Text>
              </View>
              <Text style={styles.qrDesc}>二维码占位，后续替换为真实分享码。</Text>
            </View>
          ) : null}

          {mode === 'sort' ? (
            <>
              <Text style={styles.sheetTitle}>{t('invite.sort', '排序')}</Text>
              {SORT_OPTIONS.map((option) => {
                const active = selectedSort === option.key;
                return (
                  <RipplePressable
                    key={option.key}
                    style={[styles.sortOption, active && styles.sortOptionActive]}
                    onPress={() => onSelectSort?.(option.key)}
                  >
                    <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>
                      {option.label}
                    </Text>
                  </RipplePressable>
                );
              })}
            </>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const formatDate = (value: string) => {
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const SOURCE_LABEL: Record<InviteRecord['source'], string> = {
  link: '复制链接',
  qrcode: '二维码',
  share: '转发分享',
};

const STATUS_LABEL: Record<InviteRecord['status'], string> = {
  pending: t('invite.tabs.pending', '待确认'),
  joined: t('invite.tabs.joined', '已加入'),
  expired: t('invite.tabs.expired', '已过期'),
};

const STATUS_COLOR: Record<InviteRecord['status'], string> = {
  pending: '#31C3FF',
  joined: '#00D7A6',
  expired: '#F36A6A',
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#01010f',
  },
  sheet: {
    backgroundColor: 'rgba(7,10,24,0.96)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sheetTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    ...typography.caption,
    color: palette.sub,
  },
  detailValue: {
    ...typography.captionCaps,
    color: palette.text,
  },
  sheetButtons: {
    marginTop: 24,
    gap: 12,
  },
  sheetBtn: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  sheetBtnDisabled: {
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  sheetBtnText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0,255,209,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  qrText: {
    ...typography.heading,
    color: palette.primary,
  },
  qrDesc: {
    ...typography.caption,
    color: palette.sub,
  },
  sortOption: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sortOptionActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,255,209,0.08)',
  },
  sortLabel: {
    ...typography.body,
    color: palette.text,
  },
  sortLabelActive: {
    color: palette.primary,
    fontWeight: '700',
  },
});

export default InviteDetailSheet;
