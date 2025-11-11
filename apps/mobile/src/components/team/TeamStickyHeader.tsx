import React from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { tokens } from '@theme/tokens';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import ProgressEnergyBar from '@components/shared/ProgressEnergyBar';

type Props = {
  emblem?: ImageSourcePropType;
  name: string;
  level: number;
  exp: number;
  next: number;
};

export const TeamStickyHeader = ({ emblem, name, level, exp, next }: Props) => {
  const progress = Math.min(exp / next, 1);
  return (
    <LinearGradient
      colors={['rgba(0,229,255,0.12)', 'rgba(232,194,106,0.12)']}
      style={styles.container}
    >
      <View style={styles.avatarShell}>
        {emblem ? (
          <LinearGradient colors={['#20E0E8', '#E8C26A']} style={styles.emblemOuter}>
            <LinearGradient
              colors={['rgba(11,17,22,0.8)', 'rgba(3,5,12,0.9)']}
              style={styles.emblemInner}
            />
          </LinearGradient>
        ) : (
          <View style={styles.emblemPlaceholder}>
            <Text style={styles.emblemText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelLabel}>Lv.{level}</Text>
          <Text style={styles.levelHint}>
            离上一级还差 {Math.max(next - exp, 0)} / {next}
          </Text>
        </View>
        <ProgressEnergyBar progress={progress} variant="thin" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.page,
    paddingVertical: 12,
    backgroundColor: '#0D141C',
  },
  avatarShell: {
    marginRight: 12,
  },
  emblemOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  emblemPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  emblemText: {
    ...typography.subtitle,
    color: '#E8C26A',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    ...typography.subtitle,
    color: palette.text,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  levelLabel: {
    ...typography.captionCaps,
    color: '#20E0E8',
  },
  levelHint: {
    ...typography.caption,
    color: palette.sub,
  },
});

export default TeamStickyHeader;
