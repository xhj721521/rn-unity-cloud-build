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
  const stroke = focused
    ? designTokens.colors.accentPink
    : 'rgba(236, 241, 255, 0.6)';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconRing,
          focused ? styles.iconRingActive : styles.iconRingIdle,
        ]}
      >
        <View style={styles.iconSurface}>{renderGlyph(type, stroke)}</View>
      </View>
      <Text
        style={[
          styles.label,
          focused ? styles.labelActive : styles.labelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
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
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.xs,
  },
  iconRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconRingActive: {
    borderColor: designTokens.colors.accentPink,
    shadowColor: designTokens.colors.accentPink,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  iconRingIdle: {
    borderColor: 'rgba(236, 241, 255, 0.22)',
    opacity: 0.6,
  },
  iconSurface: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelActive: {
    color: designTokens.colors.textPrimary,
  },
  labelInactive: {
    color: 'rgba(236, 241, 255, 0.6)',
  },
  glyphRoof: {
    width: 18,
    height: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderRadius: 3,
  },
  glyphBody: {
    marginTop: 1,
    width: 18,
    height: 8,
    borderWidth: 2,
    borderRadius: 3,
  },
  glyphShield: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphSword: {
    width: 4,
    height: 12,
    borderRadius: 2,
  },
  glyphCompass: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
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
    width: 18,
    height: 9,
    borderWidth: 2,
    borderRadius: 5,
  },
  glyphChainLinkOffset: {
    position: 'absolute',
    transform: [{ translateX: 8 }],
  },
  glyphCircle: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 9,
  },
  glyphCircleSmall: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
});
