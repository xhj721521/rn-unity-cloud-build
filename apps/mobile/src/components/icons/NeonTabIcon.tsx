import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { designTokens } from '@theme/designTokens';

export type TabGlyphType =
  | 'home'
  | 'trials'
  | 'explore'
  | 'onchain'
  | 'profile';

type NeonTabIconProps = {
  label: string;
  type: TabGlyphType;
  focused: boolean;
};

export const NeonTabIcon = ({ label, type, focused }: NeonTabIconProps) => {
  const stroke = focused ? designTokens.colors.accentPink : '#4F5175';

  return (
    <View style={styles.container}>
      <View style={[styles.badge, focused && styles.badgeActive]}>
        {renderGlyph(type, stroke)}
      </View>
      <Text
        style={[
          styles.label,
          focused ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {label}
      </Text>
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
    </View>
  );
};

const renderGlyph = (type: TabGlyphType, stroke: string) => {
  switch (type) {
    case 'home':
      return (
        <>
          <View style={[styles.glyphRoof, { borderColor: stroke }]} />
          <View style={[styles.glyphBody, { borderColor: stroke }]} />
        </>
      );
    case 'trials':
      return (
        <View style={[styles.glyphShield, { borderColor: stroke }]}>
          <View style={[styles.glyphSword, { backgroundColor: stroke }]} />
        </View>
      );
    case 'explore':
      return (
        <View style={[styles.glyphCompass, { borderColor: stroke }]}>
          <View
            style={[styles.glyphCompassNeedle, { backgroundColor: stroke }]}
          />
        </View>
      );
    case 'onchain':
      return (
        <>
          <View style={[styles.glyphChainLink, { borderColor: stroke }]} />
          <View
            style={[
              styles.glyphChainLink,
              styles.glyphChainLinkOffset,
              { borderColor: stroke },
            ]}
          />
        </>
      );
    case 'profile':
    default:
      return (
        <>
          <View style={[styles.glyphCircle, { borderColor: stroke }]} />
          <View
            style={[
              styles.glyphCircle,
              styles.glyphCircleSmall,
              { borderColor: stroke },
            ]}
          />
        </>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.sm,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: designTokens.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(70, 58, 128, 0.45)',
    backgroundColor: designTokens.colors.card,
  },
  badgeActive: {
    borderColor: 'rgba(139, 108, 255, 0.85)',
    shadowColor: designTokens.shadow.neon.color,
    shadowOffset: designTokens.shadow.neon.offset,
    shadowOpacity: designTokens.shadow.neon.opacity,
    shadowRadius: designTokens.shadow.neon.radius,
    elevation: designTokens.shadow.neon.elevation,
  },
  label: {
    marginTop: designTokens.spacing.xs,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: designTokens.colors.textPrimary,
  },
  labelInactive: {
    color: '#6C7193',
  },
  indicator: {
    marginTop: designTokens.spacing.xs,
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: designTokens.colors.accentPink,
    shadowColor: designTokens.shadow.glowPink.color,
    shadowOffset: designTokens.shadow.glowPink.offset,
    shadowOpacity: designTokens.shadow.glowPink.opacity,
    shadowRadius: designTokens.shadow.glowPink.radius,
    elevation: designTokens.shadow.glowPink.elevation,
  },
  glyphRoof: {
    width: 20,
    height: 12,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderRadius: 4,
  },
  glyphBody: {
    marginTop: 2,
    width: 20,
    height: 10,
    borderWidth: 2,
    borderRadius: 4,
  },
  glyphShield: {
    width: 22,
    height: 26,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphSword: {
    width: 4,
    height: 12,
    borderRadius: 2,
  },
  glyphCompass: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphCompassNeedle: {
    width: 2,
    height: 12,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  glyphChainLink: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  glyphChainLinkOffset: {
    position: 'absolute',
    transform: [{ translateX: 8 }],
  },
  glyphCircle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
  },
  glyphCircleSmall: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
