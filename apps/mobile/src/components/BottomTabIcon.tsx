import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { shape } from '@theme/tokens';
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
  const glyphColors = focused
    ? ['#6BE6FF', '#B38BFF']
    : ['rgba(140,154,191,0.9)', 'rgba(120,132,170,0.75)'];

  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={
          focused
            ? ['rgba(8, 199, 255, 0.26)', 'rgba(138, 92, 255, 0.24)']
            : ['rgba(20, 30, 54, 0.55)', 'rgba(9, 13, 29, 0.55)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.pill, focused && styles.pillFocused]}
      >
        <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
          <QuickGlyph
            id={glyphId}
            size={20}
            strokeWidth={focused ? 2 : 1.6}
            colors={glyphColors as [string, string]}
          />
        </View>
        <Text style={[typography.captionCaps, focused ? styles.labelActive : styles.labelInactive]}>
          {label}
        </Text>
      </LinearGradient>
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
  shadow: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  pill: {
    minWidth: 64,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pillFocused: {
    borderColor: '#62E5FF',
    shadowColor: '#67E1FF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: shape.buttonRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(10,16,32,0.7)',
  },
  labelActive: {
    color: neonPalette.textPrimary,
  },
  labelInactive: {
    color: neonPalette.textMuted,
    opacity: 0.8,
  },
});
