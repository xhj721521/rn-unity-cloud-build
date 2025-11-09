import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import QuickGlyph from '@components/QuickGlyph';
import HomeBackground from '../../ui/HomeBackground';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

const tileC = require('../../assets/profile/ph_tile_c.png');
const tileD = require('../../assets/profile/ph_tile_d.png');
const tileE = require('../../assets/profile/ph_tile_e.png');

const highlights = [
  {
    id: 'h1',
    titleKey: 'my.highlights.mock1',
    tagKey: 'my.highlights.tag.collect',
    level: 'Lv.3',
    image: tileC,
  },
  {
    id: 'h2',
    titleKey: 'my.highlights.mock2',
    tagKey: 'my.highlights.tag.report',
    level: 'Lv.2',
    image: tileD,
  },
  {
    id: 'h3',
    titleKey: 'my.highlights.mock3',
    tagKey: 'my.highlights.tag.reward',
    level: 'Rare',
    image: tileE,
  },
];

export const HighlightsScreen = () => {
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('highlights.title')}</Text>
      <Text style={styles.subtitle}>{t('highlights.desc')}</Text>
      {highlights.map((item) => (
        <NeonCard
          key={item.id}
          borderRadius={shape.cardRadius}
          overlayColor="rgba(7,9,20,0.6)"
          backgroundSource={item.image}
          contentPadding={18}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <QuickGlyph id="highlights" size={22} />
            <Text style={styles.level}>{item.level}</Text>
          </View>
          <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
          <Text style={styles.cardTag}>{t(item.tagKey)}</Text>
        </NeonCard>
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
  card: {
    marginBottom: spacing.cardGap,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  level: {
    ...typography.captionCaps,
    color: palette.text,
  },
  cardTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  cardTag: {
    ...typography.captionCaps,
    color: palette.primary,
    marginTop: 10,
  },
});

export default HighlightsScreen;
