import React from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QuickGlyph from '@components/QuickGlyph';
import ProgressEnergyBar from '@components/shared/ProgressEnergyBar';
import { tokens } from '@theme/tokens';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  emblem?: ImageSourcePropType;
  name: string;
  level: number;
  exp?: number;
  next?: number;
  membersOnline?: number;
  memberCap?: number;
  onPressLanguage?: () => void;
};

export const TeamStickyHeader = ({
  emblem,
  name,
  level,
  exp,
  next,
  membersOnline,
  memberCap,
  onPressLanguage,
}: Props) => {
  const safeNext = next && next > 0 ? next : 800;
  const safeExp = exp ?? Math.floor(safeNext * 0.45);
  const progress = Math.min(safeExp / safeNext, 1);
  const remaining = Math.max(safeNext - safeExp, 0);

  return (
    <LinearGradient colors={['rgba(4,12,24,0.9)', 'rgba(6,18,32,0.96)']} style={styles.container}>
      <View style={styles.avatarShell}>
        {emblem ? (
          <LinearGradient colors={['#20E0E8', '#E8C26A']} style={styles.emblemOuter}>
            <LinearGradient
              colors={['rgba(11,17,22,0.85)', 'rgba(3,5,12,0.95)']}
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
            离上一级还差 {remaining} / {safeNext}
          </Text>
        </View>
        <ProgressEnergyBar progress={progress} variant="thin" />
        <Text style={styles.countText}>
          队员 {membersOnline ?? 0} / {memberCap ?? '--'}
        </Text>
      </View>
      {onPressLanguage ? (
        <Pressable style={styles.languageBubble} onPress={onPressLanguage}>
          <QuickGlyph id="chat" size={16} />
          <Text style={styles.languageText}>团队语言</Text>
        </Pressable>
      ) : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.page,
    paddingVertical: 14,
    backgroundColor: 'transparent',
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
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
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
  countText: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.72)',
  },
  languageBubble: {
    position: 'absolute',
    right: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.35)',
    backgroundColor: 'rgba(5,12,20,0.9)',
  },
  languageText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default TeamStickyHeader;
