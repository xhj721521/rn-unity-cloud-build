import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph from '@components/QuickGlyph';
import HomeBackground from '../../ui/HomeBackground';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

const mockReports = [
  { id: 'r1', title: '盲盒掉率加成 · 11.09', reward: '+120 ARC' },
  { id: 'r2', title: '深空试炼 · Beta', reward: '+80 ARC' },
  { id: 'r3', title: '探索者集结 · B13', reward: '+2 NFT' },
];

export const ReportsScreen = () => {
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('reports.title')}</Text>
      <Text style={styles.subtitle}>{t('reports.desc')}</Text>
      {mockReports.map((report) => (
        <RipplePressable
          key={report.id}
          style={styles.cardPressable}
          onPress={() => Alert.alert(report.title, t('reports.alert'))}
        >
          <NeonCard
            borderRadius={shape.cardRadius}
            overlayColor="rgba(8,10,22,0.75)"
            contentPadding={18}
          >
            <View style={styles.row}>
              <QuickGlyph id="reports" size={24} />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{report.title}</Text>
                <Text style={styles.cardReward}>{report.reward}</Text>
              </View>
            </View>
          </NeonCard>
        </RipplePressable>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
  },
  subtitle: {
    ...typography.body,
    color: palette.sub,
    marginTop: 6,
    marginBottom: spacing.section,
  },
  cardPressable: {
    marginBottom: spacing.cardGap,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  cardReward: {
    ...typography.captionCaps,
    color: palette.primary,
    marginTop: 4,
  },
});

export default ReportsScreen;
