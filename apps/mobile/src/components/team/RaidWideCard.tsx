import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlassCard from '@components/shared/GlassCard';
import ProgressEnergyBar from '@components/shared/ProgressEnergyBar';
import PrimaryCTA from '@components/shared/PrimaryCTA';
import { translate as t } from '@locale/strings';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  name: string;
  difficulty: string;
  cleared: number;
  total: number;
  endsIn: string;
  attemptsLeft: number;
  onEnter?: () => void;
};

export const RaidWideCard = ({
  name,
  difficulty,
  cleared,
  total,
  endsIn,
  attemptsLeft,
  onEnter,
}: Props) => {
  const disabled = attemptsLeft <= 0;
  return (
    <GlassCard testID="raidWideCard">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {t('raid.progress', '已清 {cleared}/{total}', { cleared, total })} · {difficulty}
          </Text>
        </View>
        <Text style={styles.timer}>{endsIn}</Text>
      </View>
      <ProgressEnergyBar progress={cleared / total} variant="thick" />
      <View style={styles.footer}>
        <Text style={styles.attempts}>
          {attemptsLeft > 0 ? `剩余次数 ${attemptsLeft}` : t('raid.reset', '明日 00:00 重置')}
        </Text>
        <PrimaryCTA label={t('raid.enter', '进入副本')} onPress={onEnter} disabled={disabled} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
  },
  timer: {
    ...typography.captionCaps,
    color: '#E8C26A',
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attempts: {
    color: palette.sub,
  },
});

export default RaidWideCard;
