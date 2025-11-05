import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { shape, spacing } from '@theme/tokens';
import { neonPalette } from '@theme/neonPalette';
import QuickGlyph, { QuickGlyphId } from './QuickGlyph';

export type BottomTabGlyph = 'home' | 'trials' | 'explore' | 'onchain' | 'profile';

type BottomTabIconProps = {
  label: string;
  type: BottomTabGlyph;
  focused: boolean;
};

export const BottomTabIcon = ({ label, type, focused }: BottomTabIconProps) => {
  const glyphId = tabGlyphMap[type];
  const colors = focused ? ['#FF75FF', '#7AD8FF'] : ['#7A7F9F', '#5A6B9A'];
  return (
    <View style={[styles.container, focused ? styles.containerFocused : styles.containerInactive]}>
      <View style={[styles.glyphWrap, focused && styles.glyphWrapFocused]}>
        <QuickGlyph
          id={glyphId}
          size={22}
          strokeWidth={focused ? 2.1 : 1.8}
          colors={colors as [string, string]}
        />
      </View>
      <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </View>
  );
};

const tabGlyphMap: Record<BottomTabGlyph, QuickGlyphId> = {
  home: 'home',
  trials: 'trial',
  explore: 'explore',
  onchain: 'chain',
  profile: 'blindbox',
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
});
