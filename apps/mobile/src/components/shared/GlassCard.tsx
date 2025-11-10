import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import NeonCard from '@components/NeonCard';
import { teamTokens } from '@theme/tokens.team';

type GlassCardProps = PropsWithChildren<{
  style?: ViewStyle;
  locked?: boolean;
  lockText?: string;
  testID?: string;
  padding?: number;
}>;

const hexPattern = require('../../assets/patterns/hex_runes.png');

export const GlassCard = ({
  children,
  style,
  locked,
  lockText,
  testID,
  padding = 16,
}: GlassCardProps) => {
  return (
    <NeonCard
      testID={testID}
      style={[styles.card, style]}
      borderColors={teamTokens.colors.border}
      contentPadding={padding}
      overlayColor={teamTokens.colors.backgroundOverlay}
      backgroundSource={hexPattern}
      backgroundStyle={styles.pattern}
    >
      {children}
      {locked ? (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockText}>{lockText ?? 'Locked'}</Text>
        </View>
      ) : null}
    </NeonCard>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  pattern: {
    opacity: 0.2,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: teamTokens.colors.lockOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    color: teamTokens.colors.textMain,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default GlassCard;
