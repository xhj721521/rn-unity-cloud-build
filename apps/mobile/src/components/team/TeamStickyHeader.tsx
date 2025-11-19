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
  onPressChat?: () => void;
};

export const TeamStickyHeader = ({
  emblem,
  name,
  level,
  exp,
  next,
  membersOnline,
  memberCap,
  onPressChat,
}: Props) => {
  const safeNext = next && next > 0 ? next : 800;
  const safeExp = exp ?? Math.floor(safeNext * 0.45);
  const progress = Math.min(safeExp / safeNext, 1);
  const remaining = Math.max(safeNext - safeExp, 0);

  return (
    <LinearGradient colors={['rgba(4,12,24,0.92)', 'rgba(6,18,32,0.94)']} style={styles.container}>
      <View style={styles.avatarShell}>
        {emblem ? (
          <LinearGradient colors={['#20E0E8', '#E8C26A']} style={styles.emblemOuter}>
            <LinearGradient
              colors={['rgba(11,17,22,0.9)', 'rgba(3,5,12,0.95)']}
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
        <View style={styles.progressRow}>
          <View style={styles.progressFlex}>
            <ProgressEnergyBar progress={progress} variant="thin" />
          </View>
          <Text style={styles.progressHint}>
            当前进度 {safeExp}/{safeNext}
          </Text>
        </View>
        <Text style={styles.countText}>
          队员 {membersOnline ?? 0} / {memberCap ?? '--'}
        </Text>
      </View>
      {onPressChat ? (
        <Pressable style={styles.chatBubble} onPress={onPressChat}>
          <QuickGlyph id="team" size={16} />
          <Text style={styles.chatText}>团队聊天</Text>
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
    height: 104,
    borderRadius: 20,
  },
  avatarShell: {
    marginRight: 12,
  },
  emblemOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emblemPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressFlex: {
    flex: 1,
  },
  progressHint: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.7)',
  },
  countText: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.75)',
  },
  chatBubble: {
    position: 'absolute',
    right: 16,
    top: 12,
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
  chatText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default TeamStickyHeader;
