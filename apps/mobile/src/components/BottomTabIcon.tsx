import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { shape, spacing } from '@theme/tokens';
import { neonPalette } from '@theme/neonPalette';

export type BottomTabGlyph = 'home' | 'trials' | 'explore' | 'onchain' | 'profile';

type BottomTabIconProps = {
  label: string;
  type: BottomTabGlyph;
  focused: boolean;
};

export const BottomTabIcon = ({ label, type, focused }: BottomTabIconProps) => {
  return (
    <View style={[styles.container, focused ? styles.containerFocused : styles.containerInactive]}>
      <View style={[styles.glyphWrap, focused && styles.glyphWrapFocused]}>
        {renderGlyph(type, focused ? '#FF75FF' : '#6A6E92')}
      </View>
      <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </View>
  );
};

const renderGlyph = (type: BottomTabGlyph, tint: string) => {
  switch (type) {
    case 'home':
      return (
        <View style={styles.homeGlyph}>
          <View style={[styles.homeRoof, { borderColor: tint }]} />
          <View style={[styles.homeBody, { borderColor: tint }]} />
        </View>
      );
    case 'trials':
      return (
        <View style={[styles.shield, { borderColor: tint }]}>
          <View style={[styles.sword, { backgroundColor: tint }]} />
        </View>
      );
    case 'explore':
      return (
        <View style={[styles.compass, { borderColor: tint }]}>
          <View style={[styles.compassNeedle, { backgroundColor: tint }]} />
        </View>
      );
    case 'onchain':
      return (
        <View style={styles.chainRow}>
          <View style={[styles.chainLink, { borderColor: tint }]} />
          <View style={[styles.chainLink, styles.chainLinkOffset, { borderColor: tint }]} />
        </View>
      );
    case 'profile':
    default:
      return (
        <View style={styles.profileGlyph}>
          <View style={[styles.profileHead, { borderColor: tint }]} />
          <View style={[styles.profileBody, { borderColor: tint }]} />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 0 }],
    gap: spacing.grid / 2,
    minWidth: 60,
    paddingVertical: spacing.grid / 2,
  },
  containerFocused: {
    transform: [{ translateY: -2 }],
    opacity: 1,
  },
  containerInactive: {
    opacity: 0.64,
  },
  glyphWrap: {
    width: 36,
    height: 28,
    borderRadius: shape.buttonRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(90, 98, 140, 0.32)',
    backgroundColor: 'rgba(12, 14, 30, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphWrapFocused: {
    borderColor: 'rgba(255, 117, 255, 0.55)',
    backgroundColor: 'rgba(30, 20, 52, 0.96)',
    shadowColor: '#FF75FF',
    shadowOpacity: 0.28,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: neonPalette.textPrimary,
  },
  labelInactive: {
    color: neonPalette.textMuted,
    opacity: 0.72,
  },
  homeGlyph: {
    alignItems: 'center',
  },
  homeRoof: {
    width: 18,
    height: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 2,
  },
  homeBody: {
    marginTop: 2,
    width: 18,
    height: 9,
    borderWidth: 2,
    borderRadius: 2,
  },
  shield: {
    width: 20,
    height: 22,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sword: {
    width: 3,
    height: 12,
    borderRadius: 2,
  },
  compass: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassNeedle: {
    width: 3,
    height: 12,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
  },
  chainLink: {
    width: 16,
    height: 10,
    borderWidth: 2,
    borderRadius: 6,
  },
  chainLinkOffset: {
    marginLeft: -6,
  },
  profileGlyph: {
    alignItems: 'center',
    gap: 3,
  },
  profileHead: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 6,
  },
  profileBody: {
    width: 18,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
});
