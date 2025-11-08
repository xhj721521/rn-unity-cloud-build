import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { shape, spacing } from '@theme/tokens';
import { neonPalette } from '@theme/neonPalette';
import { typography } from '@theme/typography';
import QuickGlyph, { QuickGlyphId } from './QuickGlyph';

export type BottomTabGlyph = 'home' | 'trials' | 'explore' | 'onchain' | 'profile';

type BottomTabIconProps = {
  label: string;
  type: BottomTabGlyph;
  focused: boolean;
};

export const BottomTabIcon = ({ label, type, focused }: BottomTabIconProps) => {
  const glyphId = tabGlyphMap[type];
  const colors = focused
    ? ['#8AF0FF', '#C68BFF']
    : ['rgba(134,148,188,0.9)', 'rgba(118,130,168,0.8)'];
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
      <Text
        style={[
          typography.micro,
          styles.label,
          focused ? styles.labelActive : styles.labelInactive,
        ]}
      >
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
    borderColor: 'rgba(120, 146, 210, 0.32)',
    backgroundColor: 'rgba(12, 16, 32, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphWrapFocused: {
    borderColor: 'rgba(138, 240, 255, 0.65)',
    backgroundColor: 'rgba(18, 24, 48, 0.85)',
    shadowColor: '#8AF0FF',
    shadowOpacity: 0.32,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  label: {
    textTransform: 'none',
  },
  labelActive: {
    color: neonPalette.textPrimary,
    textShadowColor: 'rgba(138, 240, 255, 0.6)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  labelInactive: {
    color: neonPalette.textMuted,
    opacity: 0.72,
  },
});
