import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NeonButton from '@components/NeonButton';
import RipplePressable from '@components/RipplePressable';
import { NeonPanel } from '@components/common/NeonPanel';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/tokens';
import { translate as t } from '@locale/strings';

type InviteSummaryCardProps = {
  total: number;
  weekly: number;
  pending: number;
  inviteCode: string;
  onCopy: () => void;
  onShowQr: () => void;
  onGenerateLink: () => void;
  onExport: () => void;
};

const STAT_ITEMS = [
  { key: 'total', label: () => t('invite.total', '累计邀请'), formatter: (value: number) => value },
  { key: 'weekly', label: () => t('invite.week', '本周邀请'), formatter: (value: number) => value },
  {
    key: 'pending',
    label: () => t('invite.pending', '待确认'),
    formatter: (value: number) => value,
  },
];

export const InviteSummaryCard = ({
  total,
  weekly,
  pending,
  inviteCode,
  onCopy,
  onShowQr,
  onGenerateLink,
  onExport,
}: InviteSummaryCardProps) => {
  const stats: Record<'total' | 'weekly' | 'pending', number> = { total, weekly, pending };
  return (
    <NeonPanel style={styles.panel}>
      <Text style={styles.title}>{t('invite.title', '我的邀请')}</Text>
      <Text style={styles.subtitle}>
        {t('invite.subtitle', '邀请好友加入联机，获取额外掉率与奖励。')}
      </Text>

      <View style={styles.statsRow}>
        {STAT_ITEMS.map((item) => (
          <View key={item.key} style={styles.statChip}>
            <Text style={styles.statLabel}>{item.label()}</Text>
            <Text style={styles.statValue}>
              {item.formatter(stats[item.key as keyof typeof stats])}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.codeRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>{t('invite.code', '邀请码')}</Text>
          <Text style={styles.codeValue}>{inviteCode}</Text>
        </View>
        <RipplePressable style={styles.codeAction} onPress={onCopy}>
          <Text style={styles.codeActionText}>{t('invite.copy', '复制')}</Text>
        </RipplePressable>
        <RipplePressable style={[styles.codeAction, styles.codeActionGhost]} onPress={onShowQr}>
          <Text style={styles.codeActionText}>{t('invite.qrcode', '二维码')}</Text>
        </RipplePressable>
      </View>

      <View style={styles.buttonRow}>
        <NeonButton title={t('invite.createLink', '生成邀请链接')} onPress={onGenerateLink} />
        <RipplePressable style={styles.secondaryBtn} onPress={onExport}>
          <Text style={styles.secondaryText}>{t('invite.exportReport', '导出战报')}</Text>
        </RipplePressable>
      </View>
    </NeonPanel>
  );
};

const styles = StyleSheet.create({
  panel: {
    marginBottom: spacing.section,
  },
  title: {
    ...typography.heading,
    color: palette.text,
  },
  subtitle: {
    ...typography.body,
    color: palette.sub,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  statChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(9,14,32,0.72)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statLabel: {
    ...typography.caption,
    color: palette.sub,
  },
  statValue: {
    ...typography.numeric,
    marginTop: 4,
    color: palette.text,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  codeBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(7,10,23,0.75)',
  },
  codeLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  codeValue: {
    ...typography.numeric,
    marginTop: 2,
    letterSpacing: 4,
    color: palette.primary,
  },
  codeAction: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,255,209,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 66,
    alignItems: 'center',
  },
  codeActionGhost: {
    borderColor: 'rgba(125,177,255,0.5)',
  },
  codeActionText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  buttonRow: {
    marginTop: 18,
    gap: 12,
  },
  secondaryBtn: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(126,136,169,0.55)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
});

export default InviteSummaryCard;
