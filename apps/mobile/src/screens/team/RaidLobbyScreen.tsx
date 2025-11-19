import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import GridNodes from '@components/team/GridNodes';
import PrimaryCTA from '@components/shared/PrimaryCTA';
import raidStatus from '@mock/raid.status.json';
import { translate as t } from '@locale/strings';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

export const RaidLobbyScreen = () => {
  return (
    <ScreenContainer variant="plain">
      <Text style={styles.title}>{t('raid.title', '团队副本')}</Text>
      <Text style={styles.subtitle}>
        {t(
          'raid.progress',
          { cleared: raidStatus.cleared, total: raidStatus.total },
          '已清 {cleared}/{total}',
        )}
      </Text>
      <GridNodes
        rows={raidStatus.gridSize[0]}
        cols={raidStatus.gridSize[1]}
        cleared={raidStatus.cleared}
        total={raidStatus.total}
      />
      <PrimaryCTA label={t('raid.start', '开始挑战')} onPress={() => Alert.alert('副本', '占位')} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: palette.text,
  },
  subtitle: {
    ...typography.body,
    color: palette.sub,
    marginBottom: 20,
  },
});

export default RaidLobbyScreen;
