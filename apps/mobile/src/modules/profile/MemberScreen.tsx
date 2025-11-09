import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import NeonButton from '@components/NeonButton';
import HomeBackground from '../../ui/HomeBackground';
import { useAccountSummary } from '@services/web3/hooks';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

export const MemberScreen = () => {
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);
  const { data } = useAccountSummary();
  const tierLabel = data?.membershipTier === 'vip' ? t('member.vip') : t('member.non');

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('member.title')}</Text>
      <NeonCard
        borderRadius={shape.cardRadius}
        overlayColor="rgba(10,12,26,0.72)"
        contentPadding={24}
        style={styles.card}
      >
        <Text style={styles.status}>{t('member.status', { status: tierLabel })}</Text>
        <Text style={styles.desc}>{t('member.perks')}</Text>
        <NeonButton
          title={t('member.cta')}
          onPress={() => Alert.alert(t('common.notice'), t('member.alert'))}
        />
      </NeonCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.section,
  },
  card: {
    minHeight: 200,
  },
  status: {
    ...typography.subtitle,
    color: palette.text,
  },
  desc: {
    ...typography.body,
    color: palette.sub,
    marginVertical: spacing.cardGap,
  },
});

export default MemberScreen;
