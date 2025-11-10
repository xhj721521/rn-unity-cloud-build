import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GlassCard from '@components/shared/GlassCard';
import ProgressEnergyBar from '@components/shared/ProgressEnergyBar';
import { translate as t } from '@locale/strings';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  arc: number;
  stones: number;
  oValues: number[];
  onDonate?: (amount: number) => void;
  onDonateNow?: () => void;
};

const QUICK_AMOUNTS = [10, 50, 100];

export const VaultDonateHalfCard = ({ arc, stones, oValues, onDonate, onDonateNow }: Props) => {
  const total = oValues.reduce((sum, v) => sum + v, 0);
  const progress = Math.min(total / 500, 1);
  return (
    <GlassCard testID="vaultDonateHalfCard">
      <Text style={styles.title}>{t('vault.title', '资产与捐献')}</Text>
      <Text style={styles.subtitle}>
        ARC {arc} · 矿石 {stones}
      </Text>
      <ProgressEnergyBar progress={progress} variant="thick" />
      <View style={styles.quickRow}>
        {QUICK_AMOUNTS.map((amt) => (
          <Pressable
            key={amt}
            onPress={() => onDonate?.(amt)}
            style={({ pressed }) => [styles.quickBtn, pressed ? { opacity: 0.8 } : null]}
          >
            <Text style={styles.quickLabel}>+{amt}</Text>
          </Pressable>
        ))}
        <Pressable onPress={onDonateNow} style={styles.primary}>
          <Text style={styles.primaryLabel}>{t('donate.now', '立即捐献')}</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickBtn: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickLabel: {
    color: palette.text,
    fontWeight: '700',
  },
  primary: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8C26A',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  primaryLabel: {
    color: '#E8C26A',
    fontWeight: '700',
  },
});

export default VaultDonateHalfCard;
