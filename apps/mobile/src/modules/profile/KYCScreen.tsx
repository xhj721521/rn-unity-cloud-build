import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import NeonButton from '@components/NeonButton';
import HomeBackground from '../../ui/HomeBackground';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

export const KYCScreen = () => {
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('kyc.title')}</Text>
      <NeonCard
        borderRadius={shape.cardRadius}
        overlayColor="rgba(8,10,24,0.7)"
        contentPadding={22}
        style={styles.card}
      >
        <Text style={styles.desc}>{t('kyc.desc')}</Text>
        <NeonButton
          title={t('kyc.cta')}
          onPress={() => Alert.alert(t('kyc.alert.title'), t('kyc.alert'))}
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
    minHeight: 160,
  },
  desc: {
    ...typography.body,
    color: palette.sub,
    marginBottom: spacing.cardGap,
  },
});

export default KYCScreen;
