import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlassCard from '@components/shared/GlassCard';
import BadgeChip from '@components/shared/BadgeChip';
import OutlineCTA from '@components/shared/OutlineCTA';
import { translate as t } from '@locale/strings';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  opened: number;
  quota: number;
  ticket: string;
  canOpen?: boolean;
  onOpen?: () => void;
};

export const MapHalfCard = ({ opened, quota, ticket, canOpen, onOpen }: Props) => {
  return (
    <GlassCard testID="mapHalfCard">
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{t('maps.title', '团队地图')}</Text>
          <Text style={styles.subtitle}>
            {t('maps.opened', { n: opened, m: quota }, '今日已开 {n} / 可开 {m}')}
          </Text>
        </View>
        <BadgeChip label={ticket} />
      </View>
      {canOpen && <OutlineCTA label="开图（占位）" onPress={onOpen} style={styles.cta} />}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
  cta: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});

export default MapHalfCard;
